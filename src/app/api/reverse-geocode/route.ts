import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🏠 [REVERSE GEOCODE API] Request received");
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  console.log("🏠 [REVERSE GEOCODE API] Query parameters:", { lat, lon });

  if (!lat || !lon) {
    console.log(
      "❌ [REVERSE GEOCODE API] Invalid or missing coordinates parameters"
    );
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  console.log("🏠 [REVERSE GEOCODE API] Coordinate precision check:", {
    latLength: lat.length,
    lonLength: lon.length,
    latValue: parseFloat(lat),
    lonValue: parseFloat(lon),
    latOriginal: lat,
    lonOriginal: lon,
  });

  const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lon}&y=${lat}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`;

  console.log("🏠 [REVERSE GEOCODE API] Fetching from address endpoint:", url);

  try {
    const res = await fetch(url);
    console.log("🏠 [REVERSE GEOCODE API] Response status:", res.status);

    if (!res.ok) {
      console.log("❌ [REVERSE GEOCODE API] Census API request failed:", {
        status: res.status,
        statusText: res.statusText,
      });
    }

    const data = await res.json();
    console.log(
      "🏠 [REVERSE GEOCODE API] Response:",
      JSON.stringify(data, null, 2)
    );

    // Transform geographies response to match expected locations format
    const transformedData = {
      result: {
        addressMatches: data?.result?.addressMatches || [],
      },
    };

    console.log(
      "🏠 [REVERSE GEOCODE API] Transformed response:",
      JSON.stringify(transformedData, null, 2)
    );

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("❌ [REVERSE GEOCODE API] Unexpected error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return NextResponse.json(
      { error: "Failed to fetch reverse geocode data: " + error },
      { status: 500 }
    );
  }
}
