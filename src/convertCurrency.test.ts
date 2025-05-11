import { jest } from '@jest/globals'
import { createCurrencyConverter } from './CurrencyConverter'
import { addFavorite } from './Favorites'
import { addToHistory } from './History'

jest.mock('./Favorites', () => ({
  addFavorite: jest.fn()
}))

jest.mock('./History', () => ({
  addToHistory: jest.fn()
}))

beforeEach(() => {
  document.body.innerHTML = ''
  jest.clearAllMocks()
})

test('convertit correctement de EUR à USD', () => {
  const converter = createCurrencyConverter()
  document.body.appendChild(converter)

  const input = converter.querySelector('#valueInput') as HTMLInputElement
  const fromSelect = converter.querySelector('#fromUnit') as HTMLSelectElement
  const toSelect = converter.querySelector('#toUnit') as HTMLSelectElement
  const button = converter.querySelector('#convertButton') as HTMLButtonElement
  const result = converter.querySelector('#result') as HTMLParagraphElement

  input.value = '100'
  fromSelect.value = 'EUR'
  toSelect.value = 'USD'

  button.click()

  expect(result.textContent).toContain('100.00 Euro = 108.00 Dollar')
  expect(addToHistory).toHaveBeenCalled()
})

test('affiche une erreur si la valeur est invalide', () => {
  const converter = createCurrencyConverter()
  document.body.appendChild(converter)

  const input = converter.querySelector('#valueInput') as HTMLInputElement
  const button = converter.querySelector('#convertButton') as HTMLButtonElement
  const result = converter.querySelector('#result') as HTMLParagraphElement

  input.value = 'abc'
  button.click()

  expect(result.textContent).toBe('Valeur invalide.')
  expect(addToHistory).not.toHaveBeenCalled()
})

test('ne fait rien si on clique sur "Ajouter aux favoris" avant une conversion', () => {
  const converter = createCurrencyConverter()
  document.body.appendChild(converter)

  const favBtn = converter.querySelector('#favoriteButton') as HTMLButtonElement
  favBtn.click()

  expect(addFavorite).not.toHaveBeenCalled()
})

test('ajoute une conversion aux favoris après clic', () => {
  const converter = createCurrencyConverter()
  document.body.appendChild(converter)

  const input = converter.querySelector('#valueInput') as HTMLInputElement
  const fromSelect = converter.querySelector('#fromUnit') as HTMLSelectElement
  const toSelect = converter.querySelector('#toUnit') as HTMLSelectElement
  const convertBtn = converter.querySelector('#convertButton') as HTMLButtonElement
  const favBtn = converter.querySelector('#favoriteButton') as HTMLButtonElement

  input.value = '200'
  fromSelect.value = 'USD'
  toSelect.value = 'EUR'

  convertBtn.click()
  favBtn.click()

  expect(addFavorite).toHaveBeenCalled()
  const call = (addFavorite as jest.Mock).mock.calls[0][0]
  expect(call.type).toBe('Monnaie')
  expect(call.from).toContain('USD')
  expect(call.to).toContain('Euro')
})
