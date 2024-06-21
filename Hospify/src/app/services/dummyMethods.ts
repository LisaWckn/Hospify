import {Patient} from "../models/patient";
import dummyData from "../services/dummyDatabase.json"
import {DiagnosticFindings} from "../models/diagnostic-findings";
import {Stay} from "../models/stay";
import {Abteilung} from "../models/abteilung";

export class DummyMethods {

  static emptyPatient: Patient = {patientenID: -1, name: "", geschlecht: "", blutgruppe: "", geburtsdatum: "", adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};

  static getAllPatients() : Array<Patient> {
    return dummyData.patients;
  }

  static getAllAlivePatients() : Array<Patient> {
    return dummyData.patients;
  }

  static getPatientByID(patientID: number) : Patient{
    let patient = dummyData.patients.find(p => p.patientenID == patientID);
    return patient != undefined ? patient : DummyMethods.emptyPatient;
  }

  static getAllDiagnosticFindingsByPatientID(patientID: number): DiagnosticFindings[] {
    return dummyData.befunde.slice(0, 3);
  }

  static getCurrentStayByPatientID(patientID: number) : Stay{
    return {aufenthaltID:0, patientenID: patientID, startzeitpunkt: new Date()};
  }

  static getAllDepartments() : Array<Abteilung>{
    return [{abteilungsID:0, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:1, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:2, fachrichtungsID: 0, quarantaene: true}]
  }
}
