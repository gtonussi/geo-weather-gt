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

### `src/components/SearchInput.tsx`

- Accessible search input for location queries.
- Example address button for quick demo.
- Responsive: input and buttons stack on mobile, row on desktop.

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

- **Accessibility:**
  - The application is built to high accessibility standards, using semantic HTML, correct ARIA attributes, and color contrast that meets WCAG guidelines. All interactive elements are keyboard accessible and screen reader friendly.

- **Dark/Light Mode:**
  - The UI automatically follows the user's system preference for light or dark mode, using Tailwind's dark mode support. There is no manual toggle implemented yet.

- **Mobile-First & Responsive:**
  - The design is mobile-first, ensuring a great experience on all devices. Layouts and components adapt responsively from small to large screens.

- **Componentization & Maintainability:**
  - The codebase is organized into small, reusable components, making it easy to maintain and extend. TypeScript is used throughout for type safety and developer confidence.

- **Developer Experience:**
  - Uses Tailwind CSS for rapid, consistent styling and Next.js for fast development and deployment. Example data and clear documentation are provided for onboarding and testing.

---

</div>
