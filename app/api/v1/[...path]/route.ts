import { NextRequest, NextResponse } from "next/server";
import { readSnapshot } from "@/lib/snapshot-catalog";

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const payload = readSnapshot(path.join("/"), request.nextUrl.searchParams);
  if (payload == null) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }
  return NextResponse.json(payload);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const key = path.join("/");
  if (key === "contact" || key === "contact/") {
    return NextResponse.json({ detail: "Message received." }, { status: 201 });
  }
  if (key === "newsletter" || key === "newsletter/") {
    return NextResponse.json({ detail: "Subscribed." }, { status: 201 });
  }
  return NextResponse.json(
    { detail: "This action needs the Brazilian Coffee House API. Browsing the shop still works." },
    { status: 501 },
  );
}
