import Link from "next/link";

export async function getStaticProps(props) {
  const now = Date.now();
  console.log(new Error("test"));
  console.log("getStaticProps", now, new Date(now).toLocaleTimeString(), props);
  return {
    props: {
      serverGenerated: now,
      dateS: new Date(now).toLocaleString(),
      id: parseInt(props.params.id, 10),
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

export default function Page({ id, serverGenerated }) {
  return (
    <div>
      <div>Generated at {new Date(serverGenerated).toLocaleString()}</div>
      <div>Id: {id}</div>
      <div>
        <Link href={`/posts/${id + 1}`}>{id + 1}</Link>
      </div>
    </div>
  );
}
