export const prerender = false;

import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "linkedin.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);

    return new Response(
      JSON.stringify({
        linkedin: {
          profileUrl: data.profileUrl,
          followers: Number(data.followers) || 0,
          posts2025: Number(data.posts2025) || 0,
          impressions2025: Number(data.impressions2025) || 0,
        },
        updatedAt: new Date().toISOString(),
        source: "manual",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "Failed to load LinkedIn stats" }),
      { status: 500 }
    );
  }
}
