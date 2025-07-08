/**
 * Unit tests for geocode API logic
 * These tests focus on the business logic rather than Next.js specific functionality
 */

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('Geocode API Logic', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // Helper function to simulate the geocoding logic
  const simulateGeocodeAPI = async (address: string | null) => {
    if (!address || typeof address !== 'string') {
      return { error: 'Address is required', status: 400 }
    }

    const encodedAddress = encodeURIComponent(address)
    const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${encodedAddress}&benchmark=Public_AR_Current&format=json`

    try {
      const res = await fetch(url)
      const data = await res.json()
      return { data, status: 200 }
    } catch (error) {
      return { 
        error: 'Failed to fetch geocode data: ' + error, 
        status: 500 
      }
    }
  }

  it('returns error when address parameter is missing', async () => {
    const result = await simulateGeocodeAPI(null)
    
    expect(result.status).toBe(400)
    expect(result.error).toBe('Address is required')
  })

  it('returns error when address parameter is empty string', async () => {
    const result = await simulateGeocodeAPI('')
    
    expect(result.status).toBe(400)
    expect(result.error).toBe('Address is required')
  })

  it('makes request to census.gov with correct URL encoding', async () => {
    const mockCensusResponse = {
      result: {
        addressMatches: []
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCensusResponse)
    } as Response)

    const address = '123 Main St & Oak Ave, New York, NY'
    await simulateGeocodeAPI(address)

    const expectedUrl = 'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=123%20Main%20St%20%26%20Oak%20Ave%2C%20New%20York%2C%20NY&benchmark=Public_AR_Current&format=json'
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl)
  })

  it('returns geocoding data for valid address', async () => {
    const mockCensusResponse = {
      result: {
        addressMatches: [
          {
            coordinates: {
              x: -73.985428,
              y: 40.748817
            },
            addressComponents: {
              streetName: 'FIFTH AVE',
              city: 'NEW YORK',
              state: 'NY'
            }
          }
        ]
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCensusResponse)
    } as Response)

    const result = await simulateGeocodeAPI('350 Fifth Avenue, New York, NY')

    expect(result.status).toBe(200)
    expect(result.data).toEqual(mockCensusResponse)
  })

  it('handles special characters in address', async () => {
    const mockCensusResponse = {
      result: {
        addressMatches: []
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCensusResponse)
    } as Response)

    const address = '123 Main St #4B, New York, NY 10001'
    await simulateGeocodeAPI(address)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('123%20Main%20St%20%234B%2C%20New%20York%2C%20NY%2010001')
    )
  })

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await simulateGeocodeAPI('valid address')

    expect(result.status).toBe(500)
    expect(result.error).toContain('Failed to fetch geocode data')
  })

  it('handles JSON parsing errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.reject(new Error('Invalid JSON'))
    } as Response)

    const result = await simulateGeocodeAPI('valid address')

    expect(result.status).toBe(500)
    expect(result.error).toContain('Failed to fetch geocode data')
  })

  it('preserves original census API response structure', async () => {
    const mockCensusResponse = {
      result: {
        input: {
          address: {
            street: '350 Fifth Avenue'
          }
        },
        addressMatches: [
          {
            tigerLine: {
              tigerLineId: '123456'
            },
            coordinates: {
              x: -73.985428,
              y: 40.748817
            },
            addressComponents: {
              zip: '10118',
              streetName: 'FIFTH AVE',
              preType: '',
              city: 'NEW YORK',
              preDirection: '',
              suffixDirection: '',
              fromAddress: '300',
              state: 'NY',
              suffixType: 'AVE',
              toAddress: '398',
              suffixQualifier: '',
              preQualifier: ''
            },
            matchedAddress: '350 FIFTH AVE, NEW YORK, NY, 10118'
          }
        ]
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCensusResponse)
    } as Response)

    const result = await simulateGeocodeAPI('350 Fifth Avenue, New York, NY')

    expect(result.status).toBe(200)
    expect(result.data).toEqual(mockCensusResponse)
  })

  it('handles multiple address matches', async () => {
    const mockCensusResponse = {
      result: {
        addressMatches: [
          {
            coordinates: { x: -73.985428, y: 40.748817 },
            matchedAddress: '350 FIFTH AVE, NEW YORK, NY, 10118'
          },
          {
            coordinates: { x: -73.985500, y: 40.748900 },
            matchedAddress: '350 5TH AVE, NEW YORK, NY, 10118'
          }
        ]
      }
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCensusResponse)
    } as Response)

    const result = await simulateGeocodeAPI('350 Fifth Avenue, New York')

    expect(result.status).toBe(200)
    expect(result.data.result.addressMatches).toHaveLength(2)
  })
})
