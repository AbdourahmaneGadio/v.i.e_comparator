import type { ChangeEvent } from "react";
import type { Translation } from "../i18n";
import type { CriteriaFilter, Zone } from "../types";

interface FiltersProps {
  nameSearch: string;
  minimumIndemnity: string;
  maximumIndemnity: string;
  selectedZone: Zone | "";
  criteriaFilter: CriteriaFilter;
  zones: readonly Zone[];
  translation: Translation;
  onNameChange: (value: string) => void;
  onMinimumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMaximumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onZoneChange: (value: Zone | "") => void;
  onCriteriaFilterChange: (value: CriteriaFilter) => void;
  onReset: () => void;
}

function Filters({
  nameSearch,
  minimumIndemnity,
  maximumIndemnity,
  selectedZone,
  criteriaFilter,
  zones,
  translation,
  onNameChange,
  onMinimumChange,
  onMaximumChange,
  onZoneChange,
  onCriteriaFilterChange,
  onReset,
}: FiltersProps) {
  return (
    <section className="filters" aria-label={translation.countryFilters}>
      <label>
        {translation.countryName}
        <input
          data-testid="name-filter"
          type="search"
          value={nameSearch}
          placeholder={translation.countryPlaceholder}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>

      <label>
        {translation.criteriaFilter}
        <select
          data-testid="criteria-filter"
          value={criteriaFilter}
          onChange={(event) => onCriteriaFilterChange(event.target.value as CriteriaFilter)}
        >
          <option value="all">{translation.allCriteriaStatuses}</option>
          <option value="yes">{translation.criteriaYes}</option>
          <option value="no">{translation.criteriaNo}</option>
        </select>
      </label>

      <label>
        {translation.zone}
        <select
          data-testid="zone-filter"
          value={selectedZone}
          onChange={(event) => onZoneChange(event.target.value as Zone | "")}
        >
          <option value="">{translation.allZones}</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>{translation.zones[zone]}</option>
          ))}
        </select>
      </label>

      <label>
        {translation.minimumIndemnity}
        <input
          type="number"
          min="0"
          step="0.01"
          value={minimumIndemnity}
          placeholder={translation.noMinimum}
          onChange={onMinimumChange}
        />
      </label>

      <label>
        {translation.maximumIndemnity}
        <input
          type="number"
          min="0"
          step="0.01"
          value={maximumIndemnity}
          placeholder={translation.noMaximum}
          onChange={onMaximumChange}
        />
      </label>

      <button type="button" className="reset-button" onClick={onReset}>
        {translation.reset}
      </button>
    </section>
  );
}

export default Filters;
