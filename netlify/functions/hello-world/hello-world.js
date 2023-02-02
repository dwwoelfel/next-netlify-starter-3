function runRefresh(token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({paths: ['/abcd']});
    let data = '';
    const req = https.request(
      {
        hostname: 'api.netlify.com',
        port: 443,
        path: '/api/v1/sites/40ce9daa-744e-471e-ba5c-afa7cbac4c42/refresh_on_demand_builders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
      },
      (res) => {
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      },
    );
    req.write(body);
    req.end();
  });
}

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event, context) => {
  console.log('event', event);
  console.log('context', context);
  try {
    const json = await runRefresh(
      'context.clientContext.custom.odb_refresh_hooks',
    );
    console.log('res', json);
    const subject = event.queryStringParameters.name || 'World';
    return {
      statusCode: 200,
      body: JSON.stringify({message: `Hello ${subject}`}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    return {statusCode: 500, body: error.toString()};
  }
};

module.exports = {handler};
