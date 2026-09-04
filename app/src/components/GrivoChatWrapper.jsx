"use client";

import dynamic from "next/dynamic";

// Dynamically import with no SSR - this is a Client Component so it's allowed
const GrivoChat = dynamic(() => import("./GrivoChat"), { ssr: false });

export default function GrivoChatWrapper() {
    return (
        <div id="grivo-chat-wrapper" className="no-print" style={{ display: "contents" }}>
            <GrivoChat />
        </div>
    );
}
