
import { createNavigation } from './navigation'
import { createHistory } from './History'
import { createFavorites } from './Favorites'
import { createLengthConverter } from './LengthConverter'
import { createTemperatureConverter } from './TemperatureConverter'
import { createWeightConverter } from './WeightConverter'
import { createVolumeConverter } from './VolumeConverter'
import { createCurrencyConverter } from './CurrencyConverter'
import { createCryptoConverter } from './CryptoConverter'
import { renderHistoryTable } from './History'
import { renderFavoritesTable } from './Favorites'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div id="navigation"></div>
  <div id="converter"></div>
  <div class="grid grid-cols-2 gap-4 p-4">
    <div id="history"></div>
    <div id="favorites"></div>
  </div>
`

document.getElementById('navigation')!.appendChild(createNavigation())
document.getElementById('history')!.appendChild(createHistory())
document.getElementById('favorites')!.appendChild(createFavorites())
renderHistoryTable()
renderFavoritesTable()

function renderRoute(route: string) {
  const converter = document.getElementById('converter')!
  converter.innerHTML = '' 

  switch (route) {
    case 'length-converter':
      converter.appendChild(createLengthConverter())
      break
    case 'temperature-converter':
      converter.appendChild(createTemperatureConverter())
      break
    case 'weight-converter':
      converter.appendChild(createWeightConverter())
      break
    case 'volume-converter':
      converter.appendChild(createVolumeConverter())
      break
    case 'currency-converter':
      converter.appendChild(createCurrencyConverter())
      break
    case 'crypto-converter':
      converter.appendChild(createCryptoConverter())
      break

    default:
      converter.innerHTML = '<p>Page non trouvée.</p>'
  }
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault()
    const href = (event.target as HTMLAnchorElement).getAttribute('href')!
    renderRoute(href)
    history.pushState(null, '', `#${href}`)
  })
})

window.addEventListener('popstate', () => {
  const route = location.hash.replace('#', '') || 'length-converter'
  renderRoute(route)
})

const initialRoute = location.hash.replace('#', '') || 'length-converter'
renderRoute(initialRoute)
