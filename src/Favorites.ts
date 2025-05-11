

export function createFavorites(): HTMLElement {
  const container = document.createElement('div')

  container.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Favoris</h2>
    <button id="clearFavorites" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4">
      Supprimer tous les favoris
    </button>
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="border px-4 py-2">Type</th>
          <th class="border px-4 py-2">Valeur initiale</th>
          <th class="border px-4 py-2">Valeur convertie</th>
          <th class="border px-4 py-2">Date</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody id="favoritesTableBody">
      </tbody>
    </table>
  `

  renderFavoritesTable()

  container.querySelector<HTMLButtonElement>('#clearFavorites')!.addEventListener('click', () => {
    localStorage.removeItem('favorites')
    renderFavoritesTable()
  })

  return container
}

export function addFavorite(entry: {
  type: string
  from: string
  to: string
  date: string
}) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  favorites.push(entry)
  localStorage.setItem('favorites', JSON.stringify(favorites))
  renderFavoritesTable()
}

export function renderFavoritesTable() {
  const tableBody = document.querySelector<HTMLTableSectionElement>('#favoritesTableBody')
  if (!tableBody) return

  tableBody.innerHTML = ''

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')

  if (favorites.length === 0) {
    const row = document.createElement('tr')
    row.innerHTML = `<td colspan="5" class="text-center border px-4 py-2">Aucun favori enregistré.</td>`
    tableBody.appendChild(row)
    return
  }

  favorites.forEach((entry: any, index: number) => {
    const row = document.createElement('tr')
    row.innerHTML = `
      <td class="border px-4 py-2">${entry.type}</td>
      <td class="border px-4 py-2">${entry.from}</td>
      <td class="border px-4 py-2">${entry.to}</td>
      <td class="border px-4 py-2">${entry.date}</td>
      <td class="border px-4 py-2 text-center">
        <button class="delete-fav bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">
          supprimer
        </button>
      </td>
    `
    tableBody.appendChild(row)
  })

  document.querySelectorAll<HTMLButtonElement>('.delete-fav').forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index')!)
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      favorites.splice(index, 1)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      renderFavoritesTable()
    })
  })
}
