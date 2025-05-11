import { addToHistory } from './History';
import { addFavorite } from './Favorites';
import { createCurrencyConverter } from './CurrencyConverter';

jest.mock('./History', () => ({
  addToHistory: jest.fn(),
}));

jest.mock('./Favorites', () => ({
  addFavorite: jest.fn(),
}));

describe('createCurrencyConverter', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = createCurrencyConverter();
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('convertit correctement de EUR à USD', () => {
    const valueInput = container.querySelector<HTMLInputElement>('#valueInput')!;
    valueInput.value = '100';
    const fromUnit = container.querySelector<HTMLSelectElement>('#fromUnit')!;
    const toUnit = container.querySelector<HTMLSelectElement>('#toUnit')!;
    fromUnit.value = 'EUR';
    toUnit.value = 'USD';

    const convertButton = container.querySelector<HTMLButtonElement>('#convertButton')!;
    convertButton.click(); 

    const resultElement = container.querySelector<HTMLParagraphElement>('#result')!;
    expect(resultElement.textContent).toBe('100.00 Euro = 108.00 Dollar');

    expect(addToHistory).toHaveBeenCalledWith({
      type: 'Monnaie',
      input: '100.00 Euro',
      output: '108.00 Dollar',
      date: expect.any(String),
    });
  });

  test('affiche une erreur si la valeur est invalide', () => {
    const valueInput = container.querySelector<HTMLInputElement>('#valueInput')!;
    valueInput.value = 'abc'; 
    const convertButton = container.querySelector<HTMLButtonElement>('#convertButton')!;
    convertButton.click();

    const resultElement = container.querySelector<HTMLParagraphElement>('#result')!;
    expect(resultElement.textContent).toBe('Valeur invalide.');

    expect(addToHistory).not.toHaveBeenCalled();
  });

  test('ajoute une conversion aux favoris après clic', () => {
    const valueInput = container.querySelector<HTMLInputElement>('#valueInput')!;
    valueInput.value = '100'; 
    const fromUnit = container.querySelector<HTMLSelectElement>('#fromUnit')!;
    const toUnit = container.querySelector<HTMLSelectElement>('#toUnit')!;
    fromUnit.value = 'EUR';
    toUnit.value = 'USD';

    const convertButton = container.querySelector<HTMLButtonElement>('#convertButton')!;
    convertButton.click();

    const favButton = container.querySelector<HTMLButtonElement>('#favoriteButton')!;
    favButton.click();

    expect(addFavorite).toHaveBeenCalledWith({
      type: 'Monnaie',
      from: '100.00 Euro',
      to: '108.00 Dollar',
      date: expect.any(String),
    });
  });
});
