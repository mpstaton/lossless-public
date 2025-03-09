const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

const options = {
  hostname: 'r.jina.ai',
  path: '/https://example.com',
  headers: {
    'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
    'X-Return-Format': 'markdown'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(data);
  });
}).on('error', (err) => {
  console.error(err);
});
