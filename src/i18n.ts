import type { Zone } from "./types";

export type Language = "en" | "fr";

export interface Translation {
  languageName: string;
  darkTheme: string;
  oledTheme: string;
  lightTheme: string;
  themeSelection: string;
  languageSelection: string;
  eyebrow: string;
  title: string;
  intro: string;
  countryFilters: string;
  candidateProfileFilters: string;
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
  criteriaNeededToApply: string;
  criteriaYes: string;
  criteriaNo: string;
  allCriteriaStatuses: string;
  criteriaFilter: string;
  countryTablePages: string;
  first: string;
  previous: string;
  pageOf: (currentPage: number, totalPages: number) => string;
  next: string;
  last: string;
  dataSource: string;
  dataYear: string;
  countryDetails: string;
  closeDetails: string;
  eligibilityTitle: string;
  eligibilityText: string;
  assignmentTitle: string;
  assignmentText: string;
  criteriaForApplying: string;
  criteriaImposedByCountry: string;
  nationalityCriteria: string;
  degreeExperienceTitle: string;
  degreeExperienceCriteria: string[];
  atLeastOneCriteria: string;
  officialDestination: string;
  countryDetailsUnavailable: string;
  countryImageAlt: (country: string) => string;
  zones: Record<Zone, string>;
  allDiplomaStatuses: string;
  bacPlusUn: string;
  bacPlusDeux: string;
  bacPlusTrois: string;
  bacPlusQuatre: string;
  bacPlusCinq: string;
  diplomaFilter: string;
  candidateAge: string;
  candidateAgePlaceholder: string;
  candidateDiplomaYear: string;
  candidateDiplomaYearPlaceholder: string;
  candidateNationality: string;
  allNationalities: string;
  frenchNationality: string;
  europeanNationality: string;
  otherNationality: string;
  candidateExperienceYears: string;
  candidateExperienceYearsPlaceholder: string;
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
    darkTheme: "Dark theme",
    oledTheme: "OLED mode",
    lightTheme: "Light theme",
    themeSelection: "Theme",
    languageSelection: "Language",
    eyebrow: "International mobility",
    title: "V.I.E Comparator",
    intro: "Compare V.I.E. indemnities across countries.",
    countryFilters: "Country filters",
    candidateProfileFilters: "Candidate profile filters",
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
    criteriaNeededToApply: "Criterias needed to apply",
    criteriaYes: "YES",
    criteriaNo: "NO",
    allCriteriaStatuses: "All countries",
    criteriaFilter: "Application criteria",
    countryTablePages: "Country table pages",
    first: "First",
    previous: "Previous",
    pageOf: (currentPage, totalPages) => `Page ${currentPage} of ${totalPages}`,
    next: "Next",
    last: "Last",
    dataSource: "Data source",
    dataYear: "2025 data",
    countryDetails: "Country requirements",
    closeDetails: "Close country requirements",
    eligibilityTitle: "V.I.E. eligibility",
    eligibilityText: "You must meet the general eligibility requirements of the V.I.E. programme.",
    assignmentTitle: "Assignment conditions",
    assignmentText: "Check the country-specific assignment conditions before applying.",
    officialDestination: "View official Business France destination page",
    countryDetailsUnavailable: "Country-specific requirements are not available in this comparator yet.",
    criteriaForApplying: "Criteria for applying in China",
    criteriaImposedByCountry: "Criteria imposed by country",
    nationalityCriteria: "I am a national of the European Economic Area, including a French national.",
    degreeExperienceTitle: "My degree level and work experience",
    atLeastOneCriteria: "At least one of these three conditions must be met.",
    degreeExperienceCriteria: [
      "Regardless of the city I’m assigned to: I can provide my diploma equivalent to a Chinese four-year higher education qualification (Licence in France) or higher AND provide proof of two full years’ experience (excluding work placements and sandwich courses) since the date of my last qualification.",
      "If my city of assignment is Shanghai: I have obtained at least a master’s degree from a Chinese university or from one of the best international universities ranked by the National Bureau of Foreign Experts in China, with merit or distinction. AND I finished my studies less than two years ago. AND I have not been subject to any disciplinary action.",
      "If my city of assignment is Shanghai: I have at least a four-year higher education qualification from a university in the Shanghai region. AND I finished my studies less than one year ago.",
    ],
    countryImageAlt: (country) => `${country} assignment conditions`,
    zones: englishZones,
    diplomaFilter: "Last diploma obtained",
    candidateAge: "Candidate age",
    candidateAgePlaceholder: "e.g. 28",
    candidateDiplomaYear: "Year of diploma obtained",
    candidateDiplomaYearPlaceholder: "e.g. 2022",
    candidateNationality: "Nationality",
    allNationalities: "All nationalities",
    frenchNationality: "French",
    europeanNationality: "European",
    otherNationality: "Other",
    candidateExperienceYears: "Years of professional experience",
    candidateExperienceYearsPlaceholder: "e.g. 3",
    allDiplomaStatuses: "All",
    bacPlusUn: "Baccalaureate-level qualification",
    bacPlusDeux: "Two-year higher education qualification",
    bacPlusTrois: "Three-year higher education qualification",
    bacPlusQuatre: "Four-year higher education qualification",
    bacPlusCinq: "Master's degree",
  },
  fr: {
    languageName: "Français",
    darkTheme: "Thème sombre",
    oledTheme: "Mode OLED",
    lightTheme: "Thème clair",
    themeSelection: "Thème",
    languageSelection: "Langue",
    eyebrow: "Mobilité internationale",
    title: "Comparateur V.I.E.",
    intro: "Comparez les indemnités V.I.E. entre les pays.",
    countryFilters: "Filtres par pays",
    candidateProfileFilters: "Filtres du profil candidat",
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
    criteriaNeededToApply: "Critères nécessaires pour candidater",
    criteriaYes: "OUI",
    criteriaNo: "NON",
    allCriteriaStatuses: "Tous les pays",
    criteriaFilter: "Critères de candidature",
    countryTablePages: "Pages du tableau des pays",
    first: "Première",
    previous: "Précédent",
    pageOf: (currentPage, totalPages) => `Page ${currentPage} sur ${totalPages}`,
    next: "Suivant",
    last: "Dernière",
    dataSource: "Source des données",
    dataYear: "Données 2025",
    countryDetails: "Conditions par pays",
    closeDetails: "Fermer les conditions du pays",
    eligibilityTitle: "Éligibilité V.I.E.",
    eligibilityText: "Vous devez remplir les conditions générales d'éligibilité du programme V.I.E.",
    assignmentTitle: "Conditions d'affectation",
    assignmentText: "Consultez les conditions d'affectation propres au pays avant de candidater.",
    officialDestination: "Voir la page officielle de la destination Business France",
    countryDetailsUnavailable: "Les conditions propres à ce pays ne sont pas encore disponibles dans ce comparateur.",
    criteriaForApplying: "Critères pour candidater en Chine",
    criteriaImposedByCountry: "Critères imposés par le pays",
    nationalityCriteria: "Ressortissant de l’Espace Économique Européen, y compris Français.",
    degreeExperienceTitle: "Mon niveau de diplôme et mes expériences professionnelles",
    atLeastOneCriteria: "Au moins une de ces trois conditions doit être remplie.",
    degreeExperienceCriteria: [
      "Quelle que soit ma ville d’affectation : Je peux fournir mon diplôme équivalent à BAC+4 chinois (Licence en France) ou supérieur ET justifier de 2 années d’expérience complètes (hors stages et alternances) depuis la date de mon dernier diplôme.",
      "Si ma ville d’affectation est à Shanghai : J’ai obtenu au minimum un master d’une université chinoise ou de l’une des meilleures universités internationales classées par le Bureau National des Experts Etrangers en Chine, avec une mention Bien ou Très bien ET j’ai terminé mes études depuis moins de deux ans ET je n’ai fait l’objet d’aucune sanction disciplinaire.",
      "Si ma ville d’affectation est à Shanghai : Je suis diplômé, au minimum, d’un BAC+4 d’une université de la région de Shanghai ET j’ai terminé mes études depuis moins d’un an.",
    ],
    countryImageAlt: (country) => `Conditions d'affectation en ${country}`,
    zones: frenchZones,
    diplomaFilter: "Dernier diplôme obtenu",
    candidateAge: "Âge du candidat",
    candidateAgePlaceholder: "ex. 28",
    candidateDiplomaYear: "Année d’obtention du diplôme",
    candidateDiplomaYearPlaceholder: "ex. 2022",
    candidateNationality: "Nationalité",
    allNationalities: "Toutes les nationalités",
    frenchNationality: "Française",
    europeanNationality: "Européenne",
    otherNationality: "Autre",
    candidateExperienceYears: "Années d’expérience professionnelle",
    candidateExperienceYearsPlaceholder: "ex. 3",
    allDiplomaStatuses: "Tous",
    bacPlusUn: "Bac+1",
    bacPlusDeux: "Bac+2",
    bacPlusTrois: "Bac+3",
    bacPlusQuatre: "Bac+4",
    bacPlusCinq: "Bac+5",
  },
};
