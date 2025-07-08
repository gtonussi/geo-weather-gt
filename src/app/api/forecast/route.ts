import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("🌤️ [FORECAST API] Request received");
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  console.log("🌤️ [FORECAST API] Query parameters:", { lat, lon });

  if (!lat || !lon) {
    console.log("❌ [FORECAST API] Missing required parameters:", { lat, lon });
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    console.log("🌤️ [FORECAST API] Starting forecast fetch process");
    const headers = {
      "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
    };

    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    console.log("🌤️ [FORECAST API] Fetching points data from:", pointsUrl);

    const pointsRes = await fetch(pointsUrl, {
      headers,
    });

    console.log("🌤️ [FORECAST API] Points response status:", pointsRes.status);

    if (!pointsRes.ok) {
      console.log("❌ [FORECAST API] Points request failed:", {
        status: pointsRes.status,
        statusText: pointsRes.statusText,
      });
      return NextResponse.json(
        { error: "Failed to fetch forecast URL" },
        { status: pointsRes.status }
      );
    }

    const pointData = await pointsRes.json();
    console.log("🌤️ [FORECAST API] Points data received:", {
      properties: pointData.properties ? "Present" : "Missing",
      forecastUrl: pointData.properties?.forecast,
    });

    const forecastUrl = pointData.properties?.forecast;

    if (!forecastUrl) {
      console.log("❌ [FORECAST API] Forecast URL not found in points data");
      return NextResponse.json(
        { error: "Forecast URL not found" },
        { status: 500 }
      );
    }

    console.log("🌤️ [FORECAST API] Fetching forecast from:", forecastUrl);
    const forecastRes = await fetch(forecastUrl, {
      headers,
    });

    console.log(
      "🌤️ [FORECAST API] Forecast response status:",
      forecastRes.status
    );

    if (!forecastRes.ok) {
      console.log("❌ [FORECAST API] Forecast request failed:", {
        status: forecastRes.status,
        statusText: forecastRes.statusText,
      });
      return NextResponse.json(
        { error: "Failed to fetch forecast data" },
        { status: forecastRes.status }
      );
    }

    const forecastData = await forecastRes.json();
    const periods = forecastData.properties?.periods ?? [];

    console.log("✅ [FORECAST API] Forecast data processed successfully:", {
      periodsCount: periods.length,
      hasProperties: !!forecastData.properties,
    });

    return NextResponse.json({ periods });
  } catch (error) {
    console.error("❌ [FORECAST API] Unexpected error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
