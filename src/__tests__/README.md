# Test Suite Documentation

This document describes the comprehensive Jest test suite implemented for the geo-weather project.

## Overview

The test suite includes tests for all major components, services, and API routes in the project. All tests are located in the `src/__tests__/` directory.

## Test Structure

### 📁 Test Files (6 total)

1. **SearchInput.test.tsx** - Component tests for the search input form
2. **WeatherCard.test.tsx** - Component tests for weather display cards
3. **geocodingService.test.ts** - Service tests for address geocoding
4. **weatherService.test.ts** - Service tests for weather forecast fetching
5. **geocode-route.test.ts** - API logic tests for geocoding endpoint
6. **forecast-route.test.ts** - API logic tests for forecast endpoint

## Test Coverage

Current coverage statistics:

- **Components**: 100% coverage (SearchInput, WeatherCard)
- **Services**: 100% coverage (geocodingService, weatherService)
- **API Routes**: Logic testing (business logic validation without Next.js specifics)
- **Total Tests**: 69 test cases

## Key Features Tested

### SearchInput Component

- ✅ Form rendering and accessibility
- ✅ Input value management and validation
- ✅ Search functionality with trimming
- ✅ Clear functionality
- ✅ Example address feature
- ✅ Keyboard navigation (Enter key)
- ✅ Focus management
- ✅ Accessibility attributes

### WeatherCard Component

- ✅ Weather data display
- ✅ Expand/collapse functionality
- ✅ Short vs detailed forecast toggling
- ✅ Keyboard navigation (Enter/Space keys)
- ✅ Accessibility features
- ✅ Image rendering and alt text
- ✅ Dynamic icon changes
- ✅ Proper ARIA attributes

### Geocoding Service

- ✅ Address validation and encoding
- ✅ API request formatting
- ✅ Response parsing and error handling
- ✅ Network error handling
- ✅ Invalid response handling
- ✅ Special character handling in addresses

### Weather Service

- ✅ Coordinate validation
- ✅ API request chaining (points → forecast)
- ✅ Response data limiting (14 periods max)
- ✅ Error handling for various HTTP codes
- ✅ Missing data handling
- ✅ Network failure handling

### API Route Logic

- ✅ Input parameter validation
- ✅ External API integration testing
- ✅ Error response formatting
- ✅ Success response formatting
- ✅ Edge case handling

## Running Tests

### Basic Test Run

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

## Test Configuration

The test suite uses:

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **Jest DOM** - Additional DOM matchers
- **User Event** - User interaction simulation

### Key Configuration Files

- `jest.config.js` - Jest configuration
- `jest.setup.js` - Global test setup and mocks
- `package.json` - Test scripts

## Mocking Strategy

### Global Mocks

- **fetch** - Mocked globally for API testing
- **Next.js Image** - Mocked for component testing
- **Console methods** - Suppressed for cleaner test output

### Component-Specific Mocks

- User interactions simulated with `@testing-library/user-event`
- External API responses mocked with realistic data
- Error scenarios thoroughly tested

## Best Practices Implemented

1. **Comprehensive Error Testing** - Tests cover various error scenarios
2. **Accessibility Testing** - ARIA attributes and keyboard navigation tested
3. **Edge Case Coverage** - Empty inputs, network failures, malformed data
4. **Realistic Mock Data** - API responses mirror actual service responses
5. **Clean Test Organization** - Logical grouping with clear descriptions
6. **Setup/Teardown** - Proper cleanup between tests

## Future Enhancements

Potential areas for test expansion:

- Integration tests combining multiple components
- E2E testing with tools like Playwright or Cypress
- Performance testing for large datasets
- Visual regression testing for UI components

## Troubleshooting

### Common Issues

1. **Module Resolution** - Ensure `@/` alias is properly configured
2. **Async Operations** - Use `await` with user interactions
3. **Mock Cleanup** - Verify mocks are cleared between tests

### Debug Commands

```bash
# Run specific test file
npm test SearchInput.test.tsx

# Run tests in verbose mode
npm test -- --verbose

# Run tests with watch mode for specific pattern
npm test -- --watch --testNamePattern="SearchInput"
```

## Contributing

When adding new features:

1. Write tests for new components/services
2. Ensure tests cover error scenarios
3. Maintain accessibility test coverage
4. Update this documentation as needed
5. Aim for 100% coverage on new code
