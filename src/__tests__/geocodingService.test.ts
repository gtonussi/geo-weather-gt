import { getCoordinatesFromAddress } from '@/services/geocodingService'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('geocodingService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getCoordinatesFromAddress', () => {
    it('returns coordinates for valid address', async () => {
      const mockResponse = {
        result: {
          addressMatches: [
            {
              coordinates: {
                x: -73.985428,
                y: 40.748817
              }
            }
          ]
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      const result = await getCoordinatesFromAddress('350 Fifth Avenue, New York, NY')

      expect(result).toEqual({
        lat: 40.748817,
        lon: -73.985428
      })
    })

    it('makes request to correct API endpoint', async () => {
      const mockResponse = {
        result: {
          addressMatches: [
            {
              coordinates: {
                x: -73.985428,
                y: 40.748817
              }
            }
          ]
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      await getCoordinatesFromAddress('123 Main St, Anytown, USA')

      expect(mockFetch).toHaveBeenCalledWith('/api/geocode?address=123%20Main%20St%2C%20Anytown%2C%20USA')
    })

    it('properly encodes address in URL', async () => {
      const mockResponse = {
        result: {
          addressMatches: [
            {
              coordinates: {
                x: -73.985428,
                y: 40.748817
              }
            }
          ]
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      await getCoordinatesFromAddress('123 Main St & Oak Ave, New York, NY')

      expect(mockFetch).toHaveBeenCalledWith('/api/geocode?address=123%20Main%20St%20%26%20Oak%20Ave%2C%20New%20York%2C%20NY')
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response)

      await expect(getCoordinatesFromAddress('invalid address'))
        .rejects
        .toThrow('HTTP error! status: 500')
    })

    it('throws error when no address matches found', async () => {
      const mockResponse = {
        result: {
          addressMatches: []
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      await expect(getCoordinatesFromAddress('nonexistent address'))
        .rejects
        .toThrow('Address not found')
    })

    it('throws error when result is missing', async () => {
      const mockResponse = {}

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      await expect(getCoordinatesFromAddress('address'))
        .rejects
        .toThrow('Address not found')
    })

    it('throws error when addressMatches is missing', async () => {
      const mockResponse = {
        result: {}
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse)
      } as Response)

      await expect(getCoordinatesFromAddress('address'))
        .rejects
        .toThrow('Address not found')
    })

    it('throws error when network request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(getCoordinatesFromAddress('address'))
        .rejects
        .toThrow('Network error')
    })

    it('throws error when JSON parsing fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON'))
      } as Response)

      await expect(getCoordinatesFromAddress('address'))
        .rejects
        .toThrow('Invalid JSON')
    })

    it('handles different HTTP error codes', async () => {
      const errorCodes = [400, 401, 403, 404, 500, 502, 503]

      for (const code of errorCodes) {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: code,
          statusText: `Error ${code}`
        } as Response)

        await expect(getCoordinatesFromAddress('address'))
          .rejects
          .toThrow(`HTTP error! status: ${code}`)
      }
    })
  })
})
