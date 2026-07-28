/** @type {import('next').NextConfig} */
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://apis.google.com https://checkout.razorpay.com https://cdn.razorpay.com https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google;
  style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com;
  img-src 'self' data: blob: https://lh3.googleusercontent.com https://*.githubusercontent.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://www.gstatic.com https://*.razorpay.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google;
  connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://*.firebaseio.com https://www.google-analytics.com https://stats.g.doubleclick.net https://api.razorpay.com https://checkout.razorpay.com https://www.google.com https://*.google.com https://challenges.cloudflare.com https://pagead2.googlesyndication.com https://adservice.google.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google;
  font-src 'self' data: https://cdnjs.cloudflare.com https://fonts.gstatic.com;
  frame-src 'self' https://www.google.com https://*.firebaseapp.com https://api.razorpay.com https://checkout.razorpay.com https://challenges.cloudflare.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.adtrafficquality.google;
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
    async rewrites() {
        return [
            {
                source: "/__/auth/:path*",
                destination: "https://resumecraft-e16fe.firebaseapp.com/__/auth/:path*",
            },
        ];
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-app-request, Authorization" },
                ],
            },
            {
                source: "/(.*)",
                headers: [
                    // Security headers (also help with Google Trust Score & Lighthouse Best Practices)
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
                // Cache static assets aggressively for better LCP / CWV
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
