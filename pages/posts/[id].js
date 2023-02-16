import React from 'react';
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
  const ids = [...new Array(100)].map((x, i) => i + 1);
  return {
    paths: ids.map((id) => ({params: {id: id.toString()}})),
    fallback: 'blocking',
  };
}

async function refresh(id) {
  const path = `/.netlify/functions/hello-world?postId=${id}`;
  console.log('fetching', path);
  fetch(path);
}

export default function Page({id, serverGenerated}) {
  const [refreshResult, setRefreshResult] = React.useState(null);
  return (
    <center>
      <div style={{width: 400}}>
        <h2>
          Post {id} generated at{' '}
          {new Date(serverGenerated).toLocaleTimeString()}
        </h2>

        <div>
          <Link href={`/posts/${id + 1}`}>{`Go to page ${id + 1}`}</Link>
        </div>
        <div>
          <p>
            <button
              onClick={async (e) => {
                try {
                  const res = await fetch(
                    `./.netlify/functions/hello-world?postId=${id}`,
                  );
                  const json = await res.json();
                  setRefreshResult(json);
                } catch (e) {
                  console.error(e);
                  setRefreshResult({error: e.message});
                }
              }}
            >
              Run refresh hook for this page (just the html version)
            </button>
          </p>
        </div>
        {refreshResult ? (
          <div style={{textAlign: 'left'}}>
            <p>Result:</p>
            <pre>{JSON.stringify(refreshResult, null, 2)}</pre>
            <p>Refresh the page to see if the timestamp updated</p>
          </div>
        ) : null}
      </div>
    </center>
  );
}
