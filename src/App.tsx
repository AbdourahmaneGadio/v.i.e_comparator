import { useMemo, useState, type ChangeEvent } from "react";
import countriesData from "./data/countries_v.i.e_data";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

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
  "CAIMANS": "ky",
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
} as const;

const getFlagCode = (countryName: string) =>
  flagCodeByCountry[countryName.split(" (")[0] as keyof typeof flagCodeByCountry] ?? "";

const zones = [
  "AFRIQUE DU NORD",
  "AFRIQUE SUBSAHARIENNE",
  "AMERIQUE DU NORD",
  "AMERIQUE LATINE",
  "ASIE",
  "EUROPE CENTRALE ET ORIENTALE",
  "EUROPE OCCIDENTALE",
  "MOYEN-ORIENT",
  "OCEANIE",
] as const;

type Zone = (typeof zones)[number];
type SortColumn = "name" | "zone" | "commonIndemnity" | "geographicIndemnity" | "monthlyPay";
type SortDirection = "ascending" | "descending";

const pageSize = 10;

const zoneByCountry: Record<string, Zone> = {
  AFGHANISTAN: "ASIE",
  "AFRIQUE DU SUD": "AFRIQUE SUBSAHARIENNE",
  ALBANIE: "EUROPE CENTRALE ET ORIENTALE",
  ALGERIE: "AFRIQUE DU NORD",
  ALLEMAGNE: "EUROPE OCCIDENTALE",
  ANDORRE: "EUROPE OCCIDENTALE",
  ANGOLA: "AFRIQUE SUBSAHARIENNE",
  "ANTIGUA-ET-BARBUDA": "AMERIQUE LATINE",
  "ARABIE SAOUDITE": "MOYEN-ORIENT",
  ARGENTINE: "AMERIQUE LATINE",
  ARMENIE: "EUROPE CENTRALE ET ORIENTALE",
  AUSTRALIE: "OCEANIE",
  AUTRICHE: "EUROPE OCCIDENTALE",
  AZERBAIDJAN: "EUROPE CENTRALE ET ORIENTALE",
  BAHREIN: "MOYEN-ORIENT",
  BANGLADESH: "ASIE",
  BARBADE: "AMERIQUE LATINE",
  BELGIQUE: "EUROPE OCCIDENTALE",
  BENIN: "AFRIQUE SUBSAHARIENNE",
  BIELORUSSIE: "EUROPE CENTRALE ET ORIENTALE",
  BIRMANIE: "ASIE",
  BOLIVIE: "AMERIQUE LATINE",
  "BOSNIE-HERZEGOVINE": "EUROPE CENTRALE ET ORIENTALE",
  BOTSWANA: "AFRIQUE SUBSAHARIENNE",
  BRESIL: "AMERIQUE LATINE",
  BRUNEI: "ASIE",
  BULGARIE: "EUROPE CENTRALE ET ORIENTALE",
  "BURKINA FASO": "AFRIQUE SUBSAHARIENNE",
  BURUNDI: "AFRIQUE SUBSAHARIENNE",
  CAIMANS: "AMERIQUE LATINE",
  CAMBODGE: "ASIE",
  CAMEROUN: "AFRIQUE SUBSAHARIENNE",
  CANADA: "AMERIQUE DU NORD",
  "CAP-VERT": "AFRIQUE SUBSAHARIENNE",
  CHILI: "AMERIQUE LATINE",
  CHINE: "ASIE",
  CHYPRE: "EUROPE CENTRALE ET ORIENTALE",
  COLOMBIE: "AMERIQUE LATINE",
  COMORES: "AFRIQUE SUBSAHARIENNE",
  CONGO: "AFRIQUE SUBSAHARIENNE",
  "CONGO RDC": "AFRIQUE SUBSAHARIENNE",
  "COREE DU SUD": "ASIE",
  "COSTA RICA": "AMERIQUE LATINE",
  "COTE D'IVOIRE": "AFRIQUE SUBSAHARIENNE",
  CROATIE: "EUROPE CENTRALE ET ORIENTALE",
  CUBA: "AMERIQUE LATINE",
  DANEMARK: "EUROPE OCCIDENTALE",
  DJIBOUTI: "AFRIQUE SUBSAHARIENNE",
  DOMINIQUE: "AMERIQUE LATINE",
  EGYPTE: "AFRIQUE DU NORD",
  "EMIRATS ARABES UNIS": "MOYEN-ORIENT",
  EQUATEUR: "AMERIQUE LATINE",
  ERYTHREE: "AFRIQUE SUBSAHARIENNE",
  ESPAGNE: "EUROPE OCCIDENTALE",
  ESTONIE: "EUROPE CENTRALE ET ORIENTALE",
  ESWATINI: "AFRIQUE SUBSAHARIENNE",
  "ETATS-UNIS": "AMERIQUE DU NORD",
  ETHIOPIE: "AFRIQUE SUBSAHARIENNE",
  FIDJI: "OCEANIE",
  FINLANDE: "EUROPE OCCIDENTALE",
  GABON: "AFRIQUE SUBSAHARIENNE",
  GAMBIE: "AFRIQUE SUBSAHARIENNE",
  GEORGIE: "EUROPE CENTRALE ET ORIENTALE",
  GHANA: "AFRIQUE SUBSAHARIENNE",
  GRECE: "EUROPE CENTRALE ET ORIENTALE",
  GRENADE: "AMERIQUE LATINE",
  GUATEMALA: "AMERIQUE LATINE",
  GUINEE: "AFRIQUE SUBSAHARIENNE",
  "GUINEE EQUATORIALE": "AFRIQUE SUBSAHARIENNE",
  "GUINEE-BISSAO": "AFRIQUE SUBSAHARIENNE",
  GUYANA: "AMERIQUE LATINE",
  HAITI: "AMERIQUE LATINE",
  HONDURAS: "AMERIQUE LATINE",
  HONGRIE: "EUROPE CENTRALE ET ORIENTALE",
  INDE: "ASIE",
  INDONESIE: "ASIE",
  IRAK: "MOYEN-ORIENT",
  IRAN: "MOYEN-ORIENT",
  IRLANDE: "EUROPE OCCIDENTALE",
  ISLANDE: "EUROPE OCCIDENTALE",
  ISRAEL: "MOYEN-ORIENT",
  ITALIE: "EUROPE OCCIDENTALE",
  JAMAIQUE: "AMERIQUE LATINE",
  JAPON: "ASIE",
  JERUSALEM: "MOYEN-ORIENT",
  JORDANIE: "MOYEN-ORIENT",
  KAZAKHSTAN: "ASIE",
  KENYA: "AFRIQUE SUBSAHARIENNE",
  KIRGHIZSTAN: "ASIE",
  KOSOVO: "EUROPE CENTRALE ET ORIENTALE",
  KOWEIT: "MOYEN-ORIENT",
  LAOS: "ASIE",
  LESOTHO: "AFRIQUE SUBSAHARIENNE",
  LETTONIE: "EUROPE CENTRALE ET ORIENTALE",
  LIBAN: "MOYEN-ORIENT",
  LIBERIA: "AFRIQUE SUBSAHARIENNE",
};

