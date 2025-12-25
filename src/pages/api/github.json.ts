export const prerender = false;

const TTL = 1000 * 60 * 10; // 10 минут
let cache: { ts: number; data: any } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return new Response(JSON.stringify(cache.data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN missing" }), { status: 500 });
  }

  const query = `
    query {
      viewer {
        login
        name
        url
        avatarUrl
        followers { totalCount }
        following { totalCount }
        publicRepos: repositories(privacy: PUBLIC) { totalCount }
        privateRepos: repositories(privacy: PRIVATE) { totalCount }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: "GitHub GraphQL failed", details: text }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = await res.json();
  const v = json?.data?.viewer;

  if (!v) {
    return new Response(JSON.stringify({ error: "No viewer in response", raw: json }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const pub = v.publicRepos?.totalCount ?? 0;
  const priv = v.privateRepos?.totalCount ?? 0;

  const data = {
    username: v.login,
    name: v.name,
    avatar: v.avatarUrl,
    profileUrl: v.url,
    followers: v.followers?.totalCount ?? 0,
    following: v.following?.totalCount ?? 0,
    repos: { public: pub, private: priv, total: pub + priv },
    updatedAt: new Date().toISOString(),
  };

  cache = { ts: Date.now(), data };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
