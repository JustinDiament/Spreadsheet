import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

describe("cellDisplay component", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async() => {
    browser = await puppeteer.launch({
      headless: false,
      // pipe: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        // '--single-process',
        '--disable-features=site-per-process'
      ],
      slowMo: 100
    })
  });

  beforeEach(async () => {
    try{
      page = await browser.newPage();
      await page.goto("http://localhost:3000");
    } catch {
      console.error("failed before each");
    }
    
  });

  afterEach(async () => {
    try{
     await page.close();
    page = null as any;
    } catch {
      console.error("failed after each");
    }
    
  });

  afterAll(async () => {
    try{
     await browser.close();
    browser = null as any;
    } catch {
      console.error("failed after all");
    }
    
  });

  it('should have the title "Spreadsheet"', async () => {
  
      try {
              await expect(page.title()).resolves.toEqual("Spreadsheet");

      } catch {
              console.error("can't access title");

      }
   
    
    
  });

  // it('should display 2 when "1 + 1 = " is clicked', async () => {
    
  // });
});
