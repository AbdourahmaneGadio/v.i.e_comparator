import { useMemo, useState, type ChangeEvent } from "react";
import countriesData from "./data/countries_v.i.e_data";
import CountryTable from "./components/CountryTable";
import Filters from "./components/Filters";
import CountryDetails from "./components/CountryDetails";
import {
  getCountryRequirementEnglishName,
  getCountryRequirementFrenchName,
  hasCountryRequirements,
} from "./data/countryRequirements";
import { translations, type Language } from "./i18n";
import { ZONES, type CriteriaFilter, type SelectedZones, type SortColumn, type SortDirection, type Zone } from "./types";

const pageSize = 10;

const getCountryKey = (countryName: string) => countryName.split(" (")[0];

const flagCodeByCountry = {
  AFGHANISTAN: "af",
  "AFRIQUE DU SUD": "za",
  ALBANIE: "al",
  ALGERIE: "dz",
  ALLEMAGNE: "de",
  ANDORRE: "ad",
  ANGOLA: "ao",
  "ANTIGUA-ET-BARBUDA": "ag",
  "ARABIE SAOUDITE": "sa",
  ARGENTINE: "ar",
  ARMENIE: "am",
  AUSTRALIE: "au",
  AUTRICHE: "at",
  AZERBAIDJAN: "az",
  BAHREIN: "bh",
  BANGLADESH: "bd",
  BARBADE: "bb",
  BELGIQUE: "be",
  BENIN: "bj",
  BIELORUSSIE: "by",
  BIRMANIE: "mm",
  BOLIVIE: "bo",
  "BOSNIE-HERZEGOVINE": "ba",
  BOTSWANA: "bw",
  BRESIL: "br",
  BRUNEI: "bn",
  BULGARIE: "bg",
  "BURKINA FASO": "bf",
  BURUNDI: "bi",
  CAIMANS: "ky",
  CAMBODGE: "kh",
  CAMEROUN: "cm",
  CANADA: "ca",
  "CAP-VERT": "cv",
  CHILI: "cl",
  CHINE: "cn",
  CHYPRE: "cy",
  COLOMBIE: "co",
  COMORES: "km",
  CONGO: "cg",
  "CONGO RDC": "cd",
  "COREE DU SUD": "kr",
  "COSTA RICA": "cr",
  "COTE D’IVOIRE": "ci",
  "COTE D'IVOIRE": "ci",
  CROATIE: "hr",
  CUBA: "cu",
  DANEMARK: "dk",
  DJIBOUTI: "dj",
  DOMINIQUE: "dm",
  EGYPTE: "eg",
  "EMIRATS ARABES UNIS": "ae",
  EQUATEUR: "ec",
  ERYTHREE: "er",
  ESPAGNE: "es",
  ESTONIE: "ee",
  ESWATINI: "sz",
  "ETATS-UNIS": "us",
  ETHIOPIE: "et",
  FIDJI: "fj",
  FINLANDE: "fi",
  GABON: "ga",
  GAMBIE: "gm",
  GEORGIE: "ge",
  GHANA: "gh",
  GRECE: "gr",
  GRENADE: "gd",
  GUATEMALA: "gt",
  GUINEE: "gn",
  "GUINEE EQUATORIALE": "gq",
  "GUINEE-BISSAO": "gw",
  GUYANA: "gy",
  HAITI: "ht",
  HONDURAS: "hn",
  HONGRIE: "hu",
  INDE: "in",
  INDONESIE: "id",
  IRAK: "iq",
  IRAN: "ir",
  IRLANDE: "ie",
  ISLANDE: "is",
  ISRAEL: "il",
  ITALIE: "it",
  JAMAIQUE: "jm",
  JAPON: "jp",
  JERUSALEM: "il",
  JORDANIE: "jo",
  KAZAKHSTAN: "kz",
  KENYA: "ke",
  KIRGHIZSTAN: "kg",
  KOSOVO: "xk",
  KOWEIT: "kw",
  LAOS: "la",
  LESOTHO: "ls",
  LETTONIE: "lv",
  LIBAN: "lb",
  LIBERIA: "lr",
  LIBYE: "ly",
  LITUANIE: "lt",
  LUXEMBOURG: "lu",
  MACAO: "mo",
  MACEDOINE: "mk",
  MADAGASCAR: "mg",
  MALAISIE: "my",
  MALAWI: "mw",
  MALDIVES: "mv",
  MALI: "ml",
  MALTE: "mt",
  MAROC: "ma",
  MAURICE: "mu",
  MAURITANIE: "mr",
  MEXIQUE: "mx",
  MOLDAVIE: "md",
  MONACO: "mc",
  MONGOLIE: "mn",
  MONTENEGRO: "me",
  MOZAMBIQUE: "mz",
  NAMIBIE: "na",
  NEPAL: "np",
  NICARAGUA: "ni",
  NIGER: "ne",
  NIGERIA: "ng",
  NORVEGE: "no",
  "NOUVELLE-ZELANDE": "nz",
  OMAN: "om",
  OUGANDA: "ug",
  OUZBEKISTAN: "uz",
  PAKISTAN: "pk",
  PANAMA: "pa",
  "PAPOUASIE-NOUVELLE-GUINEE": "pg",
  PARAGUAY: "py",
  "PAYS-BAS": "nl",
  PEROU: "pe",
  PHILIPPINES: "ph",
  POLOGNE: "pl",
  PORTUGAL: "pt",
  QATAR: "qa",
  "REPUBLIQUE CENTRAFRICAINE": "cf",
  "REPUBLIQUE DOMINICAINE": "do",
  "REPUBLIQUE TCHEQUE": "cz",
  ROUMANIE: "ro",
  "ROYAUME-UNI": "gb",
  RUSSIE: "ru",
  RWANDA: "rw",
  "SAINT-CHRISTOPHE-ET-NIEVES": "kn",
  "SAINT-MARTIN": "mf",
  "SAINT-SIEGE": "va",
  "SAINT-VINCENT-ET-LES GRENADINES": "vc",
  "SAINTE-LUCIE": "lc",
  "SALOMON": "sb",
  SALVADOR: "sv",
  "SAO TOME-ET-PRINCIPE": "st",
  SENEGAL: "sn",
  SERBIE: "rs",
  SEYCHELLES: "sc",
  "SIERRA LEONE": "sl",
  SINGAPOUR: "sg",
  SLOVAQUIE: "sk",
  SLOVENIE: "si",
  SOMALIE: "so",
  SOUDAN: "sd",
  "SOUDAN DU SUD": "ss",
  "SRI LANKA": "lk",
  SUEDE: "se",
  SUISSE: "ch",
  SURINAME: "sr",
  SYRIE: "sy",
  TADJIKISTAN: "tj",
  TAIPEI: "tw",
  TANZANIE: "tz",
  TCHAD: "td",
  THAILANDE: "th",
  "TIMOR ORIENTAL": "tl",
  TOGO: "tg",
  "TRINITE-ET-TOBAGO": "tt",
  TUNISIE: "tn",
  TURKMENISTAN: "tm",
  TURQUIE: "tr",
  UKRAINE: "ua",
  URUGUAY: "uy",
  VANUATU: "vu",
  VENEZUELA: "ve",
  VIETNAM: "vn",
  YEMEN: "ye",
  ZAMBIE: "zm",
  ZIMBABWE: "zw",
} as const;

