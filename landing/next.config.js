/** @type {import('next').NextConfig} */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://apis.google.com https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
  img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.githubusercontent.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://www.gstatic.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net;
  connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://www.google-analytics.com https://stats.g.doubleclick.net https://challenges.cloudflare.com;
  font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com;
  frame-src 'self' https://www.google.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    compress: true,
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Content-Security-Policy", value: cspHeader },
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
                    { key: "Cross-Origin-Resource-Policy", value: "same-site" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                ],
            },
            {
                source: "/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
