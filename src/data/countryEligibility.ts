import type { CandidateNationality, DiplomaFilter } from "../types";

type DiplomaLevel = Exclude<DiplomaFilter, "all">;

interface CandidateProfile {
  nationality: CandidateNationality;
  diplomaLevel: DiplomaFilter;
  age: number | null;
  diplomaYear: number | null;
  experienceYears: number | null;
  currentYear: number;
}

interface CountryRule {
  nationalities?: Exclude<CandidateNationality, "all">[];
  minAge?: number;
  minDiplomaLevel?: DiplomaLevel;
  maxYearsSinceDiploma?: number;
  minExperienceYears?: number;
  maxExperienceYears?: number;
}

const diplomaLevelRank: Record<DiplomaLevel, number> = {
  bac: 1,
  bac_2: 2,
  bac_3: 3,
  bac_4: 4,
  bac_5: 5,
};

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[’']/g, " ")
  .toUpperCase()
  .trim();

const getCountryKey = (countryName: string) => normalize(countryName.split(" (")[0]);

const countryRules: Record<string, CountryRule[]> = {
  AUSTRALIE: [{ nationalities: ["french"] }],
  SUISSE: [{ nationalities: ["european"] }],
  INDE: [{ nationalities: ["european"], minDiplomaLevel: "bac_3", maxYearsSinceDiploma: 2 }],
  "ROYAUME-UNI": [{ nationalities: ["french", "european"], minDiplomaLevel: "bac_3" }],
  MADAGASCAR: [{ nationalities: ["european"] }],
  INDONESIE: [{ maxExperienceYears: 5 }],
  CHINE: [{ nationalities: ["french", "european"], minDiplomaLevel: "bac_4", minExperienceYears: 2 }],
  THAILANDE: [{ minAge: 22, minExperienceYears: 2 }],
  CANADA: [{ nationalities: ["french", "european"], minDiplomaLevel: "bac_2" }],
  MAROC: [{ nationalities: ["european"] }],
  "NOUVELLE-ZELANDE": [{ nationalities: ["european"] }],
  QATAR: [{ minDiplomaLevel: "bac_3" }],
  MALAISIE: [{ minExperienceYears: 3 }],
  KENYA: [{ nationalities: ["european"], minDiplomaLevel: "bac" }],
  JAPON: [{ minDiplomaLevel: "bac_3" }],
  "COREE DU SUD": [{ minDiplomaLevel: "bac_2" }],
  TURQUIE: [{ minDiplomaLevel: "bac" }],
};

const nationalityMatches = (profile: CandidateNationality, allowed?: CountryRule["nationalities"]) => {
  if (!allowed || profile === "all") {
    return true;
  }
  return allowed.includes(profile as Exclude<CandidateNationality, "all">);
};

const diplomaMatches = (profileLevel: DiplomaFilter, required?: DiplomaLevel) => {
  if (!required || profileLevel === "all") {
    return true;
  }
  return diplomaLevelRank[profileLevel as DiplomaLevel] >= diplomaLevelRank[required];
};

export const matchesCountryEligibility = (countryName: string, profile: CandidateProfile) => {
  const rules = countryRules[getCountryKey(countryName)];
  if (!rules) {
    return true;
  }

  return rules.some((rule) => {
    if (!nationalityMatches(profile.nationality, rule.nationalities)) {
      return false;
    }

    if (profile.age !== null && rule.minAge !== undefined && profile.age < rule.minAge) {
      return false;
    }

    if (!diplomaMatches(profile.diplomaLevel, rule.minDiplomaLevel)) {
      return false;
    }

    if (profile.diplomaYear !== null && rule.maxYearsSinceDiploma !== undefined) {
      const yearsSinceDiploma = profile.currentYear - profile.diplomaYear;
      if (yearsSinceDiploma > rule.maxYearsSinceDiploma) {
        return false;
      }
    }

    if (profile.experienceYears !== null && rule.minExperienceYears !== undefined && profile.experienceYears < rule.minExperienceYears) {
      return false;
    }

    if (profile.experienceYears !== null && rule.maxExperienceYears !== undefined && profile.experienceYears > rule.maxExperienceYears) {
      return false;
    }

    return true;
  });
};
