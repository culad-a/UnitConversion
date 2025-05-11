
export function refreshHistoryTable() {
    const tbody = document.getElementById('historyTableBody')
    if (!tbody) return
  
    const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]')
  
    tbody.innerHTML = ''
  
    history.slice().reverse().forEach(entry => {
		const row = document.createElement('tr')
		row.innerHTML = `
			<td class="border px-4 py-2">${entry.type}</td>
			<td class="border px-4 py-2">${entry.input}</td>
			<td class="border px-4 py-2">${entry.output}</td>
			<td class="border px-4 py-2">${entry.date}</td>
		`
		tbody.appendChild(row)
    })
}

export function refreshFavoritesTable() {
    const tableBody = document.getElementById('favoritesTableBody')
    if (!tableBody) return
  
    tableBody.innerHTML = ''
  
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  
    favorites.forEach((item: any) => {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td class="border px-4 py-2">${item.type}</td>
        <td class="border px-4 py-2">${item.from}</td>
        <td class="border px-4 py-2">${item.to}</td>
        <td class="border px-4 py-2">${item.date}</td>
      `
      tableBody.appendChild(row)
    })
  }