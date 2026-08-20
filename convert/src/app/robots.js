export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Anthropic-AI",
          "Applebot",
          "CCBot",
          "Google-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: "https://convert.cvgrid.in/sitemap.xml",
    host: "https://convert.cvgrid.in",
  };
}
