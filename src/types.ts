export interface Country {
  countryId: number;
  name: string;
  commonIndemnity: number;
  geographicIndemnity: number;
  monthlyPay: number;
}

export type Zone =
  | "AFRIQUE DU NORD"
  | "AFRIQUE SUBSAHARIENNE"
  | "AMERIQUE DU NORD"
  | "AMERIQUE LATINE"
  | "ASIE"
  | "EUROPE CENTRALE ET ORIENTALE"
  | "EUROPE OCCIDENTALE"
  | "MOYEN-ORIENT"
  | "OCEANIE";

export type SortColumn =
  | "name"
  | "zone"
  | "commonIndemnity"
  | "geographicIndemnity"
  | "monthlyPay";

export type SortDirection = "ascending" | "descending";
