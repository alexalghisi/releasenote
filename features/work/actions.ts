"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";

export async function togglePublishAction(id: string, published: boolean) {
  const user = await requireUser();
  const db = await getDb();
  await db.query(
    `update releases r set published = $1
      from products p
     where r.id = $2 and r.product_id = p.id and p.organization_id = $3`,
    [published, id, user.organizationId],
  );
  revalidatePath("/app");
  revalidatePath("/app/feed");
}
