export function createNavigation(): HTMLElement {
  const container = document.createElement('div')
  container.innerHTML = `
    <nav>
      <ul class="flex justify-between px-8 py-4 ">
        <li><a href="length-converter">Convertisseur de longueur</a></li>
        <li><a href="temperature-converter">Convertisseur de température</a></li>
        <li><a href="weight-converter">Convertisseur de poids</a></li>
        <li><a href="volume-converter">Convertisseur de volume</a></li>
        <li><a href="currency-converter">Convertisseur de devise</a></li>
        <li><a href="crypto-converter">Convertisseur de crypto-monnaie</a></li>
      </ul>
    </nav>
  `
  return container
}