import { convertVolume } from './VolumeConverter' 

describe('convertVolume', () => {
  test('converts liters to gallons', () => {
    expect(convertVolume(3.78541, 'liter', 'gallon')).toBeCloseTo(1)
  })

  test('converts gallons to liters', () => {
    expect(convertVolume(2, 'gallon', 'liter')).toBeCloseTo(7.57082)
  })

  test('returns same value when units are the same (liter → liter)', () => {
    expect(convertVolume(5, 'liter', 'liter')).toBe(5)
  })

  test('returns same value when units are the same (gallon → gallon)', () => {
    expect(convertVolume(2.5, 'gallon', 'gallon')).toBe(2.5)
  })

  test('returns NaN for invalid "from" unit', () => {
    expect(convertVolume(1, 'invalid', 'liter')).toBeNaN()
  })

  test('returns NaN for invalid "to" unit', () => {
    expect(convertVolume(1, 'liter', 'invalid')).toBeNaN()
  })

  test('returns NaN when both units are invalid', () => {
    expect(convertVolume(1, 'foo', 'bar')).toBeNaN()
  })

  test('converts 0 liters to gallons', () => {
    expect(convertVolume(0, 'liter', 'gallon')).toBe(0)
  })
})
