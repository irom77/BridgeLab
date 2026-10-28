import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";

const { version } = JSON.parse(readFileSync(new URL("./apps/client/package.json", import.meta.url), "utf8")) as { version: string };

export default defineConfig({
  define: { __CONTRACTPLAY_VERSION__: JSON.stringify(version) }
});
