const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/wallet/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("starts empty and creates money-in and money-out entries", async ({ page }) => {
  await expect(page.locator("#balance")).toContainText("0.00");
  await expect(page.locator("#entry-list li")).toHaveCount(0);

  await page.getByRole("button", { name: /Money in Income/ }).click();
  await page.locator("#entry-description").fill("First deposit");
  await page.locator("#entry-amount").fill("500.00");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(page.locator("#balance")).toContainText("500.00");
  await expect(page.locator("#entry-list li")).toHaveCount(1);

  await page.getByRole("button", { name: /Money out Purchases/ }).click();
  await page.locator("#entry-description").fill("Groceries");
  await page.locator("#entry-amount").fill("125.25");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(page.locator("#balance")).toContainText("374.75");
  await expect(page.locator("#entry-list li")).toHaveCount(2);

  await page.reload();
  await expect(page.locator("#balance")).toContainText("374.75");
});

test("rejects overdrafts and invalid amounts", async ({ page }) => {
  await page.getByRole("button", { name: /Money out Purchases/ }).click();
  await page.locator("#entry-description").fill("Too much");
  await page.locator("#entry-amount").fill("30");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(page.locator("#entry-error")).toContainText("more than your recorded balance");
  await page.locator("#entry-amount").fill("1.999");
  await page.getByRole("button", { name: "Save entry" }).click();
  await expect(page.locator("#entry-error")).toContainText("two decimal places");
});

test("masking and reset confirmation work", async ({ page }) => {
  await page.locator("#toggle-balance").click();
  await expect(page.locator("#balance")).toContainText("••••");
  await page.locator("#toggle-balance").click();
  await expect(page.locator("#balance")).toContainText("0.00");
  await page.getByRole("button", { name: "Clear all records" }).click();
  await expect(page.getByRole("heading", { name: "Clear every record?" })).toBeVisible();
  await page.getByRole("button", { name: "Keep records" }).click();
  await expect(page.locator("#clear-dialog")).not.toBeVisible();
});

test("allows correcting and deleting a recorded transaction", async ({ page }) => {
  await page.getByRole("button", { name: /Money in Income/ }).click();
  await page.locator("#entry-description").fill("Deposit");
  await page.locator("#entry-amount").fill("250");
  await page.getByRole("button", { name: "Save entry" }).click();
  await page.getByRole("button", { name: "Edit Deposit" }).click();
  await page.locator("#entry-amount").fill("300");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.locator("#balance")).toContainText("300.00");
  await page.getByRole("button", { name: "Edit Deposit" }).click();
  await page.locator("#delete-entry").click();
  await page.locator("#confirm-delete").click();
  await expect(page.locator("#balance")).toContainText("0.00");
  await expect(page.locator("#entry-list li")).toHaveCount(0);
});

test("mobile layout does not overflow horizontally", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const tooWide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(tooWide).toBeFalsy();
});


test("search, filters and CSV export work", async ({ page }) => {
  await page.getByRole("button", { name: /Money in Income/ }).click();
  await page.locator("#entry-description").fill("Salary");
  await page.locator("#entry-amount").fill("2000.00");
  await page.getByRole("button", { name: "Save entry" }).click();

  await page.getByRole("button", { name: /Money out Purchases/ }).click();
  await page.locator("#entry-description").fill("Coffee");
  await page.locator("#entry-amount").fill("85.50");
  await page.getByRole("button", { name: "Save entry" }).click();

  await page.locator("[data-filter=in]").click();
  await expect(page.locator("#entry-list li")).toHaveCount(1);
  await expect(page.locator("#entry-list")).toContainText("Salary");
  await page.locator("[data-filter=all]").click();
  await page.locator("#entry-search").fill("Coffee");
  await expect(page.locator("#entry-list li")).toHaveCount(1);
  await expect(page.locator("#entry-list")).toContainText("Coffee");

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#export-top").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^interface-craft-wallet-\d{4}-\d{2}-\d{2}\.csv$/);
});

test("captures desktop and mobile empty states", async ({ page }) => {
  const fs = require("fs");
  fs.mkdirSync("screenshots", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "screenshots/wallet-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "screenshots/wallet-mobile.png", fullPage: true });
});
