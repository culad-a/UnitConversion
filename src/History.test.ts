import { createTemperatureConverter } from './TemperatureConverter'

beforeEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

test('should convert temperature and store in history', () => {
  const component = createTemperatureConverter()
  document.body.appendChild(component)

  const input = component.querySelector('#valueInput') as HTMLInputElement
  const fromSelect = component.querySelector('#fromUnit') as HTMLSelectElement
  const toSelect = component.querySelector('#toUnit') as HTMLSelectElement
  const convertBtn = component.querySelector('#convertButton') as HTMLButtonElement

  input.value = '100'
  fromSelect.value = 'celsius'
  toSelect.value = 'fahrenheit'

  convertBtn.click()

  const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
  expect(history.length).toBe(1)
  expect(history[0].type).toBe('Température')
  expect(history[0].input).toBe('100 °C')
  expect(history[0].output).toMatch(/°F/)
})

test('should add conversion to favorites after conversion', () => {
  const component = createTemperatureConverter()
  document.body.appendChild(component)

  const input = component.querySelector('#valueInput') as HTMLInputElement
  const fromSelect = component.querySelector('#fromUnit') as HTMLSelectElement
  const toSelect = component.querySelector('#toUnit') as HTMLSelectElement
  const convertBtn = component.querySelector('#convertButton') as HTMLButtonElement
  const favBtn = component.querySelector('#favoriteButton') as HTMLButtonElement

  input.value = '0'
  fromSelect.value = 'celsius'
  toSelect.value = 'kelvin'
  convertBtn.click()
  favBtn.click()

  const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
  expect(favs.length).toBe(1)
  expect(favs[0].from).toBe('0 °C')
  expect(favs[0].to).toMatch(/K/)
})
