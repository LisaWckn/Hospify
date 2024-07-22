export interface Patient {
  patientenID?: number;
  plz: string;
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
