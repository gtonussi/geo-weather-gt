import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("📍 [GEOCODE API] Request received");
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  console.log("📍 [GEOCODE API] Query parameters:", { address });

  if (!address || typeof address !== "string") {
    console.log("❌ [GEOCODE API] Invalid or missing address parameter");
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodedAddress}&benchmark=Public_AR_Current&format=json`;

  console.log("📍 [GEOCODE API] Fetching from census.gov:", url);

  try {
    const res = await fetch(url);
    console.log("📍 [GEOCODE API] Response status:", res.status);

    if (!res.ok) {
      console.log("❌ [GEOCODE API] Census API request failed:", {
        status: res.status,
        statusText: res.statusText,
      });
    }

    const data = await res.json();
    console.log("📍 [GEOCODE API] Response data:", {
      hasResult: !!data.result,
      addressMatchesCount: data.result?.addressMatches?.length || 0,
      data: data,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [GEOCODE API] Unexpected error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return NextResponse.json(
      { error: "Failed to fetch geocode data: " + error },
      { status: 500 }
    );
  }
}
