"use strict";

/**
 * Mini serveur HTTP qui sert le build statique embarquÃ© (dossier Â« renderer Â»).
 * IsolÃ© de main.js pour pouvoir Ãªtre testÃ© sans lancer Electron.
 */

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

/**
 * @param {string} rootDir dossier Ã  servir
 * @returns {Promise<import("node:http").Server>} serveur Ã©coute sur 127.0.0.1 (port alÃ©atoire)
 */
function startServer(rootDir, port = 0) {
  const root = path.resolve(rootDir);

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
      } catch {
        res.writeHead(400).end("Bad request");
        return;
      }

      if (pathname === "/" || pathname.endsWith("/")) pathname += "index.html";

      const target = path.normalize(path.join(root, pathname));
      if (!target.startsWith(root)) {
        res.writeHead(403).end("Forbidden");
        return;
      }

      fs.readFile(target, (err, data) => {
        if (err) {
          fs.readFile(path.join(root, "404.html"), (err404, html) => {
            if (err404) {
              res.writeHead(404).end("Not found");
              return;
            }
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end(html);
          });
          return;
        }
        const type = MIME[path.extname(target).toLowerCase()] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
        res.end(data);
      });
    });

    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

module.exports = { startServer, MIME };

