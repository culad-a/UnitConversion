import { refreshFavoritesTable } from './utils'

export function createHistory(): HTMLElement {
  const container = document.createElement('div')

  container.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Historique des conversions</h2>
    <button id="clearHistory" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4">
      Supprimer tout l'historique
    </button>
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th class="border px-4 py-2">Type de conversion</th>
          <th class="border px-4 py-2">Valeur initiale</th>
          <th class="border px-4 py-2">Valeur convertie</th>
          <th class="border px-4 py-2">Date</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody id="historyTableBody"></tbody>
    </table>
  `

  renderHistoryTable()
  refreshFavoritesTable()

  container.querySelector<HTMLButtonElement>('#clearHistory')!.addEventListener('click', () => {
    localStorage.removeItem('conversionHistory')
    renderHistoryTable()
  })

  return container
}

export function renderHistoryTable() {
  const tableBody = document.querySelector<HTMLTableSectionElement>('#historyTableBody')
  if (!tableBody) return

  tableBody.innerHTML = ''

  const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')

  if (history.length === 0) {
    const row = document.createElement('tr')
    row.innerHTML = `<td colspan="5" class="text-center border px-4 py-2">Aucune conversion enregistrée.</td>`
    tableBody.appendChild(row)
  } else {
    history.forEach((entry: any, index: number) => {
      console.log("plplp", entry, index)
      const row = document.createElement('tr')
      row.innerHTML = `
        <td class="border px-4 py-2">${entry.type}</td>
        <td class="border px-4 py-2">${entry.input}</td>
        <td class="border px-4 py-2">${entry.output}</td>
        <td class="border px-4 py-2">${entry.date}</td>
        <td class="border px-4 py-2 text-center">
          <button class="delete-history bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">
            supprimer
          </button>
        </td>
      `
      tableBody.appendChild(row)
    })

    document.querySelectorAll<HTMLButtonElement>('.delete-history').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.getAttribute('data-index')!)
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
        history.splice(index, 1)
        localStorage.setItem('conversionHistory', JSON.stringify(history))
        renderHistoryTable()
      })
    })
  }
}

export function addToHistory(entry: {
  type: string
  input: string
  output: string
  date: string
}) {
  const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
  history.push(entry)
  localStorage.setItem('conversionHistory', JSON.stringify(history))
  renderHistoryTable()
}