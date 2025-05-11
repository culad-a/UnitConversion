import { test, expect } from '@playwright/test'

test.describe('Convertisseur d\'unités', () => {
  test('Scénario 1 : Conversion d\'une unité de longueur', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('#valueInput').fill('10')
    await page.locator('#fromUnit').selectOption('m')
    await page.locator('#toUnit').selectOption('ft')
    await page.locator('#convertButton').click()
    await expect(page.locator('#result')).toContainText('ft')
  })

  test('Scénario 2 : Conversion d\'une monnaie', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('#valueInput').fill('100')
    await page.locator('#fromUnit').selectOption('EUR')
    await page.locator('#toUnit').selectOption('USD')
    await page.locator('#convertButton').click()
    await expect(page.locator('#result')).toContainText('USD')
  })

  test('Scénario 3 : Ajout aux favoris', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('#valueInput').fill('50')
    await page.locator('#fromUnit').selectOption('USD')
    await page.locator('#toUnit').selectOption('EUR')
    await page.locator('#convertButton').click()
    await page.locator('#favoriteButton').click()
    await page.locator('#favoritesTab').click()
    await expect(page.locator('.favorite-item')).toContainText('USD')
  })

  test('Scénario 4 : Historique après conversion', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.locator('#valueInput').fill('75')
    await page.locator('#fromUnit').selectOption('EUR')
    await page.locator('#toUnit').selectOption('JPY')
    await page.locator('#convertButton').click()
    await page.locator('#historyTab').click()
    await expect(page.locator('.history-item')).toContainText('EUR')
  })
})
