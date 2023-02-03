import https from 'https';

function runRefresh({domain, token}) {
  const siteId = process.env.NETLIFY_SITE_ID;
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({paths: ['/abcd'], domain});
    let data = '';
    const req = https.request(
      {
        hostname: 'api.netlify.com',
        port: 443,
        path: `/api/v1/sites/${siteId}/refresh_on_demand_builders`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          Authorization: `Bearer ${token}`,
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
  try {
    const odbRefreshToken = context.clientContext.custom.odb_refresh_hooks;
    if (!odbRefreshToken) {
      return {
        statusCode: 400,
        body: 'refresh hooks not enabled for site in proxy',
      };
    }

    const json = await runRefresh({
      domain: event.headers.host,
      token: odbRefreshToken,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({refreshResult: json}, null, 2),
    };
  } catch (error) {
    return {statusCode: 500, body: error.toString()};
  }
};

module.exports = {handler};
