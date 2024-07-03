export interface Patient {
  patientenID?: number;
  plz: number;
  name: string;
  geschlecht: string;
  blutgruppe: string;
  geburtsdatum: Date;
  adresse: string;
  kontakttelefon: string;
  verstorben: boolean;
  krankenversicherungsnummer: string;
  gewicht: number;
  krankenkassenstatus: string;
}
