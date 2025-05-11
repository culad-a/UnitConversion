import { createCryptoConverter, convertCrypto } from './CryptoConverter'
import { addFavorite } from './Favorites'
import { addToHistory } from './History'

jest.mock('./Favorites', () => ({
  addFavorite: jest.fn()
}))
jest.mock('./History', () => ({
  addToHistory: jest.fn()
}))

describe('createCryptoConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            bitcoin: { usd: 30000 },
            ethereum: { usd: 2000 }
          })
      })
    ) as jest.Mock
  })

  it('crée le composant sans erreur', () => {
    const converter = createCryptoConverter()
    expect(converter).toBeInstanceOf(HTMLElement)
    expect(converter.querySelector('#valueInput')).not.toBeNull()
    expect(converter.querySelector('#convertButton')).not.toBeNull()
  })

  it('affiche une erreur pour une valeur invalide', async () => {
    const container = createCryptoConverter()
    const convertBtn = container.querySelector('#convertButton') as HTMLButtonElement
    const input = container.querySelector('#valueInput') as HTMLInputElement
    const result = container.querySelector('#result') as HTMLParagraphElement

    input.value = '-5'
    convertBtn.click()

    await Promise.resolve() // attendre l'event loop
    expect(result.textContent).toMatch(/valeur valide/i)
  })

  it('fait une conversion et appelle addToHistory', async () => {
    const container = createCryptoConverter()
    const convertBtn = container.querySelector('#convertButton') as HTMLButtonElement
    const input = container.querySelector('#valueInput') as HTMLInputElement
    const fromSelect = container.querySelector('#fromUnit') as HTMLSelectElement
    const toSelect = container.querySelector('#toUnit') as HTMLSelectElement
    const result = container.querySelector('#result') as HTMLParagraphElement

    input.value = '2'
    fromSelect.value = 'bitcoin'
    toSelect.value = 'ethereum'
    convertBtn.click()

    await new Promise((resolve) => setTimeout(resolve, 0)) // attendre l'async

    expect(result.textContent).toMatch(/Bitcoin.*Ethereum/i)
    expect(addToHistory).toHaveBeenCalled()
  })

  it('ajoute aux favoris après une conversion', async () => {
    const container = createCryptoConverter()
    const convertBtn = container.querySelector('#convertButton') as HTMLButtonElement
    const favBtn = container.querySelector('#favoriteButton') as HTMLButtonElement
    const input = container.querySelector('#valueInput') as HTMLInputElement

    input.value = '1'
    convertBtn.click()

    await new Promise((resolve) => setTimeout(resolve, 0))

    favBtn.click()

    expect(addFavorite).toHaveBeenCalledWith(expect.objectContaining({
      type: 'Crypto-monnaie',
      from: expect.any(String),
      to: expect.any(String),
      date: expect.any(String)
    }))
  })
})

describe('convertCrypto', () => {
  it('retourne la même valeur si from == to', async () => {
    const result = await convertCrypto(10, 'bitcoin', 'bitcoin')
    expect(result).toBe(10)
  })

  it('fait une conversion avec fetch', async () => {
    const result = await convertCrypto(1, 'bitcoin', 'ethereum')
    expect(result).toBeCloseTo(15) // 30000 / 2000
  })

  it('gère les erreurs de l’API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({})
      })
    ) as jest.Mock

    await expect(convertCrypto(1, 'btc', 'eth')).rejects.toThrow('Invalid cryptocurrency')
  })
})
