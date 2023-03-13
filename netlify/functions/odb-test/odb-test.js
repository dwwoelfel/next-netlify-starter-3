const {builder} = require('@netlify/functions');
const twitterJson = require('./twitterJson.json');
const {gzip} = require('node-gzip');

const originalResponse = {
  body: JSON.stringify(twitterJson, null, 2),
  statusCode: 200,
  ttl: 60,
};

async function handler(event, context) {
  if (event.path.endsWith('gzip')) {
    const compressed = await gzip(originalResponse.body);
    compressed.length;
    return {...originalResponse, body: compressed.toString()};
  }
  return originalResponse;
}

exports.handler = builder(handler);
