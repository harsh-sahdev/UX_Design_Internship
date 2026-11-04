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