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

const selectLanguage = async (user: ReturnType<typeof userEvent.setup>, language: "en" | "fr") => {
  await user.click(screen.getByTestId("language-selector"));
  await user.click(screen.getByTestId(`language-option-${language}`));
};

describe("Integration tests: V.I.E Comparator", () => {
  it("shows ten countries per page by default", () => {
    render(<App />);

    expect(getBodyRows()).toHaveLength(10);
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 of 24");
  });

  it("marks countries with JSON-backed application criteria", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "Benin");
    expect(within(screen.getByTestId("country-table")).getByText("YES")).toHaveClass("criteria-yes");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "Afghanistan");
    expect(within(screen.getByTestId("country-table")).getByText("NO")).toHaveClass("criteria-no");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "Argentina");
    expect(within(screen.getByTestId("country-table")).getByText("NO")).toHaveClass("criteria-no");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "Austria");
    expect(within(screen.getByTestId("country-table")).getByText("NO")).toHaveClass("criteria-no");
  });

  it("filters countries by application criteria status", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByTestId("criteria-filter"), "yes");
    expect(getCountryNames()).toContain("Benin");
    expect(getCountryNames()).not.toContain("Afghanistan");

    await user.selectOptions(screen.getByTestId("criteria-filter"), "no");
    expect(getCountryNames()).toContain("Afghanistan");
    expect(getCountryNames()).not.toContain("Benin");
  });

  it("filters countries by name and zone", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "Germany");
    expect(getCountryNames()).toContain("Germany (Berlin)");
    expect(getCountryNames()).not.toContain("Afghanistan");

    await user.clear(screen.getByTestId("name-filter"));
    await user.click(screen.getByTestId("zone-filter-summary"));
    await user.click(screen.getByTestId("zone-option-AFRIQUE DU NORD"));

    expect(getCountryNames()).toEqual(expect.arrayContaining([
      "Algeria (other cities)",
      "Egypt",
      "Tunisia",
    ]));
    expect(getCountryNames()).not.toContain("Germany (Berlin)");
  });

  it("filters countries by multiple zones", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("zone-filter-summary"));
    expect(screen.getByTestId("zone-option-AFRIQUE DU NORD")).toBeInTheDocument();
    expect(screen.getByTestId("zone-option-AMERIQUE DU NORD")).toBeInTheDocument();
    await user.click(screen.getByTestId("zone-option-AFRIQUE DU NORD"));
    await user.click(screen.getByTestId("zone-option-AMERIQUE DU NORD"));

    expect(screen.getByTestId("zone-filter-summary")).toHaveTextContent("North Africa, North America");
    expect(getCountryNames()).toEqual(expect.arrayContaining([
      "Algeria (other cities)",
      "Canada (Ottawa)",
      "Egypt",
    ]));
    expect(getCountryNames()).not.toContain("Germany (Berlin)");
  });

  it("sorts the table when a column header is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nameHeader = screen.getByTestId("sort-name");
    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("Zimbabwe");

    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("Afghanistan");
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByTestId("next-page"));

    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 2 of 24");
    expect(getFirstCountryName()).toBe("Australia (Sydney)");
  });

  it("translates country names and regional variants in English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "China");
    expect(getCountryNames()).toEqual(expect.arrayContaining([
      "China (Beijing)",
      "China (Hong Kong)",
      "China (Shanghai)",
      "China (Wuhan, Guangzhou)",
    ]));

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "Cayman");
    expect(getCountryNames()).toContain("Cayman Islands");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "United States");
    expect(getCountryNames()).toContain("United States (California)");
  });

  it("uses JSON requirements for countries beyond China", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "Germany");
    await user.click(screen.getByRole("button", { name: "Germany (Berlin)" }));

    expect(screen.getByRole("img", { name: /Germany \(Berlin\) assignment conditions/ })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEA_aLh8WN-LVlQ6_ALLEMAGNEEN.png?auto=format,compress",
    );
    expect(screen.getByRole("link", { name: /View official/ })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr/en/destinations/germany",
    );

    await selectLanguage(user, "fr");

    expect(screen.getByRole("link", { name: /Voir la page officielle/ })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr/destinations/allemagne",
    );
    expect(screen.getByRole("img", { name: /Conditions d'affectation en Allemagne/ })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEA8-rh8WN-LVlOi_ALLEMAGNEFR.png?auto=format,compress",
    );
  });

  it("uses the English requirement image for Benin", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId("name-filter"), "Benin");
    await user.click(screen.getByRole("button", { name: "Benin" }));

    expect(screen.getByRole("img", { name: "Benin assignment conditions" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEFWkbh8WN-LVokx_BENINEN.png?auto=format,compress",
    );

    await selectLanguage(user, "fr");

    expect(screen.getByRole("img", { name: "Conditions d'affectation en Bénin" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aEFVwrh8WN-LVokb_BENINFR.png?auto=format,compress",
    );
  });

  it("switches between English and French", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByTestId("language-selector")).toHaveTextContent("English");
    expect(screen.getByTestId("language-flag")).toHaveAttribute("src", "/flags/gb.svg");
    await user.click(screen.getByTestId("language-selector"));
    expect(screen.getByTestId("language-option-en")).toHaveAttribute("aria-selected", "true");
    expect(within(screen.getByTestId("language-option-fr")).getByRole("presentation", { hidden: true })).toHaveAttribute("src", "/flags/fr.svg");
    await user.click(screen.getByTestId("language-option-fr"));

    expect(screen.getByRole("heading", { name: "Comparateur V.I.E." })).toBeInTheDocument();
    expect(screen.getByLabelText("Nom du pays")).toBeInTheDocument();
    expect(screen.getByTestId("page-indicator")).toHaveTextContent("Page 1 sur 24");
    expect(screen.getByText("Source des données:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Business France" })).toHaveAttribute(
      "href",
      "https://mon-vie-via.businessfrance.fr",
    );
    expect(screen.getByTestId("language-selector")).toHaveTextContent("Français");
    expect(screen.getByTestId("language-selector")).toHaveAccessibleName("Langue");
    expect(screen.getByTestId("language-flag")).toHaveAttribute("src", "/flags/fr.svg");
  });

  it("toggles the dark theme accessibly", async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeSelector = screen.getByTestId("theme-selector");
    expect(themeSelector).toHaveValue("light");
    expect(screen.getByRole("main")).not.toHaveClass("dark-theme");

    await user.selectOptions(themeSelector, "dark");

    expect(themeSelector).toHaveValue("dark");
    expect(screen.getByRole("main")).toHaveClass("dark-theme");
    expect(themeSelector).toHaveAccessibleName("Theme");

    await user.selectOptions(themeSelector, "oled");
    expect(screen.getByRole("main")).toHaveClass("oled-theme");
    expect(themeSelector).toHaveValue("oled");
  });

  it("uses sentence case and accents for French country names", async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectLanguage(user, "fr");
    await user.type(screen.getByTestId("name-filter"), "CAP-VERT");
    expect(getCountryNames()).toContain("Cap-Vert");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "COREE DU SUD");
    expect(getCountryNames()).toContain("Corée du Sud");

    await user.clear(screen.getByTestId("name-filter"));
    await user.type(screen.getByTestId("name-filter"), "BRESIL");
    expect(getCountryNames()).toContain("Brésil (São Paulo)");
  });

  it("shows localized country requirements after selecting China", async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectLanguage(user, "fr");
    await user.type(screen.getByTestId("name-filter"), "CHINE");
    await user.click(screen.getByRole("button", { name: "Chine (Hong-Kong)" }));

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

    await selectLanguage(user, "en");

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
    expect(screen.getByRole("img", { name: "China assignment conditions" })).toHaveAttribute("tabindex", "0");

    await user.click(screen.getByRole("button", { name: "Close country requirements" }));
    expect(screen.queryByTestId("country-details")).not.toBeInTheDocument();
  });

  it("shows the French India requirements image", async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectLanguage(user, "fr");
    await user.type(screen.getByTestId("name-filter"), "INDE");
    await user.click(screen.getByRole("button", { name: "Inde (Bangalore)" }));

    expect(screen.getByRole("img", { name: "Conditions d'affectation en Inde (Bangalore)" })).toHaveAttribute(
      "src",
      "https://images.prismic.io/civiwebprod/aV6FLHNYClf9o3X6_INDEJanvier2026FR.png?auto=format,compress",
    );
  });
});
