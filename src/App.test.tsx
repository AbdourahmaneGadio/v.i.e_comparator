import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

const getBodyRows = () =>
  within(screen.getByTestId("country-table")).getAllByTestId("country-row");

const getFirstCountryName = () =>
  within(getBodyRows()[0]).getByTestId("country-name").textContent;

const getCountryNames = () =>
  screen.getAllByTestId("country-name").map((country) => country.textContent);

describe("V.I.E Comparator", () => {
  it("shows ten countries per page by default", () => {
    render(<App />);

    expect(getBodyRows()).toHaveLength(10);
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 24");
  });

  it("filters countries by name and zone", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "Allemagne");
    expect(getCountryNames()).toContain("ALLEMAGNE (Berlin)");
    expect(getCountryNames()).not.toContain("AFGHANISTAN");

    await user.clear(screen.getByTestId("name-filter"));
    await user.selectOptions(screen.getByTestId("zone-filter"), "AFRIQUE DU NORD");

    expect(getCountryNames()).toEqual(expect.arrayContaining([
      "ALGERIE (autres villes)",
      "EGYPTE",
      "TUNISIE",
    ]));
    expect(getCountryNames()).not.toContain("ALLEMAGNE (Berlin)");
  });

  it("sorts the table when a column header is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nameHeader = screen.getByTestId("sort-name");
    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("ZIMBABWE");

    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("AFGHANISTAN");
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("next-page"));

    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 2 of 24");
    expect(getFirstCountryName()).toBe("ANDORRE");
  });

  it("switches between English and French", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("language-toggle"));

    expect(screen.getByRole("heading", { name: "Comparateur V.I.E." })).toBeInTheDocument();
    expect(screen.getByLabelText("Nom du pays")).toBeInTheDocument();
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 sur 24");
    expect(screen.getByText("Source des données:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Business France" })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr",
    );
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
  });
});
