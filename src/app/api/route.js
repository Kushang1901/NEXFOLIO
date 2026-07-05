import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "CVGrid Backend is running 🚀" });
}
