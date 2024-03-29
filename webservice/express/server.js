"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3200;
const YAML = require("yamljs");

const { db } = require("./db");
const bodyParser = require("body-parser");

const main = require("./main"),
  acteur = require("./api/acteur"),
  production = require('./api/production');

var pubkey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE9fYxdCsDLmYkMYJvkCMRvsBb5Tqr
ZxCwPRB5Oiz51EDeBSWT8wnanMM/F1oGXGIjXIePzZHBMwOiYlsu34ItzQ==
-----END PUBLIC KEY-----`;


/* app.use(function (req, res, next) {
  var token = req.headers.authorization;
  var decoded = jwt.verify(token, pubkey);
  console.log(decoded)
  if (decoded && decode.roles.includes('manager'))
  {
   next();
  }
  else
  {
    res.send(401);
  }
});
*/

app.use(cors({ origin: 'null' }));
app.use(bodyParser.json());

app.use('/', main());
app.use('/api/acteur', acteur(db));
app.use('/api/production', production(db));
app.use('/assets', express.static('assets'));

const swaggerUI = require('swagger-ui-express');
/*
const swaggerDocument = require('./swagger.json');;
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
*/

// https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Cinema Express (swaggerJSDoc)',
    version: '1.0.0',
    contact: {
      name: 'Emmanuel Medina',
      url: 'https://gitlab.com/cinema3/cinema-web-api',
    },
  },
  servers: [
    {
      url: 'http://localhost:8002/api',
      description: 'Development server',
    },
  ],
};

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  swaggerDefinition,
  apis: ['./api/*.js'],
};

const swaggerDocument = swaggerJSDoc(options);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


app.listen(port, () => {
  console.log(`Server is running on ${port} port.`);
})
