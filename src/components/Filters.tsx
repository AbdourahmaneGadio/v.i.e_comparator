import type { ChangeEvent } from "react";
import type { Translation } from "../i18n";
import type { Zone } from "../types";

interface FiltersProps {
  nameSearch: string;
  minimumIndemnity: string;
  maximumIndemnity: string;
  selectedZone: Zone | "";
  zones: readonly Zone[];
  translation: Translation;
  onNameChange: (value: string) => void;
  onMinimumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onMaximumChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onZoneChange: (value: Zone | "") => void;
  onReset: () => void;
}

function Filters({
  nameSearch,
  minimumIndemnity,
  maximumIndemnity,
  selectedZone,
  zones,
  translation,
  onNameChange,
  onMinimumChange,
  onMaximumChange,
  onZoneChange,
  onReset,
}: FiltersProps) {
  return (
    <section className="filters" aria-label={translation.countryFilters}>
      <label>
        {translation.countryName}
        <input
          type="search"
          value={nameSearch}
          placeholder={translation.countryPlaceholder}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>

      <label>
        {translation.zone}
        <select
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