const getFlagCode = (countryName: string) =>
  flagCodeByCountry[getCountryKey(countryName) as keyof typeof flagCodeByCountry] ?? "";

const englishCountryNames = new Intl.DisplayNames(["en"], { type: "region" });
const frenchCountryNames = new Intl.DisplayNames(["fr"], { type: "region" });
const frenchCountryOverrides: Record<string, string> = {
  CAIMANS: "Îles Caïmans",
  CONGO: "Congo",
  "CONGO RDC": "République démocratique du Congo",
  JERUSALEM: "Jérusalem",
  SALOMON: "Îles Salomon",
  TAIPEI: "Taïwan",
};
const englishCountryOverrides: Record<string, string> = {
  CAIMANS: "Cayman Islands",
  JERUSALEM: "Jerusalem",
  MACAO: "Macao",
  SALOMON: "Solomon Islands",
  TAIPEI: "Taipei",
};
const englishLocationReplacements: [RegExp, string][] = [
  [/autres villes francophones/gi, "other French-speaking cities"],
  [/autres villes anglophones/gi, "other English-speaking cities"],
  [/autres villes/gi, "other cities"],
  [/Abou-Dhabi/g, "Abu Dhabi"],
  [/Californie/g, "California"],
  [/Caroline du Nord/g, "North Carolina"],
  [/Caroline du Sud/g, "South Carolina"],
  [/Bombay/g, "Mumbai"],
  [/Calcutta/g, "Kolkata"],
  [/Canton/g, "Guangzhou"],
  [/Edimbourg/g, "Edinburgh"],
  [/Etat de Washington/g, "State of Washington"],
  [/Etat de New York/g, "State of New York"],
  [/Genève/g, "Geneva"],
  [/Georgie/g, "Georgia"],
  [/Hambourg/g, "Hamburg"],
  [/Hawaï/g, "Hawaii"],
  [/Hong-Kong/g, "Hong Kong"],
  [/Izmir/g, "Izmir"],
  [/Louisiane/g, "Louisiana"],
  [/Londres/g, "London"],
  [/Nouveau-Mexique/g, "New Mexico"],
  [/Mexico/g, "Mexico City"],
  [/Moscou/g, "Moscow"],
  [/Pennsylvanie/g, "Pennsylvania"],
  [/Pékin/g, "Beijing"],
  [/Porto Rico/g, "Puerto Rico"],
  [/Saint-Pétersbourg/g, "Saint Petersburg"],
  [/Dakota du Nord/g, "North Dakota"],
  [/Dakota du Sud/g, "South Dakota"],
  [/Virginie Occidentale/g, "West Virginia"],
  [/Shanghai/g, "Shanghai"],
  [/Tokyo/g, "Tokyo"],
  [/Wuhan/g, "Wuhan"],
];

const getCountryDisplayName = (countryName: string, language: Language) => {
  const countryKey = getCountryKey(countryName);
  const countryCode = getFlagCode(countryName).toUpperCase();
  if (language === "fr") {
    const translatedCountry = frenchCountryOverrides[countryKey]
      ?? (countryCode === "" ? undefined : frenchCountryNames.of(countryCode))
      ?? getCountryRequirementFrenchName(countryName)
      ?? countryKey;
    const suffix = countryName.slice(countryKey.length);
    return `${translatedCountry}${suffix}`;
  }

  const translatedCountry = getCountryRequirementEnglishName(countryName)
    ?? englishCountryOverrides[countryKey]
    ?? (countryCode === "" ? countryKey : englishCountryNames.of(countryCode))
    ?? countryKey;

  if (englishCountryOverrides[countryKey] && (countryKey === "CAIMANS" || countryKey === "SALOMON")) {
    return translatedCountry;
  }

  const suffix = countryName.slice(countryKey.length);
  return englishLocationReplacements.reduce(
    (translatedSuffix, [pattern, replacement]) => translatedSuffix.replace(pattern, replacement),
    `${translatedCountry}${suffix}`,
  );
};

const countriesByZone: Record<Zone, readonly string[]> = {
  "AFRIQUE DU NORD": ["ALGERIE", "EGYPTE", "LIBYE", "MAROC", "MAURITANIE", "TUNISIE"],
  "AFRIQUE SUBSAHARIENNE": [
    "AFRIQUE DU SUD", "ANGOLA", "BENIN", "BOTSWANA", "BURKINA FASO", "BURUNDI", "CAMEROUN",
    "CAP-VERT", "COMORES", "CONGO", "CONGO RDC", "COTE D’IVOIRE", "DJIBOUTI", "ERYTHREE",
    "ESWATINI", "ETHIOPIE", "GABON", "GAMBIE", "GHANA", "GUINEE", "GUINEE EQUATORIALE",
    "GUINEE-BISSAO", "KENYA", "LESOTHO", "LIBERIA", "MADAGASCAR", "MALAWI", "MALI", "MAURICE",
    "MOZAMBIQUE", "NAMIBIE", "NIGER", "NIGERIA", "REPUBLIQUE CENTRAFRICAINE", "RWANDA",
    "SAO TOME-ET-PRINCIPE", "SENEGAL", "SEYCHELLES", "SIERRA LEONE", "SOMALIE", "SOUDAN",
    "SOUDAN DU SUD", "TANZANIE", "TCHAD", "TOGO", "OUGANDA", "ZAMBIE", "ZIMBABWE",
  ],
  "AMERIQUE DU NORD": ["CANADA", "ETATS-UNIS"],
  "AMERIQUE LATINE": [
    "ANTIGUA-ET-BARBUDA", "ARGENTINE", "BARBADE", "BOLIVIE", "BRESIL", "CAIMANS", "CHILI",
    "COLOMBIE", "COSTA RICA", "CUBA", "DOMINIQUE", "EQUATEUR", "GRENADE", "GUATEMALA", "GUYANA",
    "HAITI", "HONDURAS", "JAMAIQUE", "MEXIQUE", "NICARAGUA", "PANAMA", "PARAGUAY", "PEROU",
    "REPUBLIQUE DOMINICAINE", "SAINT-CHRISTOPHE-ET-NIEVES", "SAINT-VINCENT-ET-LES GRENADINES", "SAINTE-LUCIE",
    "SALVADOR", "SURINAME", "TRINITE-ET-TOBAGO", "URUGUAY", "VENEZUELA",
  ],
  "ASIE ET PACIFIQUE": [
    "AFGHANISTAN", "BANGLADESH", "BIRMANIE", "BRUNEI", "CAMBODGE", "CHINE", "INDE", "INDONESIE",
    "JAPON", "LAOS", "MACAO", "MALAISIE", "MALDIVES", "MONGOLIE", "NEPAL", "PAKISTAN", "PHILIPPINES",
    "SINGAPOUR", "SRI LANKA", "TAIPEI", "THAILANDE", "TIMOR ORIENTAL", "VIETNAM", "COREE DU SUD",
  ],
  "EUROPE CENTRALE ET ORIENTALE": [
    "ALBANIE", "ARMENIE", "AZERBAIDJAN", "BIELORUSSIE", "BOSNIE-HERZEGOVINE", "BULGARIE", "CHYPRE",
    "CROATIE", "ESTONIE", "GEORGIE", "GRECE", "HONGRIE", "KAZAKHSTAN", "KIRGHIZSTAN", "KOSOVO",
    "LETTONIE", "LITUANIE", "MACEDOINE", "MOLDAVIE", "MONTENEGRO", "OUZBEKISTAN", "POLOGNE",
    "REPUBLIQUE TCHEQUE", "ROUMANIE", "RUSSIE", "SERBIE", "SLOVAQUIE", "SLOVENIE", "TADJIKISTAN",
    "TURKMENISTAN", "UKRAINE",
  ],
  "EUROPE OCCIDENTALE": [
    "ALLEMAGNE", "ANDORRE", "AUTRICHE", "BELGIQUE", "DANEMARK", "FINLANDE", "ESPAGNE", "IRLANDE",
    "ISLANDE", "ITALIE", "LUXEMBOURG", "MALTE", "MONACO", "NORVEGE", "PAYS-BAS",
    "PORTUGAL", "ROYAUME-UNI", "SAINT-MARTIN", "SAINT-SIEGE", "SUEDE", "SUISSE",
  ],
  "PROCHE ET MOYEN-ORIENT": [
    "ARABIE SAOUDITE", "BAHREIN", "EMIRATS ARABES UNIS", "IRAK", "IRAN", "ISRAEL", "JERUSALEM",
    "JORDANIE", "KOWEIT", "LIBAN", "OMAN", "QATAR", "SYRIE", "TURQUIE", "YEMEN",
  ],
  OCEANIE: ["AUSTRALIE", "FIDJI", "NOUVELLE-ZELANDE", "PAPOUASIE-NOUVELLE-GUINEE", "SALOMON", "VANUATU"],
};

