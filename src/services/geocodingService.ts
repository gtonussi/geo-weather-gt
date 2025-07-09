const isCoordinateString = (input: string): boolean => {
  const coordinatePattern = /^-?\d+\.?\d*[,\s]+-?\d+\.?\d*$/;
  return coordinatePattern.test(input.trim());
};

const parseCoordinates = (
  input: string
): { lat: number; lon: number } | null => {
  try {
    const cleaned = input.trim();
    const parts = cleaned.split(/[,\s]+/);

    if (parts.length !== 2) return null;

    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

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

export const getCoordinatesFromAddressOrCoordinates = async (
  input: string
): Promise<{ lat: number; lon: number }> => {
  console.log("🗺️ [GEOCODING SERVICE] Processing input:", input);

  if (isCoordinateString(input)) {
    console.log("🗺️ [GEOCODING SERVICE] Input detected as coordinates");
    const coords = parseCoordinates(input);

    if (coords) {
      console.log("✅ [GEOCODING SERVICE] Coordinates parsed:", coords);
      return coords;
    }
  }

  console.log("🗺️ [GEOCODING SERVICE] Processing as address");
  return getCoordinatesFromAddress(input);
};
