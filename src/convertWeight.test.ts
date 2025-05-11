import { convertWeight } from './WeightConverter'

describe('convertWeight', () => {
  test('converts grams to kilograms', () => {
    expect(convertWeight(1000, 'gram', 'kilogram')).toBeCloseTo(1)
  })

  test('converts kilograms to grams', () => {
    expect(convertWeight(1.5, 'kilogram', 'gram')).toBeCloseTo(1500)
  })

  test('converts pounds to grams', () => {
    expect(convertWeight(1, 'pound', 'gram')).toBeCloseTo(453.59237)
  })

  test('converts grams to pounds', () => {
    expect(convertWeight(1000, 'gram', 'pound')).toBeCloseTo(2.2046, 4)
  })

  test('returns same value when units are the same', () => {
    expect(convertWeight(123, 'kilogram', 'kilogram')).toBe(123)
  })

  test('returns NaN for invalid source unit', () => {
    expect(convertWeight(100, 'invalid', 'gram')).toBeNaN()
  })

  test('returns NaN for invalid target unit', () => {
    expect(convertWeight(100, 'gram', 'invalid')).toBeNaN()
  })

  test('returns NaN for invalid source and target units', () => {
    expect(convertWeight(100, 'foo', 'bar')).toBeNaN()
  })
})