const zoneByCountry = Object.fromEntries(
  Object.entries(countriesByZone).flatMap(([zone, countries]) =>
    countries.map((country) => [country, zone]),
  ),
) as Record<string, Zone>;

const getZone = (countryName: string) =>
  zoneByCountry[getCountryKey(countryName)] ?? "ASIE ET PACIFIQUE";

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [nameSearch, setNameSearch] = useState("");
  const [minimumIndemnity, setMinimumIndemnity] = useState("");
  const [maximumIndemnity, setMaximumIndemnity] = useState("");
  const [selectedZones, setSelectedZones] = useState<SelectedZones>([]);
  const [criteriaFilter, setCriteriaFilter] = useState<CriteriaFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ascending");
  const [selectedCountry, setSelectedCountry] = useState<(typeof countriesData)[number] | null>(null);
  const translation = translations[language];

  const sortedCountries = useMemo(() => {
    const normalizedName = nameSearch.trim().toLocaleLowerCase();
    const minimum = minimumIndemnity === "" ? null : Number(minimumIndemnity);
    const maximum = maximumIndemnity === "" ? null : Number(maximumIndemnity);

    const filteredCountries = countriesData.filter((country) => {
      const displayName = getCountryDisplayName(country.name, language);
      const matchesName = country.name.toLocaleLowerCase().includes(normalizedName)
        || displayName.toLocaleLowerCase().includes(normalizedName);
      const matchesMinimum = minimum === null || country.monthlyPay >= minimum;
      const matchesMaximum = maximum === null || country.monthlyPay <= maximum;
      const matchesZone = selectedZones.length === 0 || selectedZones.includes(getZone(country.name));
      const matchesCriteria = criteriaFilter === "all"
        || (criteriaFilter === "yes" && hasCountryRequirements(country.name))
        || (criteriaFilter === "no" && !hasCountryRequirements(country.name));

      return matchesName && matchesMinimum && matchesMaximum && matchesZone && matchesCriteria;
    });

    return [...filteredCountries].sort((firstCountry, secondCountry) => {
      const firstValue = sortColumn === "zone"
        ? getZone(firstCountry.name)
        : sortColumn === "name" ? getCountryDisplayName(firstCountry.name, language) : firstCountry[sortColumn];
      const secondValue = sortColumn === "zone"
        ? getZone(secondCountry.name)
        : sortColumn === "name" ? getCountryDisplayName(secondCountry.name, language) : secondCountry[sortColumn];
      const comparison = typeof firstValue === "string"
        ? firstValue.localeCompare(secondValue as string, "fr")
        : firstValue - (secondValue as number);

      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [criteriaFilter, language, maximumIndemnity, minimumIndemnity, nameSearch, selectedZones, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedCountries.length / pageSize);
  const visiblePage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
  const visibleCountries = sortedCountries.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  const handleNumberChange = (
    setter: (value: string) => void,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setter(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((direction) =>
        direction === "ascending" ? "descending" : "ascending",
      );
    } else {
      setSortColumn(column);
      setSortDirection("ascending");
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setNameSearch("");
    setMinimumIndemnity("");
    setMaximumIndemnity("");
    setSelectedZones([]);
    setCriteriaFilter("all");
    setCurrentPage(1);
  };

  return (
    <main className="app-shell" lang={language}>
      <header className="page-header">
        <div className="header-row">
          <div>
            <p className="eyebrow">{translation.eyebrow}</p>
            <h1>{translation.title}</h1>
          </div>
          <button
            data-testid="language-toggle"
            type="button"
            className="language-toggle"
            aria-label={translation.switchLanguage}
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          >
            {translation.switchLanguage}
          </button>
        </div>
        <p className="intro">{translation.intro}</p>
      </header>

      <Filters
        nameSearch={nameSearch}
        minimumIndemnity={minimumIndemnity}
        maximumIndemnity={maximumIndemnity}
        selectedZones={selectedZones}
        criteriaFilter={criteriaFilter}
        zones={ZONES}
        translation={translation}
        onNameChange={(value) => {
          setNameSearch(value);
          setCurrentPage(1);
        }}
        onMinimumChange={(event) => handleNumberChange(setMinimumIndemnity, event)}
        onMaximumChange={(event) => handleNumberChange(setMaximumIndemnity, event)}
        onZoneChange={(value) => {
          setSelectedZones(value);
          setCurrentPage(1);
        }}
        onCriteriaFilterChange={(value) => {
          setCriteriaFilter(value);
          setCurrentPage(1);
        }}
        onReset={resetFilters}
      />

      <section className="results" aria-live="polite">
        <div className="results-heading">
          <h2>{translation.countries}</h2>
          <span>{translation.resultCount(sortedCountries.length)}</span>
        </div>

        {minimumIndemnity !== "" && maximumIndemnity !== "" &&
        Number(minimumIndemnity) > Number(maximumIndemnity) ? (
          <p className="empty-state">{translation.minimumError}</p>
        ) : sortedCountries.length === 0 ? (
          <p className="empty-state">{translation.noMatches}</p>
        ) : (
          <CountryTable
            countries={visibleCountries}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            totalPages={totalPages}
            currentPage={visiblePage}
            getFlagCode={getFlagCode}
            getCountryDisplayName={(countryName) => getCountryDisplayName(countryName, language)}
            hasCountryRequirements={hasCountryRequirements}
            getZone={getZone}
            onSort={handleSort}
            onPreviousPage={() => setCurrentPage((page) => page - 1)}
            onNextPage={() => setCurrentPage((page) => page + 1)}
            translation={translation}
            onCountrySelect={setSelectedCountry}
          />
        )}
      </section>

      {selectedCountry && (
        <CountryDetails
          country={selectedCountry}
          language={language}
          translation={translation}
          getFlagCode={getFlagCode}
          getCountryDisplayName={(countryName) => getCountryDisplayName(countryName, language)}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      <footer className="app-footer">
        <span>{translation.dataSource}:</span>
        <a
          href="https://mon-vie-via.businessfrance.fr"
          target="_blank"
          rel="noreferrer"
        >
          Business France
        </a>
        <span>· {translation.dataYear}</span>
      </footer>
    </main>
  );
}

export default App;
