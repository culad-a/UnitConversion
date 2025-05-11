import { addFavorite } from './Favorites'
import { addToHistory } from './History'

export function createCryptoConverter(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <div class="p-6">
      <h2 class="text-xl font-bold">Convertisseur de crypto-monnaies</h2>
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
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
        </select>

        <span class="text-xl">→</span>

        <select
          id="toUnit"
          class="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
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
    bitcoin: 'Bitcoin (BTC)',
    ethereum: 'Ethereum (ETH)',
    solana: 'Solana (SOL)',
  }

  let lastConversion: {
    input: string
    output: string
    date: string
  } | null = null

  container.querySelector<HTMLButtonElement>('#convertButton')!.addEventListener('click', async () => {
    const value = parseFloat((container.querySelector('#valueInput') as HTMLInputElement).value)
    const fromUnit = (container.querySelector('#fromUnit') as HTMLSelectElement).value
    const toUnit = (container.querySelector('#toUnit') as HTMLSelectElement).value
    const resultElement = container.querySelector<HTMLParagraphElement>('#result')!

    if (isNaN(value) || value <= 0) {
      resultElement.textContent = 'Veuillez entrer une valeur valide.'
      return
    }

    try {
      const result = await convertCrypto(value, fromUnit, toUnit)
      const inputStr = `${value} ${unitLabels[fromUnit]}`
      const outputStr = `${result.toFixed(6)} ${unitLabels[toUnit]}`
      const dateStr = new Date().toLocaleString()

      resultElement.textContent = `${inputStr} = ${outputStr}`

      lastConversion = { input: inputStr, output: outputStr, date: dateStr }

      addToHistory({
        type: 'Crypto-monnaie',
        input: inputStr,
        output: outputStr,
        date: dateStr,
      })
    } catch (error) {
      console.error(error)
      resultElement.textContent = 'Erreur lors de la conversion.'
    }
  })

  container.querySelector<HTMLButtonElement>('#favoriteButton')!.addEventListener('click', () => {
    if (!lastConversion) return
    addFavorite({
      type: 'Crypto-monnaie',
      from: lastConversion.input,
      to: lastConversion.output,
      date: lastConversion.date
    })
  })

  return container
}

export async function convertCrypto(value: number, from: string, to: string): Promise<number> {
  if (from === to) return value

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from},${to}&vs_currencies=usd`)
    const data = await response.json()

    console.log('API Response:', data)

    if (!data[from] || !data[to]) {
      throw new Error('Invalid cryptocurrency ID or data not available')
    }

    const fromPrice = data[from].usd
    const toPrice = data[to].usd

    return (value * fromPrice) / toPrice
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error)
    throw new Error('Error fetching data from CoinGecko')
  }
}
