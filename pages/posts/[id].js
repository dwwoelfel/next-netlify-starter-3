export async function getStaticProps(x) {
  console.log("getStaticProps", x);
  return {
    props: {
      x: 1,
      serverGenerated: Date.now(),
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [{ params: { id: "1" } }], fallback: "blocking" };
}

export default function Page({ x, serverGenerated }) {
  return (
    <div>
      <div>Generated at {new Date(serverGenerated).toLocaleString()}</div>
      <div>x: {x}</div>
    </div>
  );
}
