import { expect, test } from "@playwright/test";

test.describe("End-to-end smoke tests", () => {
  test("loads the comparator with countries and core controls", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "V.I.E Comparator" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Country name" })).toBeVisible();
    await expect(page.locator("tbody tr")).toHaveCount(10);
    await expect(page.getByText("Page 1 of 24")).toBeVisible();
  });
});

test.describe("End-to-end filtering", () => {
  test("shows ten countries and pagination controls by default", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("tbody tr")).toHaveCount(10);
    await expect(page.getByText("Page 1 of 24")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  test("filters countries by name and zone", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("searchbox").fill("Allemagne");
    await expect(page.getByText("Germany (Berlin)")).toBeVisible();
    await expect(page.getByText("Afghanistan")).not.toBeVisible();

    await page.getByRole("searchbox").fill("");
    await page.getByTestId("zone-filter").selectOption("AFRIQUE DU NORD");
    await expect(page.getByText("Algeria (other cities)")).toBeVisible();
    await expect(page.getByText("Egypt")).toBeVisible();
    await expect(page.getByText("Germany (Berlin)")).not.toBeVisible();
  });
});

test.describe("End-to-end sorting and pagination", () => {
  test("sorts countries and moves to the next page", async ({ page }) => {
    await page.goto("/");

    const firstCountry = page.locator("tbody tr").first().locator("td").nth(1);
    await expect(firstCountry).toHaveText("Afghanistan");

    await page.getByRole("button", { name: /Name/ }).click();
    await expect(firstCountry).toHaveText("Zimbabwe");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Page 2 of 24")).toBeVisible();
  });
});
