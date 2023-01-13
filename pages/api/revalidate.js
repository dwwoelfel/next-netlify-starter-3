export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    console.log(res.revalidate);
    console.log(res.revalidate.toString());
    const revalidateResult = await res.revalidate('/posts/1');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
