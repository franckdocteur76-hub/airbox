import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0e1a36"/>
      <stop offset="1" stop-color="#060a14"/>
    </linearGradient>
    <linearGradient id="key" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5cf0c2"/>
      <stop offset="1" stop-color="#2ec4d6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="238" r="152" fill="#38e2b0" opacity="0.09"/>
  <g fill="none" stroke="url(#key)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
    <path d="M176 232v-56a80 80 0 0 1 160 0v22"/>
    <rect x="140" y="222" width="232" height="156" rx="42"/>
  </g>
  <circle cx="256" cy="288" r="22" fill="#38e2b0"/>
  <rect x="245" y="296" width="22" height="44" rx="11" fill="#38e2b0"/>
</svg>`;

const out = path.resolve(process.argv[2] || "build/icon.png");
fs.mkdirSync(path.dirname(out), { recursive: true });

const buf = await sharp(Buffer.from(svg), { density: 384 })
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toBuffer();

fs.writeFileSync(out, buf);
console.log("icon ->", out, buf.length, "bytes");
