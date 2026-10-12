import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { headersFor, type HeaderRule } from "../lib/response-headers";

const root = resolve("out");
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
  ".woff2": "font/woff2", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};
await stat(resolve(root, "index.html"));
// Serve the deployed security headers so E2E catches CSP regressions before Vercel does.
const { headers: rules } = JSON.parse(await readFile("vercel.json", "utf8")) as { headers: HeaderRule[] };
createServer(async (request, response) => {
  for (const [key, value] of Object.entries(headersFor(new URL(request.url ?? "/", "http://localhost").pathname, rules))) response.setHeader(key, value);
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end(); return;
  }
  let file: string;
  try {
    const path = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": types[extname(file)] ?? "application/octet-stream" });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(request.method === "HEAD" ? undefined : await readFile(resolve(root, "404.html")));
  }
}).listen(4173, "127.0.0.1", () => console.log("Static preview: http://127.0.0.1:4173"));
