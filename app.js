
const express = require('express')
const path = require('path')
const fetch = require('cross-fetch')
const app = express()
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

var multer = require('multer');
var forms = multer({limits: { fieldSize: 10*1024*1024 }});
app.use(forms.array()); 

const bodyParser = require('body-parser')
app.use(bodyParser.json({limit : '150mb' }));  
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('tiny'))

app.all(`/bot*`, async (req, res) => {

  if ( argv.key ) {
    const apiKey = req.header('tg-proxy-key');
    if (!apiKey || apiKey !== argv.key) {
      return res.status(403).json({ error: 'Unauthorized: Invalid API Key, add api key as tg-proxy-key in header' });
    }
  }

  const url = `https://api.telegram.org${req.url}`;
  const options = {
      method: req.method,
      headers: {'content-type': 'application/json; charset=utf-8'},
  };
  if( req.method.toLocaleLowerCase() === 'post' && req.body ) options.body = JSON.stringify(req.body);

  const response = await fetch(url, options);
  const data = await response.json();
  res.json(data);

})

// Error handler
app.use(function(err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Serverless Error')
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



