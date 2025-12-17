/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Enable MDX support
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // 2. The "Proxy" Logic (Redirects)
  async redirects() {
    return [
      // Root path redirect: / -> /en
      {
        source: "/",
        destination: "/hi",
        permanent: true,
      },
      // Catch-all redirect for missing locales
      // This Regex checks if the path does NOT start with en, hi, _next, or api
      {
        source: "/:path((?!en|hi|_next|api|favicon.ico|.*\\..*).*)",
        destination: "/en/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