const getZone = (countryName: string) =>
  zoneByCountry[countryName.split(" (")[0]] ?? "ASIE";

function App() {
  const [nameSearch, setNameSearch] = useState("");
  const [minimumIndemnity, setMinimumIndemnity] = useState("");
  const [maximumIndemnity, setMaximumIndemnity] = useState("");
  const [selectedZone, setSelectedZone] = useState<Zone | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("ascending");

  const sortedCountries = useMemo(() => {
    const normalizedName = nameSearch.trim().toLocaleLowerCase();
    const minimum = minimumIndemnity === "" ? null : Number(minimumIndemnity);
    const maximum = maximumIndemnity === "" ? null : Number(maximumIndemnity);

    const filteredCountries = countriesData.filter((country) => {
      const matchesName = country.name.toLocaleLowerCase().includes(normalizedName);
      const matchesMinimum = minimum === null || country.monthlyPay >= minimum;
      const matchesMaximum = maximum === null || country.monthlyPay <= maximum;
      const matchesZone = selectedZone === "" || getZone(country.name) === selectedZone;

      return matchesName && matchesMinimum && matchesMaximum && matchesZone;
    });

    return [...filteredCountries].sort((firstCountry, secondCountry) => {
      const firstValue = sortColumn === "zone" ? getZone(firstCountry.name) : firstCountry[sortColumn];
      const secondValue = sortColumn === "zone" ? getZone(secondCountry.name) : secondCountry[sortColumn];
      const comparison = typeof firstValue === "string"
        ? firstValue.localeCompare(secondValue as string, "fr")
        : firstValue - (secondValue as number);

      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [maximumIndemnity, minimumIndemnity, nameSearch, selectedZone, sortColumn, sortDirection]);

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
    setSelectedZone("");
    setCurrentPage(1);
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">International mobility</p>
        <h1>V.I.E Comparator</h1>
        <p className="intro">Compare V.I.E. indemnities across countries.</p>
      </header>

      <section className="filters" aria-label="Country filters">
        <label>
          Country name
          <input
            type="search"
            value={nameSearch}
            placeholder="e.g. Allemagne"
            onChange={(event) => {
              setNameSearch(event.target.value);
              setCurrentPage(1);
            }}
          />
        </label>

        <label>
          Zone
          <select
            value={selectedZone}
            onChange={(event) => {
              setSelectedZone(event.target.value as Zone | "");
              setCurrentPage(1);
            }}
          >
            <option value="">All zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </label>

        <label>
          Minimum total indemnity (€)
          <input
            type="number"
            min="0"
            step="0.01"
            value={minimumIndemnity}
            placeholder="No minimum"
            onChange={(event) => handleNumberChange(setMinimumIndemnity, event)}
          />
        </label>

        <label>
          Maximum total indemnity (€)
          <input
            type="number"
            min="0"
            step="0.01"
            value={maximumIndemnity}
            placeholder="No maximum"
            onChange={(event) => handleNumberChange(setMaximumIndemnity, event)}
          />
        </label>

        <button type="button" className="reset-button" onClick={resetFilters}>
          Reset
        </button>
      </section>

      <section className="results" aria-live="polite">
        <div className="results-heading">
          <h2>Countries</h2>
          <span>{sortedCountries.length} result(s)</span>
        </div>

        {minimumIndemnity !== "" && maximumIndemnity !== "" &&
        Number(minimumIndemnity) > Number(maximumIndemnity) ? (
          <p className="empty-state">The minimum cannot be greater than the maximum.</p>
        ) : sortedCountries.length === 0 ? (
          <p className="empty-state">No countries match these filters.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Flag</th>
                  <th scope="col" aria-sort={sortColumn === "name" ? sortDirection : "none"}>
                    <button type="button" className="sort-button" onClick={() => handleSort("name")}>
                      Name {sortColumn === "name" && (sortDirection === "ascending" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortColumn === "zone" ? sortDirection : "none"}>
                    <button type="button" className="sort-button" onClick={() => handleSort("zone")}>
                      Zone {sortColumn === "zone" && (sortDirection === "ascending" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortColumn === "commonIndemnity" ? sortDirection : "none"}>
                    <button type="button" className="sort-button" onClick={() => handleSort("commonIndemnity")}>
                      Common indemnity {sortColumn === "commonIndemnity" && (sortDirection === "ascending" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortColumn === "geographicIndemnity" ? sortDirection : "none"}>
                    <button type="button" className="sort-button" onClick={() => handleSort("geographicIndemnity")}>
                      Geographic indemnity {sortColumn === "geographicIndemnity" && (sortDirection === "ascending" ? "↑" : "↓")}
                    </button>
                  </th>
                  <th scope="col" aria-sort={sortColumn === "monthlyPay" ? sortDirection : "none"}>
                    <button type="button" className="sort-button" onClick={() => handleSort("monthlyPay")}>
                      Total indemnity {sortColumn === "monthlyPay" && (sortDirection === "ascending" ? "↑" : "↓")}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleCountries.map((country) => (
                  <tr key={country.countryId}>
                    <td>
                      <img
                        className="country-flag"
                        src={`/flags/${getFlagCode(country.name)}.svg`}
                        alt={`${country.name} flag`}
                      />
                    </td>
                    <td>{country.name}</td>
                    <td>{getZone(country.name)}</td>
                    <td>{currencyFormatter.format(country.commonIndemnity)}</td>
                    <td>{currencyFormatter.format(country.geographicIndemnity)}</td>
                    <td className="total-cell">{currencyFormatter.format(country.monthlyPay)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <nav className="pagination" aria-label="Country table pages">
                <button
                  type="button"
                  className="page-button"
                  disabled={visiblePage === 1}
                  onClick={() => setCurrentPage((page) => page - 1)}
                >
                  Previous
                </button>
                <span>Page {visiblePage} of {totalPages}</span>
                <button
                  type="button"
                  className="page-button"
                  disabled={visiblePage === totalPages}
                  onClick={() => setCurrentPage((page) => page + 1)}
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
