import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastPeriod } from "@/types/forecast";

const mockPeriod: ForecastPeriod = {
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
  detailedForecast: "Sunny skies with light winds. High near 75F.",
};

describe("WeatherCard", () => {
  it("renders weather information correctly", () => {
    render(<WeatherCard period={mockPeriod} />);

    expect(screen.getByText("Today - 75°F")).toBeInTheDocument();
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(screen.getByAltText("Weather icon: Sunny")).toBeInTheDocument();
  });

  it("displays short forecast by default", () => {
    render(<WeatherCard period={mockPeriod} />);

    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.queryByText("Sunny skies with light winds. High near 75F.")
    ).not.toBeInTheDocument();
  });

  it("toggles to detailed forecast when clicked", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");

    // Initially shows short forecast
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.queryByText("Sunny skies with light winds. High near 75F.")
    ).not.toBeInTheDocument();

    // Click to expand
    await user.click(card);

    // Now shows detailed forecast
    expect(screen.queryByText("Sunny")).not.toBeInTheDocument();
    expect(
      screen.getByText("Sunny skies with light winds. High near 75F.")
    ).toBeInTheDocument();
  });

  it("toggles back to short forecast when clicked again", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");

    // Click to expand
    await user.click(card);
    expect(
      screen.getByText("Sunny skies with light winds. High near 75F.")
    ).toBeInTheDocument();

    // Click to collapse
    await user.click(card);
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.queryByText("Sunny skies with light winds. High near 75F.")
    ).not.toBeInTheDocument();
  });

  it("toggles when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");
    card.focus();

    // Press Enter to expand
    await user.keyboard("{Enter}");
    expect(
      screen.getByText("Sunny skies with light winds. High near 75F.")
    ).toBeInTheDocument();
  });

  it("toggles when Space key is pressed", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");
    card.focus();

    // Press Space to expand
    await user.keyboard(" ");
    expect(
      screen.getByText("Sunny skies with light winds. High near 75F.")
    ).toBeInTheDocument();
  });

  it("does not toggle when other keys are pressed", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");
    card.focus();

    // Press Tab - should not toggle
    await user.keyboard("{Tab}");
    expect(screen.getByText("Sunny")).toBeInTheDocument();
    expect(
      screen.queryByText("Sunny skies with light winds. High near 75F.")
    ).not.toBeInTheDocument();
  });

  it("has proper accessibility attributes when collapsed", () => {
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(card).toHaveAttribute("aria-expanded", "false");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("has proper accessibility attributes when expanded", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");
    await user.click(card);

    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveAttribute("aria-expanded", "true");
  });

  it("displays correct expand/collapse icons", async () => {
    const user = userEvent.setup();
    render(<WeatherCard period={mockPeriod} />);

    const card = screen.getByRole("button");

    // Initially shows expand icon
    expect(screen.getByLabelText("Expand for details")).toBeInTheDocument();
    expect(screen.queryByLabelText("Collapse details")).not.toBeInTheDocument();

    // Click to expand
    await user.click(card);

    // Now shows collapse icon
    expect(
      screen.queryByLabelText("Expand for details")
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Collapse details")).toBeInTheDocument();
  });

  it("renders weather icon with correct attributes", () => {
    render(<WeatherCard period={mockPeriod} />);

    const image = screen.getByAltText("Weather icon: Sunny");
    expect(image).toHaveAttribute(
      "src",
      "https://api.weather.gov/icons/land/day/clear?size=medium"
    );
    expect(image).toHaveAttribute("width", "80");
    expect(image).toHaveAttribute("height", "80");
  });

  it("generates proper ID for heading", () => {
    render(<WeatherCard period={mockPeriod} />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("id", "weather-title-Today");
  });

  it("handles period names with spaces in ID generation", () => {
    const periodWithSpaces = { ...mockPeriod, name: "This Afternoon" };
    render(<WeatherCard period={periodWithSpaces} />);

    const heading = screen.getByRole("heading");
    expect(heading).toHaveAttribute("id", "weather-title-This-Afternoon");
  });
});
