export type Entry = { kind: string; audience: string; body: string; published: boolean };

export function customerFeed(entries: Entry[]): Entry[] {
  return entries.filter((entry) => entry.published && entry.audience === "customer");
}
