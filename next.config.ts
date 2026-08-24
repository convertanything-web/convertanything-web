import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH ?? "/ConvertAnything";
const normalizedBasePath = githubPagesBasePath === "/" ? "" : githubPagesBasePath;

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: isGitHubPages && normalizedBasePath ? normalizedBasePath : undefined,
  assetPrefix: isGitHubPages && normalizedBasePath ? `${normalizedBasePath}/` : undefined,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
};

export default nextConfig;
