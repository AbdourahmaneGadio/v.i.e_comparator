import requirementsDocument from "./countries_requirements.json";

interface RequirementText {
  type?: string;
  text?: string;
  url?: string;
}

interface RequirementSlice {
  slice_type?: string;
  primary?: {
    country?: {
      countryName?: string;
      countryNameEn?: string;
    };
    text?: RequirementText[];
  };
}

interface RequirementResult {
  uid: string;
  data: {
    name: string;
    body?: RequirementSlice[];
  };
  alternate_languages?: { uid?: string; lang?: string }[];
}

interface RequirementsDocument {
  results: RequirementResult[];
}

export interface CountryRequirement {
  frenchName: string;
  englishName: string;
  frenchUrl: string;
  englishUrl: string;
  frenchImageUrl: string | undefined;
  englishImageUrl: string | undefined;
}

const frenchRequirementImages: Record<string, string> = {
  inde: "https://images.prismic.io/civiwebprod/aV6FLHNYClf9o3X6_INDEJanvier2026FR.png?auto=format,compress",
};

const englishRequirementImages: Record<string, string> = {
  taiwan: "https://images.prismic.io/civiwebprod/AJ-FKUJfkFFFZfPf_TAIWANEN.png?auto=format,compress",
  suisse: "https://images.prismic.io/civiwebprod/aE_kErNJEFaPX--F_SUISSEEN.png?auto=format,compress",
  inde: "https://images.prismic.io/civiwebprod/aV6FWXNYClf9o3YH_INDEJanv2026EN.png?auto=format,compress",
  "royaume-uni": "https://images.prismic.io/civiwebprod/aXIg7QIvOtkhB0Nm_ROYAUME-UNI-Janv.2026-EN.png?auto=format,compress",
  madagascar: "https://images.prismic.io/civiwebprod/aEqDcbNJEFaPX45j_MADAGASCAREN.png?auto=format,compress",
  "etats-unis": "https://images.prismic.io/civiwebprod/aELlo7h8WN-LVvu7_ETATS-UNISEN.png?auto=format,compress",
  indonesie: "",
  "hong-kong": "https://images.prismic.io/civiwebprod/aEL_Yrh8WN-LVwaL_HONGKONGEN.png?auto=format,compress",
  chili: "https://images.prismic.io/civiwebprod/aEKc67h8WN-LVuIt_CHILIEN.png?auto=format,compress",
  cameroun: "https://images.prismic.io/civiwebprod/aEFeg7h8WN-LVorh_CAMEROUNEN.png?auto=format,compress",
  cambodge: "https://images.prismic.io/civiwebprod/aEFc2rh8WN-LVoqC_CAMBODGEEN.png?auto=format,compress",
  benin: "https://images.prismic.io/civiwebprod/aEFWkbh8WN-LVokx_BENINEN.png?auto=format,compress",
  bulgarie: "https://images.prismic.io/civiwebprod/aEFaU7h8WN-LVonr_BULGARIEEN.png?auto=format,compress",
  chine: "https://images.prismic.io/civiwebprod/aEKhE7h8WN-LVuKZ_CHINEEN.png?auto=format,compress",
  bresil: "https://images.prismic.io/civiwebprod/aEFX47h8WN-LVol7_BRESILEN.png?auto=format,compress",
  autriche: "https://images.prismic.io/civiwebprod/aEFTkrh8WN-LVoi-_AUTRICHEEN.png?auto=format,compress",
  senegal: "https://images.prismic.io/civiwebprod/aE_XoLNJEFaPX-1V_SENEGALEN.png?auto=format,compress",
  roumanie: "https://images.prismic.io/civiwebprod/aEwtfbNJEFaPX8t1_ROUMANIEEN.png?auto=format,compress",
  thailande: "https://images.prismic.io/civiwebprod/aE_nMLNJEFaPX-_y_THA%C3%8FLANDEEN.png?auto=format,compress",
  serbie: "https://images.prismic.io/civiwebprod/aE_Zs7NJEFaPX-2Z_SERBIEEN.png?auto=format,compress",
  suede: "https://images.prismic.io/civiwebprod/aE_grbNJEFaPX-7E_SUEDEEN.png?auto=format,compress",
  turquie: "https://images.prismic.io/civiwebprod/aE_pGbNJEFaPX_BL_TURQUIEEN.png?auto=format,compress",
  colombie: "https://images.prismic.io/civiwebprod/aEKjJbh8WN-LVuLB_COLOMBIEEN.png?auto=format,compress",
  danemark: "https://images.prismic.io/civiwebprod/aEKxXLh8WN-LVuWK_DANEMARKEN.png?auto=format,compress",
  espagne: "https://images.prismic.io/civiwebprod/aELjE7h8WN-LVvqt_ESPAGNEEN.png?auto=format,compress",
  ghana: "https://images.prismic.io/civiwebprod/aEL3Pbh8WN-LVwM9_GHANAEN.png?auto=format,compress",
  angola: "",
  canada: "https://images.prismic.io/civiwebprod/aEFiQrh8WN-LVowJ_CANADAEN.png?auto=format,compress",
  slovaquie: "https://images.prismic.io/civiwebprod/aE_df7NJEFaPX-4v_SLOVAQUIEEN.png?auto=format,compress",
  "republique-tcheque": "https://images.prismic.io/civiwebprod/aEwh4bNJEFaPX8jg_REPUBLIQUETCHEQUEEN.png?auto=format,compress",
  tunisie: "https://images.prismic.io/civiwebprod/aE_oArNJEFaPX_AR_TUNISIEEN.png?auto=format,compress",
  argentine: "https://images.prismic.io/civiwebprod/aEBH77h8WN-LVldR_ARGENTINEEN.png?auto=format,compress",
  singapour: "https://images.prismic.io/civiwebprod/aE_aqLNJEFaPX-3N_SINGAPOUREN.png?auto=format,compress",
  vietnam: "https://images.prismic.io/civiwebprod/aE_qRbNJEFaPX_CC_VIETNAMEN.png?auto=format,compress",
  belgique: "https://images.prismic.io/civiwebprod/aEqOnbNJEFaPX5Cq_BELGIQUEEN.png?auto=format,compress",
  israel: "https://images.prismic.io/civiwebprod/aEl4qLNJEFaPX3Zs_ISRAELEN.png?auto=format,compress",
  luxembourg: "https://images.prismic.io/civiwebprod/aEqCQbNJEFaPX443_LUXEMBOURGEN.png?auto=format,compress",
  panama: "https://images.prismic.io/civiwebprod/aEra9rNJEFaPX6GI_PANAMAEN.png?auto=format,compress",
  maroc: "https://images.prismic.io/civiwebprod/aEqOFbNJEFaPX5CV_MAROCEN.png?auto=format,compress",
  "nouvelle-zelande": "https://images.prismic.io/civiwebprod/aErY8rNJEFaPX6D5_NOUVELLEZELANDEEN.png?auto=format,compress",
  mexique: "https://images.prismic.io/civiwebprod/aEqkw7NJEFaPX5Uw_MEXIQUEEN.png?auto=format,compress",
  qatar: "https://images.prismic.io/civiwebprod/aEwf4bNJEFaPX8iX_QATAREN.png?auto=format,compress",
  malaisie: "https://images.prismic.io/civiwebprod/aEqFP7NJEFaPX47k_MALAISIEEN.png?auto=format,compress",
  norvege: "https://images.prismic.io/civiwebprod/aErVyLNJEFaPX6Ae_NORVEGEEN.png?auto=format,compress",
  kenya: "https://images.prismic.io/civiwebprod/aEmOoLNJEFaPX3rN_KENYAEN.png?auto=format,compress",
  portugal: "https://images.prismic.io/civiwebprod/aEvYibNJEFaPX722_PORTUGALEN.png?auto=format,compress",
  "pays-bas": "https://images.prismic.io/civiwebprod/aErc3bNJEFaPX6Lm_PAYS-BASEN.png?auto=format,compress",
  irlande: "https://images.prismic.io/civiwebprod/aElYPrNJEFaPX3Fe_IRLANDEEN.png?auto=format,compress",
  japon: "https://images.prismic.io/civiwebprod/aEl0xbNJEFaPX3XR_JAPONEN.png?auto=format,compress",
  italie: "https://images.prismic.io/civiwebprod/aElzWrNJEFaPX3Wo_ITALIEEN.png?auto=format,compress",
  hongrie: "https://images.prismic.io/civiwebprod/aEfjibh8WN-LV6uE_HONGRIEEN.png?auto=format,compress",
  "cote-divoire": "https://images.prismic.io/civiwebprod/aEKtYbh8WN-LVuRz_COTED%27IVOIREEN.png?auto=format,compress",
  congo: "https://images.prismic.io/civiwebprod/aEKoArh8WN-LVuOb_CONGOEN.png?auto=format,compress",
  finlande: "https://images.prismic.io/civiwebprod/aELpy7h8WN-LVv19_FINLANDEEN.png?auto=format,compress",
  "emirats-arabes-unis": "https://images.prismic.io/civiwebprod/aELhu7h8WN-LVvnr_EMIRATSARABESUNISEN.png?auto=format,compress",
  "coree-du-sud": "https://images.prismic.io/civiwebprod/aEKqabh8WN-LVuPy_COREEDUSUDEN.png?auto=format,compress",
  gabon: "https://images.prismic.io/civiwebprod/aEL1Krh8WN-LVwJ4_GABONEN.png?auto=format,compress",
  grece: "https://images.prismic.io/civiwebprod/aEL6urh8WN-LVwSg_GRECEEN.png?auto=format,compress",
  "ile-maurice": "https://images.prismic.io/civiwebprod/aEfk67h8WN-LV6u2_ILEMAURICEEN.png?auto=format,compress",
  australie: "https://images.prismic.io/civiwebprod/aEBOi7h8WN-LVlt3_AUSTRALIEEN.png?auto=format,compress",
  allemagne: "https://images.prismic.io/civiwebprod/aEA_aLh8WN-LVlQ6_ALLEMAGNEEN.png?auto=format,compress",
};

