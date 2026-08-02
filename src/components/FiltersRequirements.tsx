import type { Translation } from "../i18n";
import type { CandidateNationality, DiplomaFilter } from "../types";

interface FiltersRequirementsProps {
  diplomaFilter: DiplomaFilter;
  candidateAge: string;
  candidateDiplomaYear: string;
  candidateNationality: CandidateNationality;
  candidateExperienceYears: string;
  translation: Translation;
  onDiplomaFilterChange: (diplomaFilter: DiplomaFilter) => void;
  onCandidateAgeChange: (value: string) => void;
  onCandidateDiplomaYearChange: (value: string) => void;
  onCandidateNationalityChange: (value: CandidateNationality) => void;
  onCandidateExperienceYearsChange: (value: string) => void;
  onReset: () => void;
}

function FiltersRequirements({
  diplomaFilter,
  candidateAge,
  candidateDiplomaYear,
  candidateNationality,
  candidateExperienceYears,
  translation,
  onDiplomaFilterChange,
  onCandidateAgeChange,
  onCandidateDiplomaYearChange,
  onCandidateNationalityChange,
  onCandidateExperienceYearsChange,
  onReset,
}: FiltersRequirementsProps) {
  return (
    <section className="filters" aria-label={translation.candidateProfileFilters}>
      <label>
        {translation.candidateAge}
        <input
          data-testid="candidate-age-filter"
          type="number"
          min="0"
          value={candidateAge}
          placeholder={translation.candidateAgePlaceholder}
          onChange={(event) => onCandidateAgeChange(event.target.value)}
        />
      </label>

      <label>
        {translation.diplomaFilter}
        <select
          data-testid="diploma-filter"
          value={diplomaFilter}
          onChange={(event) => onDiplomaFilterChange(event.target.value as DiplomaFilter)}
        >
          <option value="all">{translation.allDiplomaStatuses}</option>
          <option value="bac">{translation.bacPlusUn}</option>
          <option value="bac_2">{translation.bacPlusDeux}</option>
          <option value="bac_3">{translation.bacPlusTrois}</option>
          <option value="bac_4">{translation.bacPlusQuatre}</option>
          <option value="bac_5">{translation.bacPlusCinq}</option>
        </select>
      </label>

      <label>
        {translation.candidateDiplomaYear}
        <input
          data-testid="candidate-diploma-year-filter"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={candidateDiplomaYear}
          placeholder={translation.candidateDiplomaYearPlaceholder}
          onChange={(event) => onCandidateDiplomaYearChange(event.target.value)}
        />
      </label>

      <label>
        {translation.candidateNationality}
        <select
          data-testid="candidate-nationality-filter"
          value={candidateNationality}
          onChange={(event) => onCandidateNationalityChange(event.target.value as CandidateNationality)}
        >
          <option value="all">{translation.allNationalities}</option>
          <option value="french">{translation.frenchNationality}</option>
          <option value="european">{translation.europeanNationality}</option>
          <option value="other">{translation.otherNationality}</option>
        </select>
      </label>

      <label>
        {translation.candidateExperienceYears}
        <input
          data-testid="candidate-experience-years-filter"
          type="number"
          min="0"
          step="1"
          value={candidateExperienceYears}
          placeholder={translation.candidateExperienceYearsPlaceholder}
          onChange={(event) => onCandidateExperienceYearsChange(event.target.value)}
        />
      </label>

      <button type="button" className="reset-button" onClick={onReset}>
        {translation.reset}
      </button>
    </section>
  );
}

export default FiltersRequirements;
