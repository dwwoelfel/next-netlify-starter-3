const { builder } = require("@netlify/functions")
const twitterJson = require('./twitterJson.json')

const originalResponse = {
  body: JSON.stringify(twitterJson, null, 2),
  statusCode: 200,
  ttl: 60,
}

async function handler(event, context) {
  return originalResponse
}

exports.handler = builder(handler);
