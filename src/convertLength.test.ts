import { convertLength } from './LengthConverter'

test('convert meter to kilometer', () => {
  expect(convertLength(1000, 'meter', 'kilometer')).toBeCloseTo(1)
})

test('convert inch to foot', () => {
  expect(convertLength(12, 'inch', 'foot')).toBeCloseTo(1)
})
