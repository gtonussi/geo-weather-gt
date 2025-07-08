import { getWeekForecast } from "@/services/weatherService";
import { ForecastPeriod } from "@/types/forecast";

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("weatherService", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Suppress console.log for cleaner test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getWeekForecast", () => {
    const mockForecastPeriods: ForecastPeriod[] = Array.from(
      { length: 20 },
      (_, i) => ({
        number: i + 1,
        name: `Day ${i + 1}`,
        startTime: `2024-01-${String(i + 1).padStart(2, "0")}T00:00:00-05:00`,
        endTime: `2024-01-${String(i + 1).padStart(2, "0")}T23:59:59-05:00`,
        isDaytime: i % 2 === 0,
        temperature: 70 + i,
        temperatureUnit: "F",
        temperatureTrend: null,
        windSpeed: "10 mph",
        windDirection: "NW",
        icon: "https://api.weather.gov/icons/land/day/clear?size=medium",
        shortForecast: "Sunny",
        detailedForecast: `Sunny skies for day ${i + 1}`,
      })
    );

    it("returns forecast periods for valid coordinates", async () => {
      const mockResponse = {
        periods: mockForecastPeriods,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getWeekForecast(40.748817, -73.985428);

      expect(result).toHaveLength(14); // Should limit to 14 periods
      expect(result[0]).toEqual(mockForecastPeriods[0]);
      expect(result[13]).toEqual(mockForecastPeriods[13]);
    });

    it("makes request to correct API endpoint", async () => {
      const mockResponse = {
        periods: mockForecastPeriods,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await getWeekForecast(40.748817, -73.985428);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/forecast?lat=40.748817&lon=-73.985428"
      );
    });

    it("handles negative coordinates correctly", async () => {
      const mockResponse = {
        periods: mockForecastPeriods,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await getWeekForecast(-40.748817, -73.985428);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/forecast?lat=-40.748817&lon=-73.985428"
      );
    });

    it("handles decimal coordinates correctly", async () => {
      const mockResponse = {
        periods: mockForecastPeriods,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      await getWeekForecast(40.123456, -73.987654);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/forecast?lat=40.123456&lon=-73.987654"
      );
    });

    it("throws error when fetch fails", async () => {
      const errorResponse = {
        error: "Forecast data unavailable",
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve(errorResponse),
      } as Response);

      await expect(getWeekForecast(40.748817, -73.985428)).rejects.toThrow(
        "Forecast data unavailable"
      );
    });

    it("throws error with generic message when no error message provided", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(getWeekForecast(40.748817, -73.985428)).rejects.toThrow(
        "Failed to load forecast"
      );
    });

    it("returns empty array when no periods provided", async () => {
      const mockResponse = {};

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getWeekForecast(40.748817, -73.985428);

      expect(result).toEqual([]);
    });

    it("returns empty array when periods is null", async () => {
      const mockResponse = {
        periods: null,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getWeekForecast(40.748817, -73.985428);

      expect(result).toEqual([]);
    });

    it("returns limited periods when more than 14 are available", async () => {
      const mockResponse = {
        periods: mockForecastPeriods, // 20 periods
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getWeekForecast(40.748817, -73.985428);

      expect(result).toHaveLength(14);
      expect(result[0]).toEqual(mockForecastPeriods[0]);
      expect(result[13]).toEqual(mockForecastPeriods[13]);
    });

    it("returns all periods when fewer than 14 are available", async () => {
      const shortPeriods = mockForecastPeriods.slice(0, 10);
      const mockResponse = {
        periods: shortPeriods,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await getWeekForecast(40.748817, -73.985428);

      expect(result).toHaveLength(10);
      expect(result).toEqual(shortPeriods);
    });

    it("throws error when network request fails", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(getWeekForecast(40.748817, -73.985428)).rejects.toThrow(
        "Network error"
      );
    });

    it("throws error when JSON parsing fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error("Invalid JSON")),
      } as Response);

      await expect(getWeekForecast(40.748817, -73.985428)).rejects.toThrow(
        "Invalid JSON"
      );
    });

    it("handles different HTTP error codes", async () => {
      const errorCodes = [400, 401, 403, 404, 500, 502, 503];

      for (const code of errorCodes) {
        const errorResponse = {
          error: `API Error ${code}`,
        };

        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: code,
          json: () => Promise.resolve(errorResponse),
        } as Response);

        await expect(getWeekForecast(40.748817, -73.985428)).rejects.toThrow(
          `API Error ${code}`
        );
      }
    });
  });
});
