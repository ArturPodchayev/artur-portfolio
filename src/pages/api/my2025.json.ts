export const prerender = false;

const TTL = 1000 * 60 * 10; // 10 минут
let cache: { ts: number; data: any } | null = null;

const START_2025 = "2025-01-01T00:00:00Z";

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

  // до текущего момента (внутри 2025)
  const to = new Date().toISOString();

  // 1) commits in 2025 (commit contributions)
  const baseQuery = `
    query($from: DateTime!, $to: DateTime!, $after: String) {
      viewer {
        login
        url
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
        }
        repos: repositories(
          first: 100,
          after: $after,
          ownerAffiliations: OWNER,
          orderBy: { field: CREATED_AT, direction: DESC }
        ) {
          pageInfo { hasNextPage endCursor }
          nodes { createdAt }
        }
      }
    }
  `;

  async function gql(variables: Record<string, any>) {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: baseQuery, variables }),
    });

    const json = await res.json();
    if (!res.ok || json.errors) {
      return { ok: false, json };
    }
    return { ok: true, json };
  }

  // 2) repos created in 2025 — пагинация, но можно рано остановиться
  let after: string | null = null;
  let reposCreated2025 = 0;
  let stop = false;
  let viewerLogin = "";
  let viewerUrl = "";
  let commits2025 = 0;

  while (!stop) {
    const r = await gql({ from: START_2025, to, after });
    if (!r.ok) {
      return new Response(
        JSON.stringify({ error: "GitHub GraphQL failed", details: r.json }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const v = r.json.data.viewer;
    if (!viewerLogin) {
      viewerLogin = v.login;
      viewerUrl = v.url;
      commits2025 = v.contributionsCollection?.totalCommitContributions ?? 0;
    }

    const nodes: Array<{ createdAt: string }> = v.repos?.nodes ?? [];

    for (const n of nodes) {
      // createdAt >= 2025-01-01 => считаем
      if (n.createdAt >= START_2025) reposCreated2025++;
      else {
        // так как сортировка DESC по createdAt — дальше будут ещё старее => можно стопать
        stop = true;
        break;
      }
    }

    const pi = v.repos?.pageInfo;
    if (!stop && pi?.hasNextPage) {
      after = pi.endCursor;
    } else {
      stop = true;
    }
  }

  const data = {
    github: {
      username: viewerLogin,
      profileUrl: viewerUrl,
      commits2025,        // commit contributions in 2025
      reposCreated2025,   // repos created in 2025 (private+public)
    },
    updatedAt: new Date().toISOString(),
  };

  cache = { ts: Date.now(), data };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
