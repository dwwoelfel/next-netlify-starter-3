import Link from 'next/link';

export async function getStaticProps(props) {
  const now = Date.now();
  return {
    props: {
      serverGenerated: now,
      dateS: new Date(now).toLocaleString(),
      id: parseInt(props.params.id, 10),
    },
    revalidate: parseInt(props.params.id, 10) * 10,
  };
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  const ids = [...new Array(100)].map((x, i ) => i + 1)
  return {paths: ids.map(id => ({params: {id: id.toString()}})), fallback: 'blocking'};
}

export default function Page({id, serverGenerated}) {
  return (
    <center>
      <div>
        <h2>
          Post {id} generated at{' '}
          {new Date(serverGenerated).toLocaleTimeString()}
        </h2>

        <div>
          <Link href={`/posts/${id + 1}`}>{`Go to page ${id + 1}`}</Link>
        </div>
      </div>
    </center>
  );
}
