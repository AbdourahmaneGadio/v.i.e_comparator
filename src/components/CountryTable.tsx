import type { Country, SortColumn, SortDirection, Zone } from "../types";
import type { Translation } from "../i18n";
import Pagination from "./Pagination";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

interface CountryTableProps {
  countries: Country[];
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  totalPages: number;
  currentPage: number;
  getFlagCode: (countryName: string) => string;
  getZone: (countryName: string) => Zone;
  onSort: (column: SortColumn) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  translation: Translation;
  onCountrySelect: (country: Country) => void;
}

interface SortableHeaderProps {
  label: string;
  column: SortColumn;
  activeColumn: SortColumn;
  direction: SortDirection;
  onSort: (column: SortColumn) => void;
}

function SortableHeader({ label, column, activeColumn, direction, onSort }: SortableHeaderProps) {
  const isActive = activeColumn === column;
  const indicator = isActive ? (direction === "ascending" ? "↑" : "↓") : "";

  return (
    <th scope="col" aria-sort={isActive ? direction : "none"}>
      <button
        data-testid={`sort-${column}`}
        type="button"
        className="sort-button"
        onClick={() => onSort(column)}
      >
        {label} {indicator}
      </button>
    </th>
  );
}

function CountryTable({
  countries,
  sortColumn,
  sortDirection,
  totalPages,
  currentPage,
  getFlagCode,
  getZone,
  onSort,
  onPreviousPage,
  onNextPage,
  translation,
  onCountrySelect,
}: CountryTableProps) {
  return (
    <div className="table-wrapper">
      <table data-testid="country-table">
        <thead>
          <tr>
            <th scope="col">{translation.flag}</th>
            <SortableHeader label={translation.name} column="name" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={translation.zone} column="zone" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={translation.commonIndemnity} column="commonIndemnity" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={translation.geographicIndemnity} column="geographicIndemnity" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label={translation.totalIndemnity} column="monthlyPay" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr data-testid="country-row" key={country.countryId}>
              <td>
                <img
                  className="country-flag"
                  src={`${import.meta.env.BASE_URL}flags/${getFlagCode(country.name)}.svg`}
                  alt={translation.flagAlt(country.name)}
                />
              </td>
              <td data-testid="country-name">
                <button className="country-link" type="button" onClick={() => onCountrySelect(country)}>
                  {country.name}
                </button>
              </td>
              <td>{translation.zones[getZone(country.name)]}</td>
              <td>{currencyFormatter.format(country.commonIndemnity)}</td>
              <td>{currencyFormatter.format(country.geographicIndemnity)}</td>
              <td className="total-cell">{currencyFormatter.format(country.monthlyPay)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
        translation={translation}
      />
    </div>
  );
}

export default CountryTable;
