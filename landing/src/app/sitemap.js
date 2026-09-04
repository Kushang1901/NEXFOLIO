import { BLOG_POSTS } from "../data/blogPosts";

export default function sitemap() {
    const today = new Date().toISOString().split("T")[0];
    const baseUrl = "https://cvgrid.in";

    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: today,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: today,
            changeFrequency: "daily",
            priority: 0.9,
        },
    ];

    const blogRoutes = BLOG_POSTS.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: today,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...blogRoutes];
}
