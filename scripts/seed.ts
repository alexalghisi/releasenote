import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "../lib/db/schema-sql";
import { hashPassword } from "../lib/auth/password";

const email = "demo@releasenote.dev";
const orgId = "org_demo";
const userId = "user_demo";

async function main() {
  mkdirSync(path.join(process.cwd(), ".data"), { recursive: true });
  const db = new PGlite(path.join(process.cwd(), ".data", "pglite"));
  await db.waitReady;
  await db.exec(SCHEMA_SQL);
  const passwordHash = await hashPassword("DemoPass123!");
  await db.query("insert into users (id, email, password_hash) values ($1, $2, $3) on conflict (email) do nothing", [userId, email, passwordHash]);
  await db.query("insert into profiles (user_id, display_name) values ($1, $2) on conflict (user_id) do nothing", [userId, "Alex Demo"]);
  await db.query("insert into organizations (id, name, slug) values ($1, $2, $3) on conflict (id) do nothing", [orgId, "Harborline Product", "releasenote"]);
  await db.query("insert into organization_members (id, organization_id, user_id, role) values ($1, $2, $3, $4) on conflict do nothing", ["mem_1", orgId, userId, "owner"]);

  await db.query("insert into products (id, organization_id, name) values ($1,$2,$3)", ["pr1", orgId, "Harborline Cloud"]);
  await db.query("insert into releases (id, product_id, version, published) values ($1,$2,$3,$4)", ["rel1", "pr1", "1.4.0", true]);
  await db.query("insert into releases (id, product_id, version, published) values ($1,$2,$3,$4)", ["rel2", "pr1", "1.5.0-rc", false]);
  await db.query("insert into entries (id, release_id, kind, audience, body) values ($1,$2,$3,$4,$5)", ["e1", "rel1", "added", "customer", "SSO for workspace owners"]);
  await db.query("insert into entries (id, release_id, kind, audience, body) values ($1,$2,$3,$4,$5)", ["e2", "rel1", "fixed", "internal", "Pager duty routing"]);
  await db.query("insert into entries (id, release_id, kind, audience, body) values ($1,$2,$3,$4,$5)", ["e3", "rel2", "added", "customer", "Draft only"]);
  console.log("Seeded ReleaseNote");
}

main();
