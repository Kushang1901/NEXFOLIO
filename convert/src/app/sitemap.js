export default async function sitemap() {
  const baseUrl = "https://convert.cvgrid.in";
  const now = new Date().toISOString();

  const routes = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      path: "/pdf-to-image",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      path: "/image-to-pdf",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      path: "/merge",
      priority: 0.85,
      changeFrequency: "weekly",
    },
    {
      path: "/split",
      priority: 0.85,
      changeFrequency: "weekly",
    },
    {
      path: "/compress",
      priority: 0.85,
      changeFrequency: "weekly",
    },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
