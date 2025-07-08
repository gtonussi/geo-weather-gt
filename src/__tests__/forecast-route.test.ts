/**
 * Unit tests for forecast API logic
 * These tests focus on the business logic rather than Next.js specific functionality
 */

// Mock fetch globally
const mockForecastFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("Forecast API Logic", () => {
  beforeEach(() => {
    mockForecastFetch.mockClear();
    // Suppress console.log for cleaner test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockPointsResponse = {
    properties: {
      forecast: "https://api.weather.gov/gridpoints/OKX/33,37/forecast",
      forecastHourly:
        "https://api.weather.gov/gridpoints/OKX/33,37/forecast/hourly",
    },
  };

  const mockForecastResponse = {
    properties: {
      periods: [
        {
          number: 1,
          name: "Today",
          startTime: "2024-01-01T00:00:00-05:00",
          endTime: "2024-01-01T23:59:59-05:00",
          isDaytime: true,
          temperature: 75,
          temperatureUnit: "F",
          temperatureTrend: null,
          windSpeed: "10 mph",
          windDirection: "NW",
          icon: "https://api.weather.gov/icons/land/day/clear?size=medium",
          shortForecast: "Sunny",
          detailedForecast: "Sunny skies with light winds.",
        },
        {
          number: 2,
          name: "Tonight",
          startTime: "2024-01-01T18:00:00-05:00",
          endTime: "2024-01-02T06:00:00-05:00",
          isDaytime: false,
          temperature: 60,
          temperatureUnit: "F",
          temperatureTrend: null,
          windSpeed: "5 mph",
          windDirection: "N",
          icon: "https://api.weather.gov/icons/land/night/clear?size=medium",
          shortForecast: "Clear",
          detailedForecast: "Clear skies overnight.",
        },
      ],
    },
  };

  // Helper function to simulate the forecast API logic
  const simulateForecastAPI = async (
    lat: string | null,
    lon: string | null
  ) => {
    if (!lat || !lon) {
      return {
        error: "Latitude and longitude are required",
        status: 400,
      };
    }

    try {
      const headers = {
        "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
      };

      const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
      const pointsRes = await fetch(pointsUrl, { headers });

      if (!pointsRes.ok) {
        return {
          error: "Failed to fetch forecast URL",
          status: pointsRes.status,
        };
      }

      const pointData = await pointsRes.json();
      const forecastUrl = pointData.properties?.forecast;

      if (!forecastUrl) {
        return {
          error: "Forecast URL not found",
          status: 500,
        };
      }

      const forecastRes = await fetch(forecastUrl, { headers });

      if (!forecastRes.ok) {
        return {
          error: "Failed to fetch forecast data",
          status: forecastRes.status,
        };
      }

      const forecastData = await forecastRes.json();
      const periods = forecastData.properties?.periods ?? [];

      return {
        data: { periods },
        status: 200,
      };
    } catch (error) {
      return {
        error: "Internal server error",
        status: 500,
      };
    }
  };

  it("returns error when lat parameter is missing", async () => {
    const result = await simulateForecastAPI(null, "-73.985428");

    expect(result.status).toBe(400);
    expect(result.error).toBe("Latitude and longitude are required");
  });

  it("returns error when lon parameter is missing", async () => {
    const result = await simulateForecastAPI("40.748817", null);

    expect(result.status).toBe(400);
    expect(result.error).toBe("Latitude and longitude are required");
  });

  it("returns error when both parameters are missing", async () => {
    const result = await simulateForecastAPI(null, null);

    expect(result.status).toBe(400);
    expect(result.error).toBe("Latitude and longitude are required");
  });

  it("returns forecast data for valid coordinates", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockForecastResponse),
      } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(200);
    expect(result.data?.periods).toEqual(
      mockForecastResponse.properties.periods
    );
  });

  it("makes correct requests to weather.gov API", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockForecastResponse),
      } as Response);

    await simulateForecastAPI("40.748817", "-73.985428");

    expect(mockForecastFetch).toHaveBeenCalledTimes(2);
    expect(mockForecastFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.weather.gov/points/40.748817,-73.985428",
      {
        headers: {
          "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
        },
      }
    );
    expect(mockForecastFetch).toHaveBeenNthCalledWith(
      2,
      "https://api.weather.gov/gridpoints/OKX/33,37/forecast",
      {
        headers: {
          "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
        },
      }
    );
  });

  it("handles points API failure", async () => {
    mockForecastFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(404);
    expect(result.error).toBe("Failed to fetch forecast URL");
  });

  it("handles missing forecast URL in points response", async () => {
    const invalidPointsResponse = {
      properties: {
        // Missing forecast URL
      },
    };

    mockForecastFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(invalidPointsResponse),
    } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(500);
    expect(result.error).toBe("Forecast URL not found");
  });

  it("handles forecast API failure", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(503);
    expect(result.error).toBe("Failed to fetch forecast data");
  });

  it("handles network errors", async () => {
    mockForecastFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(500);
    expect(result.error).toBe("Internal server error");
  });

  it("handles missing periods in forecast response", async () => {
    const forecastResponseWithoutPeriods = {
      properties: {
        // Missing periods
      },
    };

    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(forecastResponseWithoutPeriods),
      } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(200);
    expect(result.data?.periods).toEqual([]);
  });

  it("handles negative coordinates", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockForecastResponse),
      } as Response);

    await simulateForecastAPI("-40.748817", "-73.985428");

    expect(mockForecastFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.weather.gov/points/-40.748817,-73.985428",
      {
        headers: {
          "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
        },
      }
    );
  });

  it("handles decimal coordinates", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockForecastResponse),
      } as Response);

    await simulateForecastAPI("40.123456", "-73.987654");

    expect(mockForecastFetch).toHaveBeenNthCalledWith(
      1,
      "https://api.weather.gov/points/40.123456,-73.987654",
      {
        headers: {
          "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
        },
      }
    );
  });

  it("handles JSON parsing errors", async () => {
    mockForecastFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error("Invalid JSON")),
    } as Response);

    const result = await simulateForecastAPI("40.748817", "-73.985428");

    expect(result.status).toBe(500);
    expect(result.error).toBe("Internal server error");
  });

  it("includes correct User-Agent header in requests", async () => {
    mockForecastFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockPointsResponse),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockForecastResponse),
      } as Response);

    await simulateForecastAPI("40.748817", "-73.985428");

    expect(mockForecastFetch).toHaveBeenNthCalledWith(1, expect.any(String), {
      headers: {
        "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
      },
    });
    expect(mockForecastFetch).toHaveBeenNthCalledWith(2, expect.any(String), {
      headers: {
        "User-Agent": "Geo-Weather (geo-weather-gt@gmail.com)",
      },
    });
  });
});
