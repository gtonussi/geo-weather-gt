import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🌤️ [FORECAST API] Request received");
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const headers = {
      "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
    };

    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    const pointsRes = await fetch(pointsUrl, { headers });

    if (!pointsRes.ok) {
      console.log("❌ [FORECAST API] Points request failed:", pointsRes.status);
      return NextResponse.json(
        { error: "Failed to fetch forecast URL" },
        { status: pointsRes.status }
      );
    }

    const pointData = await pointsRes.json();
    const forecastUrl = pointData.properties?.forecast;

    if (!forecastUrl) {
      console.log("❌ [FORECAST API] Forecast URL not found");
      return NextResponse.json(
        { error: "Forecast URL not found" },
        { status: 500 }
      );
    }

    const forecastRes = await fetch(forecastUrl, { headers });

    if (!forecastRes.ok) {
      console.log(
        "❌ [FORECAST API] Forecast request failed:",
        forecastRes.status
      );
      return NextResponse.json(
        { error: "Failed to fetch forecast data" },
        { status: forecastRes.status }
      );
    }

    const forecastData = await forecastRes.json();
    const periods = forecastData.properties?.periods ?? [];

    console.log(
      "✅ [FORECAST API] Forecast loaded:",
      periods.length,
      "periods"
    );
    return NextResponse.json({ periods });
  } catch (error) {
    console.error(
      "❌ [FORECAST API] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
