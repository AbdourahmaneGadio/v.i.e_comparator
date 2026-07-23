import { expect, test } from "@playwright/test";

test.describe("V.I.E Comparator", () => {
  test("shows ten countries and pagination controls by default", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("tbody tr")).toHaveCount(10);
    await expect(page.getByText("Page 1 of 14")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  test("filters countries by name and zone", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("searchbox").fill("Allemagne");
    await expect(page.getByText("ALLEMAGNE (Berlin)")).toBeVisible();
    await expect(page.getByText("AFGHANISTAN")).not.toBeVisible();

    await page.getByRole("searchbox").fill("");
    await page.getByRole("combobox").selectOption("AFRIQUE DU NORD");
    await expect(page.getByText("ALGERIE (autres villes)")).toBeVisible();
    await expect(page.getByText("EGYPTE")).toBeVisible();
    await expect(page.getByText("ALLEMAGNE (Berlin)")).not.toBeVisible();
  });

  test("sorts countries and moves to the next page", async ({ page }) => {
    await page.goto("/");

    const firstCountry = page.locator("tbody tr").first().locator("td").nth(1);
    await expect(firstCountry).toHaveText("AFGHANISTAN");

    await page.getByRole("button", { name: /Name/ }).click();
    await expect(firstCountry).toHaveText("LIBERIA");

    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("Page 2 of 14")).toBeVisible();
  });
});
