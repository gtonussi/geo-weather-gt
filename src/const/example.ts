export const EXAMPLE_ADDRESS = "350 Fifth Avenue, New York, NY 10118";

export const EXAMPLE_COORDINATES = {
  lat: 40.748817,
  lon: -73.985428,
};

export const EXAMPLE_FORECAST = {
  periods: [
    {
      number: 1,
      name: "Today",
      startTime: "2023-10-01T00:00:00-04:00",
      endTime: "2023-10-01T23:59:59-04:00",
      temperature: 75,
      temperatureUnit: "F",
      windSpeed: "5 mph",
      windDirection: "NW",
      shortForecast: "Sunny",
      detailedForecast:
        "A sunny day with a high of 75°F and a light breeze from the northwest.",
    },
    {
      number: 2,
      name: "Tonight",
      startTime: "2023-10-01T00:00:00-04:00",
      endTime: "2023-10-01T23:59:59-04:00",
      temperature: 60,
      temperatureUnit: "F",
      windSpeed: "3 mph",
      windDirection: "N",
      shortForecast: "Clear",
      detailedForecast:
        "A clear night with a low of 60°F and calm winds from the north.",
    },
    {
      number: 3,
      name: "Tomorrow",
      startTime: "2023-10-02T00:00:00-04:00",
      endTime: "2023-10-02T23:59:59-04:00",
      temperature: 78,
      temperatureUnit: "F",
      windSpeed: "6 mph",
      windDirection: "NE",
      shortForecast: "Partly Cloudy",
      detailedForecast:
        "A partly cloudy day with a high of 78°F and a gentle breeze from the northeast.",
    },
  ],
};
