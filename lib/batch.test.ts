import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { Batch, verdict, share, display } from "./batch.ts";

const raw = JSON.parse(
  fs.readFileSync("content/batches/_example.json.todo", "utf8"),
);
const b = Batch.parse(raw);

test("example batch matches the schema", () => {
  assert.equal(b.batchId, "NFT-142");
});

test("verdict is cleared only when every parameter passes", () => {
  assert.equal(verdict(b), "cleared");
  const failed = { ...b, parameters: [{ ...b.parameters[0], pass: false }] };
  assert.equal(verdict(failed), "restricted");
});

test("non-detects read as zero share and show as < detection limit", () => {
  assert.equal(share(b.parameters[0]), 0);
  assert.equal(display(b.parameters[0]), "< 0.01");
});

test("share is a fraction of the limit, clamped at 1", () => {
  const p = { ...b.parameters[0], result: 0.5 };
  assert.equal(share(p), 0.25);
  assert.equal(share({ ...p, result: 99 }), 1);
});

test("schema rejects a malformed batch id", () => {
  assert.throws(() => Batch.parse({ ...raw, batchId: "142" }));
});
