import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { togglePublishAction } from "@/features/work/actions";
import { Button } from "@/components/ui/button";

export default async function ReleasesPage() {
  const user = await requireUser();
  const db = await getDb();
  const rows = await db.query<{ id: string; version: string; published: boolean; product: string }>(
    `select r.id, r.version, r.published, p.name as product
       from releases r join products p on p.id = r.product_id
      where p.organization_id = $1`,
    [user.organizationId],
  );
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Releases</h1>
      <ul className="space-y-2">
        {rows.rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
            <span>{row.product} {row.version} · {row.published ? "live" : "draft"}</span>
            <form action={togglePublishAction.bind(null, row.id, !row.published)}>
              <Button size="sm" variant="outline">{row.published ? "Unpublish" : "Publish"}</Button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
