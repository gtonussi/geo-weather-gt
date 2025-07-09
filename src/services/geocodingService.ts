// Helper function to detect if input is coordinates
const isCoordinateString = (input: string): boolean => {
  // Match patterns like: "40.7128, -74.0060" or "40.7128,-74.0060" or "40.7128 -74.0060"
  const coordinatePattern = /^-?\d+\.?\d*[,\s]+-?\d+\.?\d*$/;
  return coordinatePattern.test(input.trim());
};

// Helper function to parse coordinate string
const parseCoordinates = (
  input: string
): { lat: number; lon: number } | null => {
  try {
    const cleaned = input.trim();
    const parts = cleaned.split(/[,\s]+/);

    if (parts.length !== 2) return null;

    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

    // Basic validation: lat should be -90 to 90, lon should be -180 to 180
    if (
      isNaN(lat) ||
      isNaN(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      return null;
    }

    return { lat, lon };
  } catch {
    return null;
  }
};

export const getCoordinatesFromAddress = async (
  address: string
): Promise<{ lat: number; lon: number }> => {
  console.log("🗺️ [GEOCODING SERVICE] Processing input:", address);

  const url = `/api/geocode?address=${encodeURIComponent(address)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const match = data.result?.addressMatches?.[0];

    if (!match) {
      throw new Error("Address not found");
    }

    const coordinates = {
      lat: match.coordinates.y,
      lon: match.coordinates.x,
    };

    console.log("✅ [GEOCODING SERVICE] Coordinates found:", coordinates);
    return coordinates;
  } catch (error) {
    console.error(
      "❌ [GEOCODING SERVICE] Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};

// Smart function that handles both addresses and coordinates
export const getCoordinatesFromAddressOrCoordinates = async (
  input: string
): Promise<{ lat: number; lon: number }> => {
  console.log("🗺️ [GEOCODING SERVICE] Processing input:", input);

  // Check if input looks like coordinates
  if (isCoordinateString(input)) {
    console.log("🗺️ [GEOCODING SERVICE] Input detected as coordinates");
    const coords = parseCoordinates(input);

    if (coords) {
      console.log("✅ [GEOCODING SERVICE] Coordinates parsed:", coords);
      return coords;
    }
  }

  // If not coordinates or parsing failed, treat as address
  console.log("🗺️ [GEOCODING SERVICE] Processing as address");
  return getCoordinatesFromAddress(input);
};
