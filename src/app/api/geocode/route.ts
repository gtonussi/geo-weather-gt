import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("📍 [GEOCODE API] Request received");
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodedAddress}&benchmark=Public_AR_Current&format=json`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log("❌ [GEOCODE API] Census API request failed:", res.status);
    }

    const data = await res.json();
    console.log(
      "✅ [GEOCODE API] Address geocoded:",
      data.result?.addressMatches?.length || 0,
      "matches"
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "❌ [GEOCODE API] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Failed to fetch geocode data: " + error },
      { status: 500 }
    );
  }
}
