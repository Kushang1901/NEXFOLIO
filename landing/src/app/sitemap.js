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
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: today,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: today,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: today,
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: today,
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: today,
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    const blogRoutes = BLOG_POSTS.map((post) => {
        let postIsoDate = today;
        try {
            if (post.date) {
                const parsed = new Date(post.date);
                if (!isNaN(parsed.getTime())) {
                    postIsoDate = parsed.toISOString().split("T")[0];
                }
            }
        } catch {
            postIsoDate = today;
        }

        return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: postIsoDate,
            changeFrequency: "monthly",
            priority: 0.85,
        };
    });

    return [...staticRoutes, ...blogRoutes];
}
