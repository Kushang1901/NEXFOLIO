import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Nexfolio Backend is running 🚀" });
}
