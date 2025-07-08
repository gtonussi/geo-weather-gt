import { ForecastPeriod } from "@/types/forecast";

export const getWeekForecast = async (
  lat: number,
  lon: number
): Promise<ForecastPeriod[]> => {
  console.log("🌦️ [WEATHER SERVICE] Getting forecast for coordinates:", {
    lat,
    lon,
  });

  const url = `/api/forecast?lat=${lat}&lon=${lon}`;
  console.log("🌦️ [WEATHER SERVICE] Making request to:", url);

  try {
    const res = await fetch(url);
    console.log("🌦️ [WEATHER SERVICE] Response status:", res.status);

    const data = await res.json();
    console.log("🌦️ [WEATHER SERVICE] Response data:", data);

    if (!res.ok) {
      console.log("❌ [WEATHER SERVICE] Request failed:", {
        status: res.status,
        error: data.error,
        data,
      });
      throw new Error(data.error || "Failed to load forecast");
    }

    const periods = data.periods?.slice(0, 14) || [];
    console.log("✅ [WEATHER SERVICE] Forecast periods processed:", {
      totalPeriods: data.periods?.length || 0,
      returnedPeriods: periods.length,
    });

    return periods;
  } catch (error) {
    console.error("❌ [WEATHER SERVICE] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    throw error;
  }
};
