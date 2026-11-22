// GET /api/team-status?id=...  ->  the job written by the team-run background function.
import { getStore } from "@netlify/blobs";
import { checkPassword, friendlyError, json } from "../../server/claude.mjs";

export default async (req) => {
  try {
    checkPassword(req);
    const id = new URL(req.url).searchParams.get("id") ?? "";
    const job = await getStore({ name: "team-jobs", consistency: "strong" }).get(id, { type: "json" });
    return job ? json(200, job) : json(404, { status: "queued" });
  } catch (err) {
    return json(err.status ?? 500, { error: friendlyError(err) });
  }
};

export const config = { path: "/api/team-status" };
