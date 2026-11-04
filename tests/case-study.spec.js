const {test,expect}=require("@playwright/test");

test("case study opens with all ten designed slides",async({page})=>{
 await page.goto("/case-study/");
 await expect(page).toHaveTitle(/UX case study/i);
 await expect(page.locator(".slide")).toHaveCount(10);
 await expect(page.locator(".slide.active")).toHaveCount(1);
 await expect(page.locator("#count")).toHaveText("1 / 10");
 await expect(page.getByRole("heading",{name:/make everyday money easier to understand/i})).toBeVisible();
});
test("case study supports keyboard navigation and deep linking",async({page})=>{
 await page.goto("/case-study/");
 await page.keyboard.press("ArrowRight");
 await expect(page.locator("#count")).toHaveText("2 / 10");
 await expect(page).toHaveURL(/#slide-2$/);
 await page.keyboard.press("End");
 await expect(page.locator("#count")).toHaveText("10 / 10");
 await page.keyboard.press("Home");
 await expect(page.locator("#count")).toHaveText("1 / 10");
 await page.reload();
 await expect(page.locator("#count")).toHaveText("1 / 10");
});
test("case study is readable on 390px and prints every slide",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/case-study/");
 await expect(page.locator(".slide.active .sheet")).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
 expect(overflow).toBe(false);
 await page.emulateMedia({media:"print"});
 await expect(page.locator(".slide")).toHaveCount(10);
 expect(await page.locator(".slide").first().evaluate(el=>getComputedStyle(el).display)).toBe("block");
 expect(await page.locator(".slide").last().evaluate(el=>getComputedStyle(el).display)).toBe("block");
});
test("case study links back to real work and Figma file",async({page})=>{
 await page.goto("/case-study/");
 await page.keyboard.press("End");
 await expect(page.locator("a[href='../wallet/']")).toBeVisible();
 await expect(page.locator("a[href='../checkout/']")).toBeVisible();
 await expect(page.locator("a[href*='figma.com/design/']")).toBeVisible();
});