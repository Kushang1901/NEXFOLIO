"use client";

import dynamic from "next/dynamic";

// Dynamically import with no SSR - this is a Client Component so it's allowed
const GrivoChat = dynamic(() => import("./GrivoChat"), { ssr: false });

export default function GrivoChatWrapper() {
    return <GrivoChat />;
}
