import { test, expect } from '@playwright/test'

test('search and save a favorite', async ({ page }) => {
    await page.goto('/')
    await page.getByLabel('Query').fill('pride')
    await page.getByRole('button', { name: 'Search' }).click()

    await page.getByRole('article').nth(0).scrollIntoViewIfNeeded()
    await page.getByRole('article').nth(0).getByLabel('Notes').fill('Looks interesting')
    await page.getByRole('article').nth(0).getByRole('button', { name: 'Save' }).click()

    // Navigate to favorites
    await page.getByRole('link', { name: 'Favorites' }).click()
    await expect(page.locator('h1')).toHaveText('Favorites')
})
