<div style="font-size: 0.875em">

# Geo Weather GT

A modern, mobile-first weather app built with Next.js and Tailwind CSS. This app allows users to search for a location and view a detailed, accessible weather forecast.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/gtonussi/geo-weather-gt.git
   cd geo-weather-gt
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

- **Development mode:**

  ```sh
  npm run dev
  # or
  yarn dev
  ```

  The app will be available at [http://localhost:3000](http://localhost:3000).

- **Production build:**

  ```sh
  npm run build && npm start
  # or
  yarn build && yarn start
  ```

- **Run tests:**
  ```sh
  npm test
  # or
  yarn test
  ```

---

## 🗂️ Project Structure

```
geo-weather-gt/
├── public/                # Static assets (icons, images)
├── src/
│   ├── app/               # Next.js app directory (pages, layout, API routes)
│   ├── components/        # React UI components (WeatherCard, SearchInput, etc.)
│   ├── services/          # API and data fetching logic
│   ├── types/             # TypeScript types (e.g., forecast types)
│   ├── const/             # Constants and example data
│   └── __tests__/         # Jest test suite (69+ tests, 100% component coverage)
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.ts         # Next.js configuration
└── ...
```

---

## 🧩 Key Components & Code Overview

### `src/components/WeatherCard.tsx`

- Displays a weather forecast card for a given period.
- Mobile-first, responsive, and accessible.
- Click or press Enter/Space to expand/collapse for detailed forecast.
- Uses smooth transitions and a floating expand/collapse icon.

### `src/components/AddressForm.tsx`

- Accessible search input for location queries.
- Example address button for quick demo.
- Responsive: input and buttons stack on mobile, row on desktop.
- Contains the "Find Me" button that uses browser geolocation to get user coordinates.
- Populates the search input with full-precision coordinates when location is found.

### `src/services/`

- `geocodingService.ts`: Handles address-to-coordinates lookup.
- `weatherService.ts`: Fetches weather data for given coordinates.

### `src/app/api/`

- API routes for geocoding and weather forecast, used by the frontend.

### `src/const/example.ts`

- Example address, coordinates, and forecast data for demos and tests.

---

## ♿ Accessibility & UX

- All interactive elements are keyboard accessible.
- ARIA attributes and live regions for screen readers.
- Mobile-first layout with responsive design.
- Visual focus indicators for accessibility.

---

Enjoy using and building on Geo Weather GT!

</div>

---

## 📝 Justification of Choices

### Why this architecture and approach?

- **CORS & API Handling:**
  - The public weather API used in this project throws CORS errors and cannot be accessed directly from the browser. To solve this, the app uses Next.js API routes as a lightweight backend proxy. This leverages Next.js server-side features, which is more efficient and maintainable for a project of this scale than building a separate backend service.

- **User-Agent Header for API Requests**
  - The app sets a custom `User-Agent` header (`Geo-Weather (geo-weather-gt@gmail.com)`) when making requests to the weather.gov API. This is required by the API provider for identification and responsible usage, and helps ensure requests are not blocked or rate-limited

- **Geolocation "Find Me" Button:**
  - The app includes a "Find Me" button that uses the browser's geolocation API to get the user's current location. When clicked, it populates the search input with full-precision coordinates (e.g., `40.712775826286046, -74.00597095489502`). **Note:** This feature only works for US coordinates since the weather API is limited to US locations. For international users, the coordinates will be pasted but the weather lookup will fail.

- **Semantic Console Logging:**
  - All API calls and service operations are tracked with semantic, emoji-coded console logs that make debugging and monitoring much easier. Each service (geocoding, weather, API routes) uses distinct prefixes and structured logging to trace request flows, response data, and error handling in real-time during development.

- **Accessibility:**
  - The application is built to high accessibility standards, using semantic HTML, correct ARIA attributes, and color contrast that meets WCAG guidelines. All interactive elements are keyboard accessible and screen reader friendly.

- **Dark/Light Mode:**
  - The UI automatically follows the user's system preference for light or dark mode, using Tailwind's dark mode support. There is no manual toggle implemented yet.

- **Mobile-First & Responsive:**
  - The design is mobile-first, ensuring a great experience on all devices. Layouts and components adapt responsively from small to large screens.

---

## 🧪 Testing & Development

### Mocking US Coordinates for "Find Me" Button

Since the weather API only works with US coordinates, developers and international users can mock the browser's geolocation API to simulate being in the US for testing purposes:

1. **Open your browser's Developer Tools** (F12)
2. **Go to the Console tab**
3. **Paste the following mock script:**

```javascript
// New York City coordinates
navigator.geolocation.getCurrentPosition = function (success, error) {
  success({
    coords: {
      latitude: 40.712775826286046,
      longitude: -74.00597095489502,
      accuracy: 50,
    },
  });
};
```

4. **Press Enter** to execute the mock
5. **Click the "Find me" button** in the app
6. The input will be populated with the mocked US coordinates and weather lookup will work

This is useful for testing the geolocation functionality, demonstrating the app to international users, and development when outside the US.

---

</div>
