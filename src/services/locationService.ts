export const getUserCoordinates = (): Promise<{ lat: number; lon: number }> =>
  new Promise((resolve, reject) => {
    console.log("📍 [LOCATION SERVICE] Requesting user geolocation");

    // 🧪 TESTING: Uncomment to simulate US coordinates
    // const testCoordinates = { lat: 40.7128, lon: -74.0060 }; // New York City
    // console.log("🧪 [LOCATION SERVICE] Using test coordinates:", testCoordinates);
    // return resolve(testCoordinates);

    if (!navigator.geolocation) {
      console.log("❌ [LOCATION SERVICE] Geolocation not supported by browser");
      return reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coordinates = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        console.log(
          "✅ [LOCATION SERVICE] User coordinates obtained:",
          coordinates
        );
        resolve(coordinates);
      },
      (err) => {
        console.error("❌ [LOCATION SERVICE] Geolocation error:", err.message);
        reject("Permission denied or location unavailable: " + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
