import type { NextConfig } from "next";

/**
 * Le build « desktop » (DESKTOP_BUILD=1) produit un export statique complet
 * (dossier out/) que l'application Electron embarque et sert en local.
 * Sans cette variable, le site reste déployé normalement sur Vercel.
 */
const isDesktop = process.env.DESKTOP_BUILD === "1";

const nextConfig: NextConfig = isDesktop
  ? {
      output: "export",
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
