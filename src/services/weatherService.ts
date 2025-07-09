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

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.log("❌ [WEATHER SERVICE] Request failed:", data.error);
      throw new Error(data.error || "Failed to load forecast");
    }

    const periods = data.periods?.slice(0, 14) || [];
    console.log(
      "✅ [WEATHER SERVICE] Forecast loaded:",
      periods.length,
      "periods"
    );

    return periods;
  } catch (error) {
    console.error(
      "❌ [WEATHER SERVICE] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};
