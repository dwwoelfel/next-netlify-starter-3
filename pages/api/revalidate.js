export default async function handler(req, res) {
  console.log('req', req);
  // Check for secret to confirm this is a valid request

  try {
    const postId = req.query.post || '5';

    await res.revalidate(`/posts/${postId}`);

    return res.json({revalidated: true, postId});
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
