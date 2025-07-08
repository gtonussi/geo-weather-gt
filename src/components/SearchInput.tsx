"use client";

import { EXAMPLE_ADDRESS } from "@/const/example";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  startFocused?: boolean;
}

export const SearchInput: FC<SearchInputProps> = ({
  onSearch,
  startFocused = true,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const flushQuery = () => {
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      flushQuery();
    }
  };

  useEffect(() => {
    if (startFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [startFocused]);

  const handleExampleClick = () => {
    setQuery(EXAMPLE_ADDRESS);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form
        className="flex flex-col sm:flex-row gap-4 order-2 sm:order-1"
        onSubmit={handleSubmit}
        role="search"
        aria-label="Location search form"
      >
        <label htmlFor="search-location" className="sr-only">
          Search for a location
        </label>
        <input
          id="search-location"
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for a location..."
          autoFocus={startFocused}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Location search input"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          aria-label="Search for location"
        >
          Search
        </button>
        <button
          type="button"
          onClick={flushQuery}
          className="p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 cursor-pointer"
          aria-label="Clear search input"
        >
          Clear
        </button>
      </form>
      <div className="text-xs text-gray-500 order-1 sm:order-2">
        <button
          type="button"
          onClick={handleExampleClick}
          className="underline hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:text-blue-600 transition-colors cursor-pointer p-1 bg-transparent border-none opacity-70 inline rounded-sm"
          tabIndex={0}
          aria-label={`Use example address: ${EXAMPLE_ADDRESS}`}
        >
          Example: {EXAMPLE_ADDRESS}
        </button>
      </div>
    </div>
  );
};
