import type { Translation } from "../i18n";
import type { Country } from "../types";
import { getCountryRequirement } from "../data/countryRequirements";

interface CountryDetailsProps {
  country: Country;
  language: "en" | "fr";
  translation: Translation;
  getFlagCode: (countryName: string) => string;
  getCountryDisplayName: (countryName: string) => string;
  onClose: () => void;
}

function CountryDetails({ country, language, translation, getFlagCode, getCountryDisplayName, onClose }: CountryDetailsProps) {
  const requirement = getCountryRequirement(country.name);
  const displayName = requirement?.hasDetailedCriteria
    ? (language === "en" ? requirement.englishName : requirement.frenchName)
    : getCountryDisplayName(country.name);
  const destinationUrl = requirement
    ? (language === "fr" ? requirement.frenchUrl : requirement.englishUrl)
    : "https://mon-vie-via.businessfrance.fr";

  return (
    <section className="country-details" data-testid="country-details" aria-labelledby="country-details-title">
      <div className="country-details-heading">
        <div className="country-details-title">
          <img
            className="country-flag"
            src={`${import.meta.env.BASE_URL}flags/${getFlagCode(country.name)}.svg`}
            alt={translation.flagAlt(displayName)}
          />
          <div>
            <p className="eyebrow">{translation.countryDetails}</p>
            <h2 id="country-details-title">{displayName}</h2>
          </div>
        </div>
        <button type="button" className="close-details" aria-label={translation.closeDetails} onClick={onClose}>×</button>
      </div>

      <div className="country-details-content">
        <div className="country-requirements">
          {requirement?.hasDetailedCriteria ? (
            <>
              <h3>{translation.criteriaForApplying}</h3>
              <div className="criteria-group">
                <h4>{translation.criteriaImposedByCountry}</h4>
                <h5>{translation.nationalityCriteria.split(".")[0]}</h5>
                <p>{translation.nationalityCriteria}</p>
                <h5>{translation.degreeExperienceTitle}</h5>
                <p className="criteria-note">{translation.atLeastOneCriteria}</p>
                <div className="criteria-options" data-testid="criteria-options">
                  {translation.degreeExperienceCriteria.map((criterion, index) => (
                    <div className="criteria-option" data-testid="criteria-option" key={criterion}>
                      <span className="criteria-option-number">{index + 1}</span>
                      <p>{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>{translation.eligibilityTitle}</h3>
              <p>{requirement ? translation.eligibilityText : translation.countryDetailsUnavailable}</p>
              <h3>{translation.assignmentTitle}</h3>
              <p>{translation.assignmentText}</p>
            </>
          )}

          <a href={destinationUrl} target="_blank" rel="noreferrer">
            {translation.officialDestination} ↗
          </a>
        </div>
        {(requirement?.frenchImageUrl || requirement?.englishImageUrl) && (
          <img
            className="country-details-image"
            src={language === "en"
              ? requirement?.englishImageUrl ?? requirement?.frenchImageUrl
              : requirement?.frenchImageUrl ?? requirement?.englishImageUrl}
            alt={translation.countryImageAlt(displayName)}
          />
        )}
      </div>
    </section>
  );
}

export default CountryDetails;
