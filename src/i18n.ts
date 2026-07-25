import type { Zone } from "./types";

export type Language = "en" | "fr";

export interface Translation {
  languageName: string;
  switchLanguage: string;
  eyebrow: string;
  title: string;
  intro: string;
  countryFilters: string;
  countryName: string;
  countryPlaceholder: string;
  zone: string;
  allZones: string;
  minimumIndemnity: string;
  maximumIndemnity: string;
  noMinimum: string;
  noMaximum: string;
  reset: string;
  countries: string;
  resultCount: (count: number) => string;
  minimumError: string;
  noMatches: string;
  flag: string;
  flagAlt: (country: string) => string;
  name: string;
  commonIndemnity: string;
  geographicIndemnity: string;
  totalIndemnity: string;
  countryTablePages: string;
  previous: string;
  pageOf: (currentPage: number, totalPages: number) => string;
  next: string;
  zones: Record<Zone, string>;
}

const englishZones: Record<Zone, string> = {
  "AFRIQUE DU NORD": "North Africa",
  "AFRIQUE SUBSAHARIENNE": "Sub-Saharan Africa",
  "AMERIQUE DU NORD": "North America",
  "AMERIQUE LATINE": "Latin America",
  "ASIE ET PACIFIQUE": "Asia-Pacific",
  "EUROPE CENTRALE ET ORIENTALE": "Central and Eastern Europe",
  "EUROPE OCCIDENTALE": "Western Europe",
  "PROCHE ET MOYEN-ORIENT": "Near and Middle East",
  OCEANIE: "Oceania",
};

const frenchZones: Record<Zone, string> = {
  "AFRIQUE DU NORD": "Afrique du Nord",
  "AFRIQUE SUBSAHARIENNE": "Afrique subsaharienne",
  "AMERIQUE DU NORD": "Amérique du Nord",
  "AMERIQUE LATINE": "Amérique latine",
  "ASIE ET PACIFIQUE": "Asie et Pacifique",
  "EUROPE CENTRALE ET ORIENTALE": "Europe centrale et orientale",
  "EUROPE OCCIDENTALE": "Europe occidentale",
  "PROCHE ET MOYEN-ORIENT": "Proche et Moyen-Orient",
  OCEANIE: "Océanie",
};

export const translations: Record<Language, Translation> = {
  en: {
    languageName: "English",
    switchLanguage: "Français",
    eyebrow: "International mobility",
    title: "V.I.E Comparator",
    intro: "Compare V.I.E. indemnities across countries.",
    countryFilters: "Country filters",
    countryName: "Country name",
    countryPlaceholder: "e.g. Germany",
    zone: "Zone",
    allZones: "All zones",
    minimumIndemnity: "Minimum total indemnity (€)",
    maximumIndemnity: "Maximum total indemnity (€)",
    noMinimum: "No minimum",
    noMaximum: "No maximum",
    reset: "Reset",
    countries: "Countries",
    resultCount: (count) => `${count} result(s)`,
    minimumError: "The minimum cannot be greater than the maximum.",
    noMatches: "No countries match these filters.",
    flag: "Flag",
    flagAlt: (country) => `${country} flag`,
    name: "Name",
    commonIndemnity: "Common indemnity",
    geographicIndemnity: "Geographic indemnity",
    totalIndemnity: "Total indemnity",
    countryTablePages: "Country table pages",
    previous: "Previous",
    pageOf: (currentPage, totalPages) => `Page ${currentPage} of ${totalPages}`,
    next: "Next",
    zones: englishZones,
  },
  fr: {
    languageName: "Français",
    switchLanguage: "English",
    eyebrow: "Mobilité internationale",
    title: "Comparateur V.I.E.",
    intro: "Comparez les indemnités V.I.E. entre les pays.",
    countryFilters: "Filtres par pays",
    countryName: "Nom du pays",
    countryPlaceholder: "ex. Allemagne",
    zone: "Zone",
    allZones: "Toutes les zones",
    minimumIndemnity: "Indemnité totale minimale (€)",
    maximumIndemnity: "Indemnité totale maximale (€)",
    noMinimum: "Aucun minimum",
    noMaximum: "Aucun maximum",
    reset: "Réinitialiser",
    countries: "Pays",
    resultCount: (count) => `${count} résultat${count === 1 ? "" : "s"}`,
    minimumError: "Le minimum ne peut pas être supérieur au maximum.",
    noMatches: "Aucun pays ne correspond à ces filtres.",
    flag: "Drapeau",
    flagAlt: (country) => `Drapeau de ${country}`,
    name: "Nom",
    commonIndemnity: "Indemnité commune",
    geographicIndemnity: "Indemnité géographique",
    totalIndemnity: "Indemnité totale",
    countryTablePages: "Pages du tableau des pays",
    previous: "Précédent",
    pageOf: (currentPage, totalPages) => `Page ${currentPage} sur ${totalPages}`,
    next: "Suivant",
    zones: frenchZones,
  },
};
