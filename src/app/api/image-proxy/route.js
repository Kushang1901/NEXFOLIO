import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const res = await fetch(url);
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch image" }, { status: res.status });
        }

        const contentType = res.headers.get("content-type") || "image/jpeg";
        const buffer = await res.arrayBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=86400"
            }
        });
    } catch (err) {
        console.error("Image Proxy Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
