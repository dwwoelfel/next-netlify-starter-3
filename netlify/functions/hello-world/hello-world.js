import https from 'https';

function runRefresh({postId, domain, token}) {
  console.log('token', token);
  const siteId = process.env.SITE_ID;
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      paths: postId === -1 ? ['/api/test'] : [`/posts/${postId}`],
      domain,
    });
    let data = '';
    const req = https.request(
      {
        hostname:
          siteId === '5cc18de3-96f9-4e29-be9c-6cda5a35ed1a'
            ? 'api-staging.netlify.com'
            : 'api.netlify.com',
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

const handler = async (event, context) => {
  try {
    const odbRefreshToken = context.clientContext.custom.odb_refresh_hooks;
    console.log(JSON.stringify(process.env, null, 2));
    console.log('token', odbRefreshToken);
    console.log(context);
    if (!odbRefreshToken) {
      return {
        statusCode: 400,
        body: 'refresh hooks not enabled for site in proxy',
      };
    }

    const postId = parseInt(event.queryStringParameters.postId || '1');

    const json = await runRefresh({
      domain: event.headers.host,
      token: odbRefreshToken,
      postId,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {refreshResult: json, refreshedPostId: postId},
        null,
        2,
      ),
    };
  } catch (error) {
    return {statusCode: 500, body: error.toString()};
  }
};

module.exports = {handler};
