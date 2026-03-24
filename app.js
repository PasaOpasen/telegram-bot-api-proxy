
const express = require('express')
const path = require('path')
const fetch = require('cross-fetch')
const app = express()
var proxy = require('express-http-proxy');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

var https = require('https');
var fs = require('fs');
var morgan = require('morgan')

var https_options = {};

// Define CLI options using yargs
const argv = yargs(hideBin(process.argv))
  .option('key', {
    alias: 'k',
    description: 'Specify the server key to check all requests by tg-proxy-key header, empty means to not use authentification',
    type: 'string',
    default: '',
  })
  .option('skey', {
    alias: 'c',
    description: 'Specify the server key for https',
    type: 'string',
    default: '',
  })
  .option('cert', {
    alias: 't',
    description: 'Specify the server certificate for https',
    type: 'string',
    default: '',
  })
  .help()
  .alias('help', 'h')
  .argv;


if (argv.skey || argv.cert ) {
  if ( argv.skey && argv.cert ) {
    https = require('https');
    fs = require('fs');

    https_options = {
      key: fs.readFileSync(argv.skey),
      cert: fs.readFileSync(argv.cert)
    };

  } else {
    console.error("Both server key and certificate must be defined");
    process.exit(1);    
  }
}

app.use(morgan('tiny'))

// Helper function to check for multipart requests (file uploads)
const isMultipartRequest = (req) => {
    let contentTypeHeader = req.headers['content-type'];
    return contentTypeHeader && contentTypeHeader.indexOf('multipart') > -1;
};

// Conditional Body Parsing Middleware
app.use((req, res, next) => {
    // If it is a multipart request (file upload), skip body parsing and go straight to the proxy or next handler
    if (isMultipartRequest(req)) {
        return next();
    }

    if ( argv.key ) {
      const apiKey = req.header('tg-proxy-key');
      if (!apiKey || apiKey !== argv.key) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API Key, add api key as tg-proxy-key in header' });
      }
    }
    
    // Otherwise, apply standard body parsers for JSON and URL-encoded data
    express.json()(req, res, (jsonErr) => {
        if (jsonErr) return next(jsonErr);
        express.urlencoded({ extended: true })(req, res, next);
    });
});

app.use('/', proxy('https://api.telegram.org', {
  limit: '80mb',
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    delete headers['tg-proxy-key']
    return headers;
  }
}));

const bodyParser = require('body-parser')
app.use(bodyParser.json({limit : '150mb' }));  
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

if (Object.keys(https_options).length === 0) {

  app.listen(9000, () => {
    console.log(`Server start on http://localhost:9000`);
  })  

} else {

  https.createServer(https_options, app).listen(9000, () => {
    console.log(`HTTPS Server running on https://localhost:9000`);
  });

}



