import { useMemo, useState, type ChangeEvent } from "react";
import countriesData from "./data/countries_v.i.e_data";
import CountryTable from "./components/CountryTable";
import Filters from "./components/Filters";
import CountryDetails from "./components/CountryDetails";
import {
  hasCountryRequirements,
} from "./data/countryRequirements";
import { getCountryDisplayName, getFlagCode, getZone } from "./data/countryMetadata";
import { translations, type Language } from "./i18n";
import { ZONES, type CriteriaFilter, type SelectedZones, type SortColumn, type SortDirection, type Theme } from "./types";

const pageSize = 10;

function App() {
  const currentYear = new Date().getFullYear();
  const [language, setLanguage] = useState<Language>("en");
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
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
    <main className={`app-shell${theme === "light" ? "" : ` ${theme}-theme`}`} lang={language}>
      <header className="page-header">
        <div className="header-row">
          <div>
            <p className="eyebrow">{translation.eyebrow}</p>
            <h1>{translation.title}</h1>
          </div>
          <div className="header-actions">
            <select
              data-testid="theme-selector"
              className="theme-selector"
              aria-label={translation.themeSelection}
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
            >
              <option value="light">☀ {translation.lightTheme}</option>
              <option value="dark">☾ {translation.darkTheme}</option>
              <option value="oled">◐ {translation.oledTheme}</option>
            </select>
            <div className="language-selector-wrapper">
              <button
                data-testid="language-selector"
                className="language-selector"
                type="button"
                aria-label={translation.languageSelection}
                aria-haspopup="listbox"
                aria-expanded={isLanguageMenuOpen}
                onClick={() => setIsLanguageMenuOpen((isOpen) => !isOpen)}
              >
                <img
                  data-testid="language-flag"
                  className="language-flag"
                  src={`${import.meta.env.BASE_URL}flags/${language === "en" ? "gb" : "fr"}.svg`}
                  alt=""
                  aria-hidden="true"
                />
                <span>{language === "en" ? "English" : "Français"}</span>
                <span aria-hidden="true">▾</span>
              </button>
              {isLanguageMenuOpen && (
                <div className="language-options" role="listbox" aria-label={translation.languageSelection}>
                  {(["en", "fr"] as const).map((option) => (
                    <button
                      key={option}
                      data-testid={`language-option-${option}`}
                      className="language-option"
                      type="button"
                      role="option"
                      aria-selected={language === option}
                      onClick={() => {
                        setLanguage(option);
                        setIsLanguageMenuOpen(false);
                      }}
                    >
                      <img
                        className="language-flag"
                        src={`${import.meta.env.BASE_URL}flags/${option === "en" ? "gb" : "fr"}.svg`}
                        alt=""
                        aria-hidden="true"
                      />
                      <span>{option === "en" ? "English" : "Français"}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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
        <span>· © Abdourahmane Gadio - {currentYear}</span>
      </footer>
    </main>
  );
}

export default App;
