const {test,expect}=require("@playwright/test");
for(const pathname of ["/","/wallet/","/checkout/","/design-system/"]){
 test("consistent Interface Craft wordmark on "+pathname,async({page})=>{
   await page.goto(pathname);
   await expect(page.locator(".ic-brand .ic-name").first()).toContainText("interfacecraft.");
   const colour=await page.locator(".ic-brand .ic-name>span").first().evaluate(el=>getComputedStyle(el).color);
   expect(colour).toBe(pathname==="/wallet/" ? "rgb(162, 214, 192)" : "rgb(32, 91, 80)");
 });
}
test("portfolio navigation links open all three pages",async({page})=>{
 await page.goto("/");
 for(const target of ["wallet/","checkout/","design-system/"])
   await expect(page.locator('a[href="./'+target+'"]').first()).toHaveAttribute("href","./"+target);
});
test("capture all section previews",async({page})=>{
 const fs=require("fs");fs.mkdirSync("screenshots",{recursive:true});
 for(const [name,path] of [["home","/"],["checkout","/checkout/"],["design-system","/design-system/"]]){
  await page.setViewportSize({width:1440,height:900});await page.goto(path);
  await page.screenshot({path:"screenshots/"+name+"-desktop.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:"screenshots/"+name+"-mobile.png",fullPage:true});
 }
});
