export default function manifest() {
  return {
    name: "CVGrid Convert – Free Online PDF & Document Utilities",
    short_name: "CVGrid Convert",
    description:
      "Free browser-native PDF converter, merger, splitter, and compressor. 100% private with zero server uploads.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f131b",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 32x32 16x16",
        type: "image/x-icon",
      },
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
