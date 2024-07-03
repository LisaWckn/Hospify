import {Medikament} from "./medikament";

export interface Massnahme {
  massnahmenID: number;
  beschreibung: string;
  anzahl: number;
  zeitpunkt: Date;
  arztNoetig: boolean;
  medikamentID?: Medikament;
}
