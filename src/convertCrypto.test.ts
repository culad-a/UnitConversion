import { convertCrypto } from './CryptoConverter'

global.fetch = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
})

test('convertCrypto should return correct converted value', async () => {
  (fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({
      bitcoin: { usd: 50000 },
      ethereum: { usd: 2500 }
    })
  })

  const result = await convertCrypto(2, 'bitcoin', 'ethereum')
  expect(result).toBeCloseTo((2 * 50000) / 2500, 5)
})

test('convertCrypto should return input value if from === to', async () => {
  const result = await convertCrypto(5, 'bitcoin', 'bitcoin')
  expect(result).toBe(5)
})

test('convertCrypto should throw error if API fails', async () => {
  (fetch as jest.Mock).mockRejectedValueOnce(new Error('API down'))

  await expect(convertCrypto(1, 'bitcoin', 'ethereum')).rejects.toThrow('Error fetching data from CoinGecko')
})
