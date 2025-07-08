"use client";

import { ForecastPeriod } from "@/types/forecast";
import Image from "next/image";
import { FC, useState } from "react";

interface WeatherCardProps {
  period: ForecastPeriod;
}

export const WeatherCard: FC<WeatherCardProps> = ({ period }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };
  return (
    <article
      tabIndex={0}
      role="button"
      aria-pressed={expanded}
      aria-expanded={expanded}
      onClick={toggleExpanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleExpanded();
      }}
      className="flex flex-col sm:flex-row items-center bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 gap-4 text-sm cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 relative"
      aria-label={`Weather for ${period.name}: ${period.temperature}°${period.temperatureUnit}, ${
        expanded ? period.detailedForecast : period.shortForecast
      }`}
    >
      <div className="w-full flex justify-center sm:block sm:w-auto flex-shrink-0 mb-2 sm:mb-0">
        <Image
          src={period.icon}
          alt={`Weather icon: ${period.shortForecast}`}
          width={80}
          height={80}
          aria-hidden="true"
          className="rounded-md bg-gray-100 dark:bg-gray-700"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 min-w-0 transition-all duration-300 w-full">
        <h2
          className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1 text-center sm:text-left truncate"
          id={`weather-title-${period.name.replace(/\s+/g, "-")}`}
        >
          {period.name} - {period.temperature}°{period.temperatureUnit}
        </h2>

        {!expanded ? (
          <p
            className="text-gray-700 dark:text-gray-300 break-words whitespace-normal text-center sm:text-left"
            aria-hidden={!expanded}
            aria-live="polite"
            aria-describedby={`weather-title-${period.name.replace(/\s+/g, "-")}`}
          >
            {period.shortForecast}
          </p>
        ) : (
          <p
            className="text-gray-700 dark:text-gray-300 break-words whitespace-normal text-center sm:text-left"
            aria-hidden={expanded}
            aria-describedby={`weather-title-${period.name.replace(/\s+/g, "-")}`}
          >
            {period.detailedForecast}
          </p>
        )}
      </div>

      <span
        className="absolute bottom-1 right-1 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg z-10"
        aria-hidden="true"
      >
        {expanded ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            aria-label="Collapse details"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12l4-4 4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            aria-label="Expand for details"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </article>
  );
};