const document = requirementsDocument as RequirementsDocument;
const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[’']/g, " ")
  .toUpperCase()
  .trim();

const getCountryKey = (countryName: string) => normalize(countryName.split(" (")[0]);

const countryKeyAliases: Record<string, string> = {
  "ILE MAURICE": "MAURICE",
  "HONG KONG": "CHINE",
};

const getRequirementKey = (countryName: string) => {
  const key = getCountryKey(countryName);
  return countryKeyAliases[key] ?? key;
};

const getCountryData = (result: RequirementResult) =>
  result.data.body?.find((slice) => slice.slice_type === "offre_par_pays")?.primary?.country;

const getRequirementImage = (result: RequirementResult) => {
  const introduction = result.data.body?.find((slice) => slice.slice_type === "introduction");
  const text = introduction?.primary?.text ?? [];
  const vieHeadingIndex = text.findIndex((item) => item.text?.toLowerCase().includes("conditions pour partir en mission v.i.e"));
  const image = text.slice(Math.max(vieHeadingIndex, 0)).find((item) => item.type === "image" && item.url);
  return image?.url;
};

export const countryRequirements = new Map<string, CountryRequirement>();
const countriesWithCriteria = new Set([
  "AUSTRALIE",
  "BENIN",
  "CAMEROUN",
  "CANADA",
  "CHINE",
  "COLOMBIE",
  "CONGO",
  "COTE D IVOIRE",
  "GABON",
  "GHANA",
  "INDE",
  "INDONESIE",
  "JAPON",
  "KENYA",
  "MADAGASCAR",
  "MALAISIE",
  "MAURICE",
  "MAROC",
  "NOUVELLE-ZELANDE",
  "QATAR",
  "COREE DU SUD",
  "SUISSE",
  "THAILANDE",
  "TURQUIE",
  "ROYAUME-UNI",
  "ETATS-UNIS",
]);

for (const result of document.results) {
  const country = getCountryData(result);
  const key = country?.countryName ? normalize(country.countryName) : normalize(result.data.name);
  const englishName = country?.countryNameEn
    ?? result.alternate_languages?.find((language) => language.lang === "en-us")?.uid
    ?? result.data.name;
  const englishUid = result.alternate_languages?.find((language) => language.lang === "en-us")?.uid ?? result.uid;

  countryRequirements.set(key, {
    frenchName: result.data.name,
    englishName: englishName.toLocaleLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()),
    frenchUrl: `https://mon-vie-via.businessfrance.fr/destinations/${result.uid}`,
    englishUrl: `https://mon-vie-via.businessfrance.fr/en/destinations/${englishUid}`,
    frenchImageUrl: frenchRequirementImages[result.uid] ?? (() => {
      const image = getRequirementImage(result);
      return image && !/EN\.png/i.test(image) ? image : undefined;
    })(),
    englishImageUrl: englishRequirementImages[result.uid] || undefined,
  });
}

export const getCountryRequirement = (countryName: string) =>
  countryRequirements.get(getRequirementKey(countryName));

export const getCountryRequirementEnglishName = (countryName: string) =>
  getCountryRequirement(countryName)?.englishName;

export const getCountryRequirementFrenchName = (countryName: string) =>
  getCountryRequirement(countryName)?.frenchName;

export const hasCountryRequirements = (countryName: string) => {
  const requirement = getCountryRequirement(countryName);
  return requirement !== undefined && countriesWithCriteria.has(getRequirementKey(countryName));
};
