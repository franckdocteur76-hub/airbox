"use strict";

/**
 * OneTechk Unlock — application desktop portable.
 *
 * Le build statique Next.js (dossier « renderer/ ») est servi par un petit serveur
 * HTTP local sur 127.0.0.1, puis affiché dans une fenêtre native. Aucun accès réseau
 * externe n'est nécessaire : l'application fonctionne 100 % hors ligne.
 */

const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");

const { startServer } = require("./server");

const RENDERER = path.join(__dirname, "renderer");
const YOUTUBE = "https://www.youtube.com/@OneTechk";
const WEBSITE = "https://onetechk.vercel.app";
const SELFTEST = process.argv.includes("--selftest");

const SELFTEST_SCRIPT = `(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const el = document.getElementById("imei");
  if (!el) return { ok: false, step: "champ introuvable" };
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  setter.call(el, "123456789012345");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  await wait(80);
  document.querySelector('button[type="submit"]').click();
  await wait(800);
  const codes = [...document.querySelectorAll(".code")].map((n) => n.textContent.trim());
  const cta = document.querySelector(".cta-btn");
  return {
    ok: codes.length === 2 && codes[0] === "88739373" && codes[1] === "88730373",
    codes,
    youtube: cta ? cta.getAttribute("href") : null,
    title: document.title,
    images: [...document.images].every((i) => i.complete && i.naturalWidth > 0),
  };
})()`;

function buildMenu(win) {
  return Menu.buildFromTemplate([
    {
      label: "Fichier",
      submenu: [
        { label: "Recharger", accelerator: "F5", click: () => win && win.reload() },
        { type: "separator" },
        { role: "quit", label: "Quitter" },
      ],
    },
    {
      label: "Affichage",
      submenu: [
        { role: "zoomIn", label: "Agrandir" },
        { role: "zoomOut", label: "Réduire" },
        { role: "resetZoom", label: "Taille normale" },
        { type: "separator" },
        { role: "toggleDevTools", label: "Outils de développement" },
      ],
    },
    {
      label: "Aide",
      submenu: [
        { label: "Chaîne YouTube @OneTechk", click: () => shell.openExternal(YOUTUBE) },
        { label: "Site web", click: () => shell.openExternal(WEBSITE) },
        { type: "separator" },
        {
          label: "À propos",
          click: () =>
            dialog.showMessageBox(win, {
              type: "info",
              title: "À propos",
              message: "OneTechk Unlock",
              detail:
                "Générateur de code NCK — TECHNO TR118 (Orange AirBox)\n\n" +
                "Calcul 100 % local, aucune donnée envoyée.\n" +
                "Application créée par OneTechk.\n\n" +
                "YouTube : " +
                YOUTUBE,
              buttons: ["OK"],
            }),
        },
      ],
    },
  ]);
}

let server = null;
let mainWindow = null;

async function createWindow() {
  server = await startServer(RENDERER);
  const origin = `http://127.0.0.1:${server.address().port}`;

  mainWindow = new BrowserWindow({
    width: 1120,
    height: 900,
    minWidth: 380,
    minHeight: 600,
    show: false,
    backgroundColor: "#070b16",
    title: "OneTechk Unlock — Générateur NCK",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.setMenu(buildMenu(mainWindow));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(origin)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (SELFTEST) {
    const report = (payload) => {
      try {
        fs.writeFileSync(
          path.join(app.getPath("temp"), "onetech-selftest.json"),
          JSON.stringify(payload, null, 2),
        );
      } catch {
        /* ignore */
      }
      console.log("SELFTEST " + JSON.stringify(payload));
    };

    mainWindow.webContents.once("did-fail-load", (_e, code, desc, url) => {
      report({ ok: false, step: "did-fail-load", code, desc, url });
      setTimeout(() => app.exit(1), 100);
    });

    mainWindow.webContents.once("did-finish-load", async () => {
      try {
        const result = await mainWindow.webContents.executeJavaScript(SELFTEST_SCRIPT, true);
        report({ ...result, electron: process.versions.electron, origin });
        setTimeout(() => app.exit(result && result.ok ? 0 : 1), 200);
      } catch (error) {
        report({ ok: false, step: "executeJavaScript", error: error.message });
        app.exit(1);
      }
    });
  } else {
    mainWindow.once("ready-to-show", () => mainWindow.show());
  }

  await mainWindow.loadURL(origin + "/");
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    if (server) server.close();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("quit", () => {
    if (server) server.close();
  });
}
