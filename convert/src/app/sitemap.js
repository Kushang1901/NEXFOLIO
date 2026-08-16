export default async function sitemap() {
  const baseUrl = "https://convert.cvgrid.in";
  
  const routes = [
    "",
    "/pdf-to-image",
    "/image-to-pdf",
    "/merge",
    "/split",
    "/compress",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
