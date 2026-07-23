import type { ChangeEvent } from "react";
import type { Zone } from "../types";

interface FiltersProps {
  nameSearch: string;
  minimumIndemnity: string;
  maximumIndemnity: string;
  selectedZone: Zone | "";
  zones: readonly Zone[];
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
  onNameChange,
  onMinimumChange,
  onMaximumChange,
  onZoneChange,
  onReset,
}: FiltersProps) {
  return (
    <section className="filters" aria-label="Country filters">
      <label>
        Country name
        <input
          type="search"
          value={nameSearch}
          placeholder="e.g. Allemagne"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>

      <label>
        Zone
        <select
          value={selectedZone}
          onChange={(event) => onZoneChange(event.target.value as Zone | "")}
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
          onChange={onMinimumChange}
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
          onChange={onMaximumChange}
        />
      </label>

      <button type="button" className="reset-button" onClick={onReset}>
        Reset
      </button>
    </section>
  );
}

export default Filters;
