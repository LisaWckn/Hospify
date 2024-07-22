export interface Mitarbeiter{
  mitarbeiterID: number;
  plz: string;
  sicherheitsstufe: number;
  name: string;
  telefonnummer: string;
  adresse: string;
  geburtsdatum: Date;
  krankenversicherungsnummer: string;
  vorgesetztenID: number;
  arztnummer: number;
  arztart: string;
}
