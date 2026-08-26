import { createReadStream, existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { createBrotliDecompress } from "node:zlib";
import serverlessChromium, { inflate } from "@sparticuz/chromium";
import { chromium as playwrightChromium } from "playwright-core";
import tar from "tar-fs";

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const MIME = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

export async function startStaticServer({ port = 0 } = {}) {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://127.0.0.1");
      const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
      const normalized = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
      const filePath = join(REPO_ROOT, normalized);
      if (!filePath.startsWith(REPO_ROOT)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) throw new Error("Not a file");
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": MIME[extname(filePath)] || "application/octet-stream"
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  const address = server.address();
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}

export async function chromiumExecutable() {
  const temporaryBinary = "/tmp/chromium";
  if (existsSync(temporaryBinary)) {
    const info = await stat(temporaryBinary);
    if (info.size > 1_000_000) return temporaryBinary;
  }
  return inflate(join(REPO_ROOT, "node_modules/@sparticuz/chromium/bin/chromium.br"));
}

async function extractTarBrotli(source, destination, sentinel) {
  if (existsSync(sentinel)) return;
  await mkdir(destination, { recursive: true });
  await pipeline(
    createReadStream(source),
    createBrotliDecompress({ chunkSize: 2 ** 21 }),
    tar.extract(destination, { chown: false })
  );
}

async function ensureChromiumAssets() {
  const binRoot = join(REPO_ROOT, "node_modules/@sparticuz/chromium/bin");
  await extractTarBrotli(join(binRoot, "fonts.tar.br"), "/tmp/fonts", "/tmp/fonts/Open_Sans/OpenSans-Regular.ttf");
  await extractTarBrotli(join(binRoot, "swiftshader.tar.br"), "/tmp", "/tmp/libGLESv2.so");
  await mkdir("/tmp/lienzo-font-cache", { recursive: true });
}

export async function launchBrowser() {
  await ensureChromiumAssets();
  serverlessChromium.setGraphicsMode = false;
  return playwrightChromium.launch({
    executablePath: await chromiumExecutable(),
    headless: true,
    args: [...serverlessChromium.args, "--hide-scrollbars", "--force-color-profile=srgb"],
    env: { ...process.env, XDG_CACHE_HOME: "/tmp/lienzo-font-cache" }
  });
}

export async function openRuntime(page, baseUrl, options = {}) {
  const query = new URLSearchParams({
    capture: options.capture === false ? "0" : "1",
    variant: options.variant || "enhanced_immersive",
    slide: options.slide || "slide-02",
    reducedMotion: options.reducedMotion ? "1" : "0",
    motionScale: String(options.motionScale ?? 1)
  });
  if (options.hold) query.set("hold", options.hold);
  await page.goto(`${baseUrl}/?${query}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__LIENZO_RUNTIME__?.isReady === true);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(40);
}
