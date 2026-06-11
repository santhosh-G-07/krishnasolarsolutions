import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/assets", { recursive: true });
await cp("assets", "dist/assets", { recursive: true });
await Promise.all([
  cp("robots.txt", "dist/robots.txt"),
  cp("sitemap.xml", "dist/sitemap.xml"),
]);
