import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "@/components/SearchInput";
import { EXAMPLE_ADDRESS } from "@/const/example";

describe("SearchInput", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it("renders search form with input and buttons", () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    expect(screen.getByLabelText("Location search input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Search for location" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear search input" })
    ).toBeInTheDocument();
    expect(screen.getByText(`Example: ${EXAMPLE_ADDRESS}`)).toBeInTheDocument();
  });

  it("focuses input on mount when startFocused is true", () => {
    render(<SearchInput onSearch={mockOnSearch} startFocused={true} />);

    const input = screen.getByLabelText("Location search input");
    expect(input).toHaveFocus();
  });

  it("does not focus input on mount when startFocused is false", () => {
    render(<SearchInput onSearch={mockOnSearch} startFocused={false} />);

    const input = screen.getByLabelText("Location search input");
    expect(input).not.toHaveFocus();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Location search input");
    await user.type(input, "New York");

    expect(input).toHaveValue("New York");
  });

  it("calls onSearch with trimmed query when form is submitted", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Location search input");
    const submitButton = screen.getByRole("button", {
      name: "Search for location",
    });

    await user.type(input, "  New York  ");
    await user.click(submitButton);

    expect(mockOnSearch).toHaveBeenCalledWith("New York");
    expect(input).toHaveValue("");
  });

  it("does not call onSearch when query is empty or only whitespace", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const submitButton = screen.getByRole("button", {
      name: "Search for location",
    });

    // Test empty string
    await user.click(submitButton);
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Test whitespace only
    const input = screen.getByLabelText("Location search input");
    await user.type(input, "   ");
    await user.click(submitButton);
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it("clears input when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Location search input");
    const clearButton = screen.getByRole("button", {
      name: "Clear search input",
    });

    await user.type(input, "New York");
    expect(input).toHaveValue("New York");

    await user.click(clearButton);
    expect(input).toHaveValue("");
  });

  it("sets example address when example button is clicked", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Location search input");
    const exampleButton = screen.getByRole("button", {
      name: `Use example address: ${EXAMPLE_ADDRESS}`,
    });

    await user.click(exampleButton);

    expect(input).toHaveValue(EXAMPLE_ADDRESS);
    expect(input).toHaveFocus();
  });

  it("submits form when Enter key is pressed", async () => {
    const user = userEvent.setup();
    render(<SearchInput onSearch={mockOnSearch} />);

    const input = screen.getByLabelText("Location search input");

    await user.type(input, "Chicago");
    await user.keyboard("{Enter}");

    expect(mockOnSearch).toHaveBeenCalledWith("Chicago");
    expect(input).toHaveValue("");
  });

  it("has proper accessibility attributes", () => {
    render(<SearchInput onSearch={mockOnSearch} />);

    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("aria-label", "Location search form");

    const input = screen.getByLabelText("Location search input");
    expect(input).toHaveAttribute("id", "search-location");

    const label = screen.getByText("Search for a location");
    expect(label).toHaveClass("sr-only");
  });
});
