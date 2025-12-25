import { useEffect, useMemo, useState } from "react";

function Pill({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300">
      {children}
    </span>
  );
}

function ProviderBlock({ title, subtitle, href, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-400">{title}</div>
          <div className="mt-1 text-lg font-semibold">{subtitle}</div>
        </div>

        {href && (
          <a
            className="text-sm text-zinc-300 hover:text-white transition"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            Open →
          </a>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function SkeletonRow({ cols = 3 }) {
  const items = Array.from({ length: cols });
  return (
    <div className={`grid gap-3 ${cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
      {items.map((_, i) => (
        <div
          key={i}
          className="h-[78px] rounded-2xl border border-white/10 bg-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

export default function My2025() {
  const [data, setData] = useState(null); // тут будет { ...my2025, leetcode }
  const [err, setErr] = useState("");

useEffect(() => {
  let alive = true;

  (async () => {
    try {
      const [ghRes, lcRes, liRes] = await Promise.all([
        fetch("/api/my2025.json"),
        fetch("/api/leetcode.json"),
        fetch("/api/linkedin.json"),
      ]);

      const gh = await ghRes.json();
      const lc = await lcRes.json();
      const li = await liRes.json();

      if (!ghRes.ok) throw new Error(gh?.error || "GitHub failed");
      if (!lcRes.ok) throw new Error(lc?.error || "LeetCode failed");
      if (!liRes.ok) throw new Error(li?.error || "LinkedIn failed");

      if (alive) {
        setData({
          github: gh.github,
          leetcode: lc.leetcode,
          linkedin: li.linkedin,
          updatedAt: new Date().toISOString(),
          updatedAtSources: {
            github: gh.updatedAt,
            leetcode: lc.updatedAt,
            linkedin: li.updatedAt,
          },
        });
      }
    } catch (e) {
      // setErr...
    }
  })();

  return () => (alive = false);
}, []);


  const updated = useMemo(() => {
    if (!data?.updatedAt) return "";
    try {
      return new Date(data.updatedAt).toLocaleString();
    } catch {
      return "";
    }
  }, [data]);

  const lcUpdated = useMemo(() => {
    // leetcode.json тоже имеет updatedAt, но мы его не сохраняем отдельно.
    // Если хочешь — можем прокинуть, но сейчас используем общий updated.
    return updated;
  }, [updated]);

  return (
    <section id="my2025" className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">My 2025</h2>
          <p className="mt-2 text-zinc-400">
            Live stats from my grind.{updated ? ` Updated: ${updated}` : ""}
          </p>
        </div>
      </div>

      {err ? (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          Failed to load stats: {err}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* GitHub block (2025 only) */}
          <ProviderBlock
            title="GitHub"
            subtitle={data ? `@${data.github?.username}` : "Loading..."}
            href={data?.github?.profileUrl}
          >
            {!data ? (
              <SkeletonRow cols={2} />
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <Metric
                    label="Commits (2025)"
                    value={data.github?.commits2025 ?? "—"}
                  />
                  <Metric
                    label="Repos created (2025)"
                    value={data.github?.reposCreated2025 ?? "—"}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>Live from GitHub GraphQL</Pill>
                  <Pill>Updated: {updated || "—"}</Pill>
                </div>
              </>
            )}
          </ProviderBlock>

          {/* LeetCode block (All-time) */}
          <ProviderBlock
            title="LeetCode"
            subtitle={
              data?.leetcode?.username ? `@${data.leetcode.username}` : "Loading..."
            }
            href={data?.leetcode?.profileUrl || "https://leetcode.com/u/Artur_648/"}
          >
            {!data ? (
              <SkeletonRow cols={3} />
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric label="Solved (all-time)" value={data.leetcode?.solved?.all ?? "—"} />
                  <Metric label="Ranking" value={data.leetcode?.ranking ?? "—"} />
                  <Metric label="Hard (all-time)" value={data.leetcode?.solved?.hard ?? "—"} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>Live from LeetCode GraphQL</Pill>
                  <Pill>All-time</Pill>
                  <Pill>Updated: {lcUpdated || "—"}</Pill>
                </div>
              </>
            )}
          </ProviderBlock>

          {/* LinkedIn placeholder */}
        <ProviderBlock
  title="LinkedIn"
  subtitle="Profile"
  href={data?.linkedin?.profileUrl}
>
  <div className="grid gap-3 md:grid-cols-3">
    <Metric label="Followers" value={data?.linkedin?.followers ?? "—"} />
    <Metric label="Posts (2025)" value={data?.linkedin?.posts2025 ?? "—"} />
    <Metric label="Impressions (2025)" value={data?.linkedin?.impressions2025 ?? "—"} />
  </div>

  <div className="mt-4 flex flex-wrap gap-2">
    <Pill>Manual update</Pill>
    <Pill>Updated: {updated || "—"}</Pill>
  </div>
</ProviderBlock>

        </div>
      )}
    </section>
  );
}
