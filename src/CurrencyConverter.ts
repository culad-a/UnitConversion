import { addFavorite } from './Favorites'
import { addToHistory } from './History'

export function createCurrencyConverter(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <div class="p-6">
      <h2 class="text-xl font-bold">Convertisseur de monnaies</h2>
      <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <input
          type="number"
          id="valueInput"
          placeholder="Montant"
          class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        />

        <select
          id="fromUnit"
          class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        >
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar (USD)</option>
          <option value="GBP">Livre Sterling (GBP)</option>
          <option value="JPY">Yen (JPY)</option>
        </select>

        <span class="text-xl">→</span>

        <select
          id="toUnit"
          class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        >
          <option value="EUR">Euro (EUR)</option>
          <option value="USD">Dollar (USD)</option>
          <option value="GBP">Livre Sterling (GBP)</option>
          <option value="JPY">Yen (JPY)</option>
        </select>

        <button
          id="convertButton"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
        >
          Convertir
        </button>
      </div>
      <p id="result" class="text-lg font-medium text-gray-700 my-4"></p>

      <button
        id="favoriteButton"
        class="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded"
      >
        Ajouter aux favoris
      </button>
    </div>
  `

  const unitLabels: { [key: string]: string } = {
    EUR: 'Euro',
    USD: 'Dollar',
    GBP: 'Livre Sterling',
    JPY: 'Yen',
  }

  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.86,
    JPY: 165.12,
  }

  let lastConversion: {
    input: string
    output: string
    date: string
  } | null = null

  container.querySelector<HTMLButtonElement>('#convertButton')!.addEventListener('click', () => {
    const value = parseFloat((container.querySelector('#valueInput') as HTMLInputElement).value)
    const from = (container.querySelector('#fromUnit') as HTMLSelectElement).value
    const to = (container.querySelector('#toUnit') as HTMLSelectElement).value
    const resultElement = container.querySelector<HTMLParagraphElement>('#result')!

    if (isNaN(value)) {
      resultElement.textContent = 'Valeur invalide.'
      return
    }

    const inEuro = value / exchangeRates[from]
    const result = inEuro * exchangeRates[to]

    const inputStr = `${value.toFixed(2)} ${unitLabels[from]}`
    const outputStr = `${result.toFixed(2)} ${unitLabels[to]}`
    const dateStr = new Date().toLocaleString()

    resultElement.textContent = `${inputStr} = ${outputStr}`

    lastConversion = { input: inputStr, output: outputStr, date: dateStr }

    addToHistory({
      type: 'Monnaie',
      input: inputStr,
      output: outputStr,
      date: dateStr,
    })
  })

  container.querySelector<HTMLButtonElement>('#favoriteButton')!.addEventListener('click', () => {
    if (!lastConversion) return
    addFavorite({
      type: 'Monnaie',
      from: lastConversion.input,
      to: lastConversion.output,
      date: lastConversion.date
    })
  })

  return container
}
