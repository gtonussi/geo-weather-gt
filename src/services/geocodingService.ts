export const getCoordinatesFromAddress = async (
  address: string
): Promise<{ lat: number; lon: number }> => {
  console.log(
    "🗺️ [GEOCODING SERVICE] Getting coordinates for address:",
    address
  );

  const url = `/api/geocode?address=${encodeURIComponent(address)}`;
  console.log("🗺️ [GEOCODING SERVICE] Making request to:", url);

  try {
    const res = await fetch(url);
    console.log("🗺️ [GEOCODING SERVICE] Response status:", res.status);

    if (!res.ok) {
      console.log("❌ [GEOCODING SERVICE] Request failed:", {
        status: res.status,
        statusText: res.statusText,
      });
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("🗺️ [GEOCODING SERVICE] Response data:", data);

    const match = data.result?.addressMatches?.[0];
    console.log("🗺️ [GEOCODING SERVICE] First address match:", match);

    if (!match) {
      console.log("❌ [GEOCODING SERVICE] No address matches found");
      throw new Error("Address not found");
    }

    const coordinates = {
      lat: match.coordinates.y,
      lon: match.coordinates.x,
    };

    console.log("✅ [GEOCODING SERVICE] Coordinates extracted:", coordinates);
    return coordinates;
  } catch (error) {
    console.error("❌ [GEOCODING SERVICE] Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    throw error;
  }
};
