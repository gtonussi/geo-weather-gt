"use client";

import { EXAMPLE_ADDRESS } from "@/const/example";
import { getUserCoordinates } from "@/services/locationService";
import { MapPin } from "lucide-react";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

interface AddressFormProps {
  onSearch: (address: string) => void;
  startFocused?: boolean;
}

export const AddressForm: FC<AddressFormProps> = ({
  onSearch,
  startFocused = true,
}) => {
  const [address, setAddress] = useState("");
  const [loadingGeolocation, setLoadingGeolocation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const flushaddress = () => {
    setAddress("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleGetLocation = async () => {
    setLoadingGeolocation(true);

    try {
      const coords = await getUserCoordinates();
      // Paste full precision coordinates directly into the input
      setAddress(`${coords.lat}, ${coords.lon}`);
    } catch (err) {
      alert("It wasn't possible to get your Geolocation.");
      console.error(err);
    } finally {
      setLoadingGeolocation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
      flushaddress();
    }
  };

  useEffect(() => {
    if (startFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [startFocused]);

  const handleExampleClick = () => {
    setAddress(EXAMPLE_ADDRESS);
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
          value={address}
          onChange={handleChange}
          placeholder="Search for a location or enter coordinates (e.g., 40.7128, -74.0060)..."
          autoFocus={startFocused}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Location search input"
        />
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loadingGeolocation}
          className="p-2 bg-transparent border border-gray-300 text-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 sm:min-w-28"
          aria-label="Use my current location"
        >
          <MapPin size={16} />
          {loadingGeolocation ? "Searching..." : "Find me"}
        </button>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
          aria-label="Search for location"
        >
          Search
        </button>
        <button
          type="button"
          onClick={flushaddress}
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
