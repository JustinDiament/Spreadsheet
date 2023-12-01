import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";
import { ErrorDisplays } from "../../models/cell-data-errors-enum";

// End to end tests for users typing data into cells and seeing the results
describe("cellDisplay component", () => {
  let browser: Browser;
  let page: Page;

  // Set up end to end testing
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-features=site-per-process",
      ],
      slowMo: 100,
    });
  });

  // Set up the browser window
  beforeEach(async () => {
    try {
      page = await browser.newPage();
      await page.goto("http://localhost:3000");
    } catch {
      console.error("failed before each");
    }
  });

  // Close the browser tab when a test is done
  afterEach(async () => {
    try {
      await page.close();
      page = null as any;
    } catch {
      console.error("failed after each");
    }
  });

  // Close the browser itself when all tests are done
  afterAll(async () => {
    try {
      await browser.close();
      browser = null as any;
    } catch {
      console.error("failed after all");
    }
  });

  // Test user typing text into a cell
  it("Type a string into a cell", async () => {
    // Click into a cell and then type in it
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("Hey");

    // Check that the cell A1 contains the typed text
    const displayValue: string = (await (
      await ((await page.$("#A1")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("Hey");
  });

  // Test the user typing a cell referencee into a cell
  it('Type a cell reference into a cell"', async () => {
    // Click into cells and type text and a reference into them
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("Bye");
    await ((await page.$("#B1")) as ElementHandle<Element>).click();
    await page.keyboard.type("REF(A1)");
    await ((await page.$("#A1")) as ElementHandle<Element>).click();

    // Check that the cell reference is displaying the referenced value
    const displayValue: string = (await (
      await ((await page.$("#B1")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("Bye");
  });

  // Test the user typing a SUM range expression into a cell
  it("Type a SUM into a cell", async () => {
    // Click into cells and type text and a SUM range expression into them
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("5");
    await ((await page.$("#B1")) as ElementHandle<Element>).click();
    await page.keyboard.type("6");
    await ((await page.$("#A2")) as ElementHandle<Element>).click();
    await page.keyboard.type("7");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();
    await page.keyboard.type("8");
    await ((await page.$("#A3")) as ElementHandle<Element>).click();
    await page.keyboard.type("SUM(A1..B2)");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();

    // Check that the range expression is displaying the computed value
    const displayValue: string = (await (
      await ((await page.$("#A3")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("26");
  });

  // Test the user typing an AVERAGE range expression into a cell
  it("Type an average into a cell", async () => {
    // Click into cells and type text and an AVERAGE range expression into them
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("5");
    await ((await page.$("#B1")) as ElementHandle<Element>).click();
    await page.keyboard.type("6");
    await ((await page.$("#A2")) as ElementHandle<Element>).click();
    await page.keyboard.type("7");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();
    await page.keyboard.type("8");
    await ((await page.$("#A3")) as ElementHandle<Element>).click();
    await page.keyboard.type("AVERAGE(A1..B2)");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();

    // Check that the range expression is displaying the computed value
    const displayValue: string = (await (
      await ((await page.$("#A3")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("6.5");
  });

  // Test the user typing a formula with other expressions as part of it into a cell
  it("Type a formula into a cell", async () => {
    // Click into cells and type text and a formula into them
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("5");
    await ((await page.$("#B1")) as ElementHandle<Element>).click();
    await page.keyboard.type("6");
    await ((await page.$("#A2")) as ElementHandle<Element>).click();
    await page.keyboard.type("7");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();
    await page.keyboard.type("8");
    await ((await page.$("#A3")) as ElementHandle<Element>).click();
    await page.keyboard.type("AVERAGE(A1..B2) * SUM(B1..B2) + 8");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();

    // Check that the formula is displaying the computed value
    const displayValue: string = (await (
      await ((await page.$("#A3")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("99");
  });

  // Test the user typing multiple expressions into a cell that are not part of a formula
  it("Type some back to back text into a cell", async () => {
    // Click into cells and type text and some expressions into them
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("5");
    await ((await page.$("#B1")) as ElementHandle<Element>).click();
    await page.keyboard.type("6");
    await ((await page.$("#A2")) as ElementHandle<Element>).click();
    await page.keyboard.type("7");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();
    await page.keyboard.type("8");
    await ((await page.$("#A3")) as ElementHandle<Element>).click();
    await page.keyboard.type("AVERAGE(A1..B2) SUM(B1..B2) 8");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();

    // Check that the cell with expressions in it displays the proper value
    const displayValue: string = (await (
      await ((await page.$("#A3")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("6.5 14 8");
  });

  // Test the user typing a string concatenation into a cell
  it("should concatenate strings", async () => {
    // Type some strings, a reference, and a string concatenation into cells
    await ((await page.$("#A1")) as ElementHandle<Element>).click();
    await page.keyboard.type("howdy");
    await ((await page.$("#A3")) as ElementHandle<Element>).click();
    await page.keyboard.type("REF(A1)+goodbye");
    await ((await page.$("#B2")) as ElementHandle<Element>).click();

    // Check that the string concatenation displays the proper value
    const displayValue: string = (await (
      await ((await page.$("#A3")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual("howdygoodbye");
  });

  // Test the user causing an invalid cell reference error
  it("should have a cell reference error", async () => {
    // Type some text into cells, including a malformed cell reference
    await ((await page.$("#D5")) as ElementHandle<Element>).click();
    await page.keyboard.type("howdy");
    await ((await page.$("#D6")) as ElementHandle<Element>).click();
    await page.keyboard.type("REF(D5");
    await ((await page.$("#D5")) as ElementHandle<Element>).click();

    // Check that the reference cell now displays the proper error
    const displayValue: string = (await (
      await ((await page.$("#D6")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual(ErrorDisplays.INVALID_CELL_REFERENCE);
  });

  // Test the user causing an invalid range expression error
  it("should have a range expression error", async () => {
    // Type some text into cells, including a malformed range expression
    await ((await page.$("#D5")) as ElementHandle<Element>).click();
    await page.keyboard.type("howdy");
    await ((await page.$("#D6")) as ElementHandle<Element>).click();
    await page.keyboard.type("SUM(A5..D5");
    await ((await page.$("#D5")) as ElementHandle<Element>).click();

    // Check that the range expression cell now displays the proper error
    const displayValue: string = (await (
      await ((await page.$("#D6")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual(ErrorDisplays.INVALID_RANGE_EXPR);
  });

  // Test the user causing an invalid formula error
  it("should have a formula error", async () => {
    // Type some text into cells, including a formula with an illegal term
    await ((await page.$("#D6")) as ElementHandle<Element>).click();
    await page.keyboard.type("1 / hi");
    await ((await page.$("#D5")) as ElementHandle<Element>).click();

    // Check that the formula cell now displays the proper error
    const displayValue: string = (await (
      await ((await page.$("#D6")) as ElementHandle<Element>).getProperty(
        "textContent"
      )
    ).jsonValue()) as string;
    expect(displayValue).toEqual(ErrorDisplays.INVALID_FORMULA);
  });
});
