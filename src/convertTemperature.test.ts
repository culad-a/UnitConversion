import { convertTemperature } from './TemperatureConverter'

test('convert Celsius to Fahrenheit', () => {
  expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBeCloseTo(32)
})

test('convert Fahrenheit to Celsius', () => {
  expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBeCloseTo(0)
})

test('convert Kelvin to Celsius', () => {
  expect(convertTemperature(273.15, 'kelvin', 'celsius')).toBeCloseTo(0)
})

test('convert Celsius to Kelvin', () => {
  expect(convertTemperature(100, 'celsius', 'kelvin')).toBeCloseTo(373.15)
})

test('convert between same units returns same value', () => {
  expect(convertTemperature(42, 'kelvin', 'kelvin')).toBe(42)
})

test('invalid unit returns NaN', () => {
  expect(convertTemperature(1, 'invalid', 'celsius')).toBeNaN()
})
