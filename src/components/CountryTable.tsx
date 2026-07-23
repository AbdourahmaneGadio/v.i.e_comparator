import type { Country, SortColumn, SortDirection, Zone } from "../types";
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
      <button type="button" className="sort-button" onClick={() => onSort(column)}>
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
}: CountryTableProps) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th scope="col">Flag</th>
            <SortableHeader label="Name" column="name" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label="Zone" column="zone" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label="Common indemnity" column="commonIndemnity" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label="Geographic indemnity" column="geographicIndemnity" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
            <SortableHeader label="Total indemnity" column="monthlyPay" activeColumn={sortColumn} direction={sortDirection} onSort={onSort} />
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </div>
  );
}

export default CountryTable;
