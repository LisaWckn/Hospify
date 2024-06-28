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
	Select * from PATIENT
    return dummyData.patients;
  }

  static getAllAlivePatients() : Array<Patient> {
	Select * from PATIENT where verstorben = 0
    return dummyData.patients;
  }

  static addPatient(patient: Patient): number {
    //TODO: Insert Patient and return generated id
    //Default return value is -1, if insert fails
	INSERT INTO PATIENT (plz, name, geschlecht, blutgruppe, geburtsdatum, adresse, kontakttelefon, verstorben, krankenversicherungsnummer, gewicht, krankenkassenstatus) VALUES (patient)
    return -1;
  }

  static getPatientByID(patientID: number) : Patient{
    let patient = dummyData.patients.find(p => p.patientenID == patientID);
	SELECT * FROM patient WHERE patientID = patientID
    return patient != undefined ? patient : DummyMethods.emptyPatient;
  }

  static getAllDiagnosticFindingsByPatientID(patientID: number): DiagnosticFindings[] {

	SELECT * FROM befund 
		JOIN untersuchungZuBefund ON untersuchungZuBefund.befundID = befund.BefundID 
		JOIN untersuchung ON untersuchung.untersuchungsID = untersuchungZuBefund.untersuchungsID
		WHERE patientID = patientID
	
    return dummyData.befunde.slice(0, 3);
  }

  static getCurrentStayByPatientID(patientID: number) : Stay{
	SELECT patient.patientID, Aufenthalt.endzeitpunkt FROM patient 
		JOIN Aufenthalt ON patientt.patientID = patient.patientID
		WHERE patientID = patientID and endzeitpunkt <= DATE
    return {aufenthaltID:0, patientenID: patientID, startzeitpunkt: new Date()};
  }

  static getAllDepartments() : Array<Abteilung>{
		SELECT * FROM abteilung
    return [{abteilungsID:0, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:1, fachrichtungsID: 0, quarantaene: true}, {abteilungsID:2, fachrichtungsID: 0, quarantaene: true}]
  }

  static findFreeBed(abteilung: Abteilung, ausstattung: Ausstattung) : Bett|undefined {
	SELECT * FROM bett 
		JOIN ausstattung ON bett.ausstattungsID = ausstattung.ausstattungsID
		JOIN raum ON bett.raumID = raum.raumID
		JOIN abteilung ON abteilung.abteilungsID = raum.abteilungsID 
		WHERE ausstattung.ausstattungsID = ausstattung.ausstattungsID and abteilung.abteilungsID = {abteilung.abteilungsID} and einsatzbereit = 1
    return undefined;
  }

  static addStayForPatient(patientID: number){
    //TODO
	INSERT INTO aufenthalt (patientenID,startzeitpunkt) VALUES (patientID, TODAY)
  }

  static addBedForPatient(patientID: number, bettId: number){
    //TODO
	INSERT INTO aufenthaltZuBett (bettID, aufenthaltID)VALUES (number, number)
  }

  static findPlace(plz: string): boolean {
    //Return true if Location exists, else return false
	SELECT ort FROM ORT WHERE plz = plz
    return true;
  }

  static createPlace(ort: Ort) {
    //TODO insert Ort
	  INSERT INTO ort (plz, ort) VALUES (plz, ort)
  }

  static addPlaceToPatient(patientID: number, plz: string){
	UPDATE patient 
		SET plz = plz
		WHERE patientenID = patientID
    //TODO
  }
}
