export interface Country {
  countryId: number;
  name: string;
  commonIndemnity: number;
  geographicIndemnity: number;
  monthlyPay: number;
}

export const ZONES = [
  "AFRIQUE DU NORD",
  "AFRIQUE SUBSAHARIENNE",
  "AMERIQUE DU NORD",
  "AMERIQUE LATINE",
  "ASIE ET PACIFIQUE",
  "EUROPE CENTRALE ET ORIENTALE",
  "EUROPE OCCIDENTALE",
  "PROCHE ET MOYEN-ORIENT",
  "OCEANIE",
] as const;

export type Zone = (typeof ZONES)[number];
export type SelectedZones = Zone[];

export type SortColumn =
  | "name"
  | "zone"
  | "commonIndemnity"
  | "geographicIndemnity"
  | "monthlyPay";

export type SortDirection = "ascending" | "descending";

export type CriteriaFilter = "all" | "yes" | "no";
export type Theme = "light" | "dark" | "oled";
