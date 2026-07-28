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

  it("shows localized country requirements after selecting China", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("language-toggle"));
    await user.type(screen.getByTestId("name-filter"), "CHINE");
    await user.click(screen.getByRole("button", { name: "CHINE (Hong-Kong)" }));

    expect(screen.getByTestId("country-details")).toHaveTextContent("Conditions par pays");
    expect(screen.getByText("Critères imposés par le pays")).toBeInTheDocument();
    expect(screen.getByText("Ressortissant de l’Espace Économique Européen, y compris Français.")).toBeInTheDocument();
    expect(screen.getByText(/Quelle que soit ma ville d’affectation/)).toBeInTheDocument();
    expect(screen.getByText("Au moins une de ces trois conditions doit être remplie.")).toBeInTheDocument();
    expect(screen.getAllByTestId("criteria-option")).toHaveLength(3);
    expect(screen.queryByText(/Ma situation ne correspond/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir la page officielle/ })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr/destinations/chine",
    );
    expect(screen.getByRole("img", { name: "Conditions d'affectation en Chine" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEKgyrh8WN-LVuKP_CHINEFR.png?auto=format,compress",
    );

    await user.click(screen.getByTestId("language-toggle"));

    expect(screen.getByText("Criteria imposed by country")).toBeInTheDocument();
    expect(screen.getByText("I am a national of the European Economic Area, including a French national.")).toBeInTheDocument();
    expect(screen.getByText(/Regardless of the city I’m assigned to/)).toBeInTheDocument();
    expect(screen.getByText("At least one of these three conditions must be met.")).toBeInTheDocument();
    expect(screen.getAllByTestId("criteria-option")).toHaveLength(3);
    expect(screen.queryByText(/My circumstances are not covered/)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View official/ })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr/en/destinations/china",
    );
    expect(screen.getByRole("img", { name: "China assignment conditions" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEKhE7h8WN-LVuKZ_CHINEEN.png?auto=format,compress",
    );

    await user.click(screen.getByRole("button", { name: "Close country requirements" }));
    expect(screen.queryByTestId("country-details")).not.toBeInTheDocument();
  });
});
