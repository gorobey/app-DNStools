'use strict';
const express = require('express');
const app = express();
//const dnstools = require('./dnstools/index.js');

const dnstools = require('./dnstools');
//exports.Text = dnstools;

const APP_VERSION={ver: '0.0.0.3'};

function getDomain(reqparms){
  console.log('p', reqparms);
  let r;
  if(reqparms.domainName){
    r = reqparms.domainName;
  } else {
    // set the default
    r = 'dwarfstar.co.nz';
  }
  return r;
}

app.get('/', (req, res) => {
  dnstools.dnsNS(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/ns/:domainName', (req, res) => {
  dnstools.dnsNS(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/mx/:domainName', (req, res) => {
  dnstools.dnsMX(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/txt/:domainName', (req, res) => {
  dnstools.dnsTXT(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/all/:domainName', (req, res) => {
  dnstools.dnsALL(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/resolve/:domainName', (req, res) => {
  dnstools.dnsResolve(getDomain(req.params))
  .then(r => {
    res.json(r);
  })
  .catch(e => {
    console.error(e);
    res.status(301).send(e);
  });
});

app.get('/ver', (req, res) => {
  res.json(APP_VERSION);
});

  const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});