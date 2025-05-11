import { addFavorite } from './Favorites'

beforeEach(() => {
  localStorage.clear()
})

test('addFavorite should store favorite in localStorage', () => {
  const fav = {
    type: 'Longueur',
    from: '1 mètre',
    to: '3.2808 pieds',
    date: '2025-05-11 10:10'
  }

  addFavorite(fav)

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  expect(favorites.length).toBe(1)
  expect(favorites[0]).toEqual(fav)
})
