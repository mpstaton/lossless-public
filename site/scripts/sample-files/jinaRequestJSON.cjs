const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');
const dotenv = require('dotenv');
const { fetch } = require('undici');
const https = require('https');

const options = {
  hostname: 'r.jina.ai',
  path: '/https://example.com',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
    'X-Return-Format': 'markdown',
    'X-With-Links-Summary': 'true',
    'X-With-Shadow-Dom': 'true'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(data);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.end();
