import { NextResponse } from "next/server";
import { generateLocalToken } from "../../../../utils/authHelper";

export async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Generate fallback token signed using backend secret
        const token = generateLocalToken({ email });

        return NextResponse.json({ token });
    } catch (err) {
        console.error("❌ Mock Token Route Error:", err);
        return NextResponse.json(
            { error: "Server error generating token" },
            { status: 500 }
        );
    }
}
