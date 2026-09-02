import { z } from "zod";
import fs from "node:fs";
import path from "node:path";

const Parameter = z.object({
  name: z.string().min(1),
  result: z.number().nonnegative().nullable(), // null = not detected
  unit: z.string().min(1),
  limit: z.number().positive(),
  detectionLimit: z.number().positive(),
  standard: z.string().min(1),
  pass: z.boolean(),
});

export const Batch = z.object({
  batchId: z.string().regex(/^NFT-\d+$/),
  harvest: z.string().regex(/^\d{4}-\d{2}$/),
  testedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lab: z.object({
    name: z.string(),
    accreditation: z.string(),
    reportUrl: z.string(),
  }),
  parameters: z.array(Parameter).min(1),
  products: z.array(z.string()),
});

export type Batch = z.infer<typeof Batch>;
export type Parameter = z.infer<typeof Parameter>;

/** Overall verdict. One per batch — the only place cleared/restricted is used. */
export const verdict = (b: Batch) =>
  b.parameters.every((p) => p.pass) ? "cleared" : "restricted";

/** Fraction of the limit, 0–1, for the inline bar. Non-detects read as 0. */
export const share = (p: Parameter) =>
  Math.min((p.result ?? 0) / p.limit, 1);

export const display = (p: Parameter) =>
  p.result === null ? `< ${p.detectionLimit}` : String(p.result);

const dir = path.join(process.cwd(), "content", "batches");

export function allBatches(): Batch[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => Batch.parse(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"))))
    .sort((a, b) => b.testedOn.localeCompare(a.testedOn));
}

export const getBatch = (id: string) =>
  allBatches().find((b) => b.batchId === id);
