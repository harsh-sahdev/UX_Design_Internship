const { test, expect } = require("@playwright/test");

const delivery = async (page) => {
  await page.locator("#full-name").fill("Riya Shah");
  await page.locator("#email").fill("riya@example.com");
  await page.locator("#address").fill("22 Park View Road, Model Town");
  await page.locator("#city").fill("Mumbai");
  await page.locator("#postal").fill("400001");
};
test.beforeEach(async ({ page }) => { await page.goto("/checkout/"); });

test("checkout starts with correct cart and totals", async ({ page }) => {
  await expect(page.locator("#item-count")).toContainText("2 items");
  await expect(page.locator("#subtotal")).toContainText("3,698.00");
  await expect(page.locator("#grand-total")).toContainText("3,698.00");
  await expect(page.locator("#payment-panel")).toBeHidden();
  await expect(page.locator("#delivery-panel")).toBeVisible();
});

test("quantity edits adjust subtotal and basket count", async ({ page }) => {
  await page.getByRole("button", { name: "Add one Cloud Knit Runner" }).click();
  await expect(page.locator("#item-count")).toContainText("3 items");
  await expect(page.locator("#subtotal")).toContainText("6,497.00");
  await page.getByRole("button", { name: "Remove one Everyday Canvas Tote" }).click();
  await expect(page.locator("#subtotal")).toContainText("5,598.00");
  await expect(page.locator("#item-count")).toContainText("2 items");
});

test("express shipping and sample promo recalculate grand total", async ({ page }) => {
  await page.locator('input[name="shipping"][value="express"]').check();
  await expect(page.locator("#delivery-cost")).toContainText("149.00");
  await page.locator("#coupon-code").fill("demo10");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator("#discount")).toContainText("369.80");
  await expect(page.locator("#grand-total")).toContainText("3,477.20");
  await page.locator("#coupon-code").fill("INVALID");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.locator("#coupon-message")).toContainText("not recognised");
  await expect(page.locator("#grand-total")).toContainText("3,847.00");
});

test("empty basket blocks progress until sample item is added", async ({ page }) => {
  await page.getByRole("button", { name: "Remove one Cloud Knit Runner" }).click();
  await page.getByRole("button", { name: "Remove one Everyday Canvas Tote" }).click();
  await expect(page.locator("#cart-empty")).toBeVisible();
  await expect(page.locator("#grand-total")).toContainText("0.00");
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.locator("#cart-error")).toBeVisible();
  await expect(page.locator("#payment-panel")).toBeHidden();
  await page.getByRole("button", { name: "+ Runner" }).click();
  await expect(page.locator("#cart-empty")).toBeHidden();
  await expect(page.locator("#subtotal")).toContainText("2,799.00");
});

test("invalid delivery inputs show targeted errors", async ({ page }) => {
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.locator("#delivery-error")).toContainText("full name");
  await delivery(page);
  await page.locator("#postal").fill("123");
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.locator("#delivery-error")).toContainText("6-digit PIN");
  await page.locator("#postal").fill("400001");
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.locator("#payment-panel")).toBeVisible();
  await expect(page.locator("#address-preview")).toContainText("Riya Shah");
});

test("address can be edited and demo order completes without payment data", async ({ page }) => {
  await delivery(page);
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await expect(page.locator("#payment-panel")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("#delivery-panel")).toBeVisible();
  await expect(page.locator("#full-name")).toHaveValue("Riya Shah");
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await page.locator('input[name="payment"][value="cod"]').check();
  await page.getByRole("button", { name: /Place demo order/ }).click();
  await expect(page.locator("#success-panel")).toBeVisible();
  await expect(page.locator("#order-id")).toContainText("DEMO-");
  await expect(page.locator("#order-total")).toContainText("3,698.00");
  await expect(page.locator("#cart-adjust")).toHaveCount(0);
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.locator("#delivery-panel")).toBeVisible();
  await expect(page.locator("#full-name")).toHaveValue("");
});

test("desktop and mobile checkout remain inside viewport", async ({ page }) => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow, "Horizontal overflow at " + width).toBe(false);
  }
});

test("record screenshots for checkout review", async ({ page }) => {
  const fs = require("fs");
  fs.mkdirSync("screenshots", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: "screenshots/checkout-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "screenshots/checkout-mobile.png", fullPage: true });
  await delivery(page);
  await page.getByRole("button", { name: /Continue to payment/ }).click();
  await page.screenshot({ path: "screenshots/checkout-payment-mobile.png", fullPage: true });
});
