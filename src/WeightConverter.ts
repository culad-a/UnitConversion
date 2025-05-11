import { addFavorite } from './Favorites'
import { addToHistory } from './History'

export function createWeightConverter(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
  <div class="p-6">
    <h2 class="text-xl font-bold">Convertisseur de poids</h2>
    <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
      <input
        type="number"
        id="valueInput"
        placeholder="Valeur"
        class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
      />

      <select
        id="fromUnit"
        class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
      >
        <option value="gram">Gramme</option>
        <option value="kilogram">Kilogramme</option>
        <option value="pound">Livre</option>
      </select>

      <span class="text-xl">→</span>

      <select
        id="toUnit"
        class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
      >
        <option value="gram">Gramme</option>
        <option value="kilogram">Kilogramme</option>
        <option value="pound">Livre</option>
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
    gram: 'g',
    kilogram: 'kg',
    pound: 'lb',
  }

  let lastConversion: {
    input: string
    output: string
    date: string
  } | null = null

  container.querySelector<HTMLButtonElement>('#convertButton')!.addEventListener('click', () => {
    const value = parseFloat((container.querySelector('#valueInput') as HTMLInputElement).value)
    const fromUnit = (container.querySelector('#fromUnit') as HTMLSelectElement).value
    const toUnit = (container.querySelector('#toUnit') as HTMLSelectElement).value
    const result = convertWeight(value, fromUnit, toUnit)

    const resultElement = container.querySelector<HTMLParagraphElement>('#result')!
    if (isNaN(result)) {
      resultElement.textContent = 'Valeur invalide.'
      return
    }

    const inputStr = `${value} ${unitLabels[fromUnit]}`
    const outputStr = `${result.toFixed(4)} ${unitLabels[toUnit]}`
    const dateStr = new Date().toLocaleString()

    resultElement.textContent = `${inputStr} = ${outputStr}`

    lastConversion = { input: inputStr, output: outputStr, date: dateStr }

    addToHistory({
      type: 'Poids',
      input: inputStr,
      output: outputStr,
      date: dateStr,
    })
  })

  container.querySelector<HTMLButtonElement>('#favoriteButton')!.addEventListener('click', () => {
    if (!lastConversion) return
    addFavorite({
      type: 'Poids',
      from: lastConversion.input,
      to: lastConversion.output,
      date: lastConversion.date
    })
  })

  return container
}

export function convertWeight(value: number, from: string, to: string): number {
  const toGrams: { [key: string]: number } = {
    gram: 1,
    kilogram: 1000,
    pound: 453.59237,
  }

  const inGrams = value * toGrams[from]
  return inGrams / toGrams[to]
}
