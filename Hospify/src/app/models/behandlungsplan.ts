export interface Behandlungsplan{
  behandlungsplanID: number;
  patientenID: number;
  startzeit: Date;
  endzeit?: Date;
}
