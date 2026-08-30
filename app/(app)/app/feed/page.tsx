import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { customerFeed } from "@/lib/domain";

export default async function FeedPage() {
  await requireUser();
  const db = await getDb();
  const rows = await db.query<{ kind: string; audience: string; body: string; published: boolean }>(
    `select e.kind, e.audience, e.body, r.published
       from entries e join releases r on r.id = e.release_id`,
  );
  const visible = customerFeed(rows.rows);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customer feed</h1>
      <p className="text-sm text-muted-foreground">Internal and unpublished entries are hidden by the same function the tests cover.</p>
      <ul className="space-y-2 text-sm">
        {visible.map((row, i) => (
          <li key={i} className="rounded-xl border border-border bg-card p-3">{row.kind}: {row.body}</li>
        ))}
      </ul>
    </div>
  );
}
