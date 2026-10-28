import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(projectRoot, "apps/client/dist");
const html = await readFile(path.join(outputDir, "index.html"), "utf8");
const assetReferences = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !/^(?:[a-z]+:|#|\/\/)/i.test(reference));

if (!assetReferences.length) throw new Error("The web build has no local assets to verify.");

for (const reference of assetReferences) {
  if (reference.startsWith("/")) throw new Error(`The web build contains a root-relative asset path: ${reference}`);
  const assetPath = path.resolve(outputDir, reference);
  if (!assetPath.startsWith(`${outputDir}${path.sep}`)) throw new Error(`The web build references an asset outside its package: ${reference}`);
  await access(assetPath);
}

console.log(`Verified ${assetReferences.length} relative web assets in apps/client/dist.`);
