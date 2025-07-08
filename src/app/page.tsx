"use client";

import { SearchInput } from "@/components/SearchInput";
import { WeatherCard } from "@/components/WeatherCard";
import { getCoordinatesFromAddress } from "@/services/geocodingService";
import { getWeekForecast } from "@/services/weatherService";
import { ForecastPeriod } from "@/types/forecast";

import { useState } from "react";

export default function Home() {
  const [forecast, setForecast] = useState<ForecastPeriod[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (address: string) => {
    try {
      setLoading(true);
      const coords = await getCoordinatesFromAddress(address);
      const forecastData = await getWeekForecast(coords.lat, coords.lon);
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      alert("Error consulting forecast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 py-4 px-2">
      <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-xl p-4 mt-4">
        <h1
          className="text-4xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-4 tracking-tight"
          id="geo-weather-title"
        >
          Geo Weather
        </h1>
        <SearchInput onSearch={handleSearch} />
        {loading ? (
          <p
            className="text-center text-blue-600 dark:text-blue-200 py-8"
            aria-live="polite"
          >
            Loading...
          </p>
        ) : (
          <section aria-labelledby="geo-weather-title">
            <div className="flex flex-col gap-6">
              {forecast.map((period) => (
                <WeatherCard key={period.number} period={period} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
