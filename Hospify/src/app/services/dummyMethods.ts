import {Patient} from "../models/patient";
import dummyData from "../services/dummyDatabase.json"
import {DiagnosticFindings} from "../models/diagnostic-findings";
import {Stay} from "../models/stay";
import {Abteilung} from "../models/abteilung";
import {Ausstattung} from "../models/ausstattung";
import {Bett} from "../models/bett";
import {Ort} from "../models/ort";

export class DummyMethods {

  static emptyPatient: Patient = {patientenID: -1, plz:0, name: "", geschlecht: "", blutgruppe: "", geburtsdatum: "", adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};

  static getAllPatients() : Array<Patient> {
    return [DummyMethods.emptyPatient];
  }

  static addPatient(patient: Patient): number {
    //TODO: Insert Patient and return generated id
    //Default return value is -1, if insert fails
    return -1;
  }

  static getCurrentStayByPatientID(patientID: number) : Stay{
    return {aufenthaltID:0, patientenID: patientID, startzeitpunkt: new Date()};
  }

  static getAllDepartments() : Array<Abteilung>{
    return [{abteilungsID:0, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:1, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:2, fachrichtungsID: 0, quarantaene: true}]
  }

  static findFreeBed(abteilung: Abteilung, ausstattung: Ausstattung) : Bett|undefined {
    return undefined;
  }

  static addStayForPatient(patientID: number){
    //TODO
  }

  static addBedForPatient(patientID: number, bettId: number){
    //TODO
  }

  static findPlace(plz: string): boolean {
    //Return true if Location exists, else return false
    return true;
  }

  static createPlace(ort: Ort) {
    //TODO insert Ort
  }

  static addPlaceToPatient(patientID: number, plz: string){
    //TODO
  }
}
