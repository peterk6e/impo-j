import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: "Login successful", body });
}

export async function GET() {
    return NextResponse.json({ message: "Login endpoint" });
  }