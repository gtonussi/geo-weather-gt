import "@testing-library/jest-dom";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Request for API route testing
global.Request = jest.fn().mockImplementation((url, init) => ({
  url,
  ...init,
}));

// Mock Next.js Response for API route testing
global.Response = jest.fn().mockImplementation((body, init) => ({
  json: () => Promise.resolve(JSON.parse(body)),
  ok: init?.status < 400,
  status: init?.status || 200,
  ...init,
}));

// Mock fetch globally
global.fetch = jest.fn();

// Setup console.log suppression for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
