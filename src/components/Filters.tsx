import type { ChangeEvent } from "react";
import type { Translation } from "../i18n";
import type { CriteriaFilter, SelectedZones, Zone } from "../types";

interface FiltersProps {
  nameSearch: string;
  minimumIndemnity: string;
  maximumIndemnity: string;
  selectedZones: SelectedZones;
  criteriaFilter: CriteriaFilter;
  zones: readonly Zone[];
  translation: Translation;
  onNameChange: (value: string) => void;
  onMinimumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMaximumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onZoneChange: (value: SelectedZones) => void;
  onCriteriaFilterChange: (value: CriteriaFilter) => void;
  onReset: () => void;
}

function Filters({
  nameSearch,
  minimumIndemnity,
  maximumIndemnity,
  selectedZones,
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
        <details
          className="zone-dropdown"
          data-testid="zone-filter"
        >
          <summary data-testid="zone-filter-summary">
            <span className="zone-filter-summary-text">
              {selectedZones.length === 0
                ? translation.allZones
                : selectedZones.map((zone) => translation.zones[zone]).join(", ")}
            </span>
          </summary>
          <div className="zone-options">
            <label>
              <input
                data-testid="zone-option-all"
                type="checkbox"
                checked={selectedZones.length === 0}
                onChange={() => onZoneChange([])}
              />
              {translation.allZones}
            </label>
            {zones.map((zone) => (
              <label key={zone}>
                <input
                  data-testid={`zone-option-${zone}`}
                  type="checkbox"
                  checked={selectedZones.includes(zone)}
                  onChange={(event) => onZoneChange(
                    event.target.checked
                      ? [...selectedZones, zone]
                      : selectedZones.filter((selectedZone) => selectedZone !== zone),
                  )}
                />
                {translation.zones[zone]}
              </label>
            ))}
          </div>
        </details>
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
