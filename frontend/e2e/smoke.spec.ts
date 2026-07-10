import { expect, test } from '@playwright/test'

test.describe('Public site', () => {
  test('landing page loads hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#hero')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('news list page loads', async ({ page }) => {
    await page.goto('/berita')
    await expect(page.getByRole('heading', { name: 'Informasi Terkini' })).toBeVisible()
  })

  test('agenda list page loads', async ({ page }) => {
    await page.goto('/agenda')
    await expect(page.getByRole('heading', { name: 'Jadwal & Acara' })).toBeVisible()
  })

  test('news detail page loads from seeded slug', async ({ page }) => {
    await page.goto('/berita/penerimaan-peserta-didik-baru-2026')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Penerimaan Peserta Didik Baru')
  })
})

test.describe('Authentication', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: /masuk/i })).toBeVisible()
  })

  test('admin can login and reach dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@sekolah.test')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: /masuk/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })
})

test.describe('Settings CMS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@sekolah.test')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: /masuk/i }).click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('general settings page loads', async ({ page }) => {
    await page.goto('/dashboard/settings/general')
    await expect(page.getByRole('heading', { name: 'Pengaturan Umum' })).toBeVisible()
    await expect(page.getByLabel('Nama Sekolah')).toBeVisible()
  })

  test('hero settings page loads slides', async ({ page }) => {
    await page.goto('/dashboard/settings/hero')
    await expect(page.getByRole('heading', { name: 'Pengaturan Hero' })).toBeVisible()
    await expect(page.getByText('Slide 1')).toBeVisible()
  })
})
