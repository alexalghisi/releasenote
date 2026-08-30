import { describe, expect, it } from "vitest";
import { customerFeed } from "./domain";

describe("customerFeed", () => {
  it("hides drafts and internal notes", () => {
    const rows = [
      { kind: "added", audience: "customer", body: "SSO", published: true },
      { kind: "added", audience: "customer", body: "WIP", published: false },
      { kind: "fixed", audience: "internal", body: "pager", published: true },
    ];
    expect(customerFeed(rows).map((row) => row.body)).toEqual(["SSO"]);
  });
});
