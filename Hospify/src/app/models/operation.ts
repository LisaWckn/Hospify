export interface Operation{
  opID: number;
  patientenID: number;
  opSaalID: number;
  startzeit: Date;
  endzeit: Date;
  dringend: boolean;
  Ursache: string;
}
