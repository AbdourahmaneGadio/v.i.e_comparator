import { describe, expect, it } from "vitest";
import {
  getCountryRequirement,
  hasCountryRequirements,
} from "./countryRequirements";

describe("Unit tests: country requirements", () => {
  it("loads the local French and English India requirement images", () => {
    const requirement = getCountryRequirement("INDE (Bangalore)");

    expect(requirement?.frenchImageUrl).toBe(
      "https://images.prismic.io/civiwebprod/aV6FLHNYClf9o3X6_INDEJanvier2026FR.png?auto=format,compress",
    );
    expect(requirement?.englishImageUrl).toBe(
      "https://images.prismic.io/civiwebprod/aV6FWXNYClf9o3YH_INDEJanv2026EN.png?auto=format,compress",
    );
  });

  it("marks only countries with specific application criteria as eligible", () => {
    expect(hasCountryRequirements("BENIN")).toBe(true);
    expect(hasCountryRequirements("AUTRICHE")).toBe(false);
    expect(hasCountryRequirements("ARGENTINE")).toBe(false);
  });

  it("resolves country variants to the same requirements", () => {
    expect(getCountryRequirement("CHINE (Hong-Kong)")?.englishUrl).toBe(
      "https://mon-vie-via.businessfrance.fr/en/destinations/china",
    );
    expect(getCountryRequirement("INDE (New Delhi)")?.frenchName).toBe("Inde");
  });
});
