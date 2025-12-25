export const prerender = false;

const TTL = 1000 * 60 * 10; // 10 минут
let cache: { ts: number; data: any } | null = null;

const LEETCODE_USERNAME = "Artur_648"; // <-- твой юзер

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return new Response(JSON.stringify(cache.data), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          realName
          userAvatar
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // без auth, это публичные данные
      },
      body: JSON.stringify({
        query,
        variables: { username: LEETCODE_USERNAME },
      }),
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      return new Response(
        JSON.stringify({ error: "LeetCode GraphQL failed", details: json }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const u = json.data?.matchedUser;
    if (!u) {
      return new Response(JSON.stringify({ error: "LeetCode user not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const nums: Array<{ difficulty: string; count: number }> =
      u.submitStatsGlobal?.acSubmissionNum ?? [];

    const get = (d: string) => nums.find((x) => x.difficulty === d)?.count ?? 0;

    const data = {
      leetcode: {
        username: u.username,
        profileUrl: `https://leetcode.com/u/${u.username}/`,
        avatar: u.profile?.userAvatar ?? null,
        ranking: u.profile?.ranking ?? null,
        solved: {
          all: get("All"),
          easy: get("Easy"),
          medium: get("Medium"),
          hard: get("Hard"),
        },
      },
      updatedAt: new Date().toISOString(),
    };

    cache = { ts: Date.now(), data };

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
