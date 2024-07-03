import {Injectable} from '@angular/core';
import {Patient} from "../models/patient";
import {DataService} from "./data.service";
import {Stay} from "../models/stay";
import {DiagnosticFindings} from "../models/diagnostic-findings";
import {Abteilung} from "../models/abteilung";
import {Ausstattung} from "../models/ausstattung";
import {Bett} from "../models/bett";
import {Behandlungsplan} from "../models/behandlungsplan";
import {Massnahme} from "../models/massnahme";
import {Behandlung} from "../models/behandlung";
import {Operation} from "../models/operation";
import {Mitarbeiter} from "../models/mitarbeiter";
import {Komplikation} from "../models/komplikation";
import {Fachrichtung} from "../models/fachrichtung";

@Injectable({
  providedIn: 'root'
})
export class SqlQueriesService {

  constructor(private dataService: DataService) {}

  async getAllPatients(): Promise<Patient[]> {
    const query: string = 'SELECT * FROM PATIENT';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        patientenID: row[0],
        plz: row[1],
        name: row[2],
        geschlecht: row[3],
        blutgruppe: row[4],
        geburtsdatum: new Date(row[5]),
        adresse: row[6],
        kontakttelefon: row[7],
        verstorben: row[8],
        krankenversicherungsnummer: row[9],
        gewicht: row[10],
        krankenkassenstatus: row[11]
      } as Patient));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllPresentPatients(): Promise<Patient[]> {
    //Korrekter Query: SELECT * FROM Patient WHERE patientenID IN (SELECT patientenID FROM Aufenthalt WHERE startzeitpunkt < CURRENT_DATE AND (endzeitpunkt > CURRENT_DATE OR endzeitpunkt IS NULL))
    const query: string = 'SELECT * FROM PATIENT WHERE patientenID IN (SELECT patientenID FROM Aufenthalt WHERE startzeitpunkt < DATE \'2024-01-14\' AND (endzeitpunkt > DATE \'2024-01-14\' OR endzeitpunkt IS NULL))';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        patientenID: row[0],
        plz: row[1],
        name: row[2],
        geschlecht: row[3],
        blutgruppe: row[4],
        geburtsdatum: new Date(row[5]),
        adresse: row[6],
        kontakttelefon: row[7],
        verstorben: row[8],
        krankenversicherungsnummer: row[9],
        gewicht: row[10],
        krankenkassenstatus: row[11]
      } as Patient));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getPatientByID(patientenID: number){
    const query: string = 'SELECT * FROM PATIENT WHERE patientenID=' + patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        patientenID: row[0],
        plz: row[1],
        name: row[2],
        geschlecht: row[3],
        blutgruppe: row[4],
        geburtsdatum: new Date(row[5]),
        adresse: row[6],
        kontakttelefon: row[7],
        verstorben: row[8],
        krankenversicherungsnummer: row[9],
        gewicht: row[10],
        krankenkassenstatus: row[11]
      } as Patient));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async insertPatient(patient: Patient){
    const query: string = 'INSERT INTO PATIENT (plz, name, geschlecht, blutgruppe, geburtsdatum, adresse, kontakttelefon, verstorben, krankenversicherungsnummer, gewicht, krankenkassenstatus) VALUES ('
                          + patient.plz + "," + patient.name + "," + patient.geschlecht + "," + patient.blutgruppe + "," + patient.geburtsdatum + "," + patient.adresse
                          + "," + patient.kontakttelefon + "," + patient.verstorben + "," + patient.krankenversicherungsnummer + "," + patient.gewicht + "," + patient.krankenkassenstatus + ')';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        patientenID: row[0],
        plz: row[1],
        name: row[2],
        geschlecht: row[3],
        blutgruppe: row[4],
        geburtsdatum: row[5],
        adresse: row[6],
        kontakttelefon: row[7],
        verstorben: row[8],
        krankenversicherungsnummer: row[9],
        gewicht: row[10],
        krankenkassenstatus: row[11]
      } as Patient));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllDiagnosticFindingsByPatientID(patientenID: number){
    const query: string = 'SELECT Befund.befundID, latName, beschreibung, chronisch FROM Befund JOIN untersuchungZuBefund ON Befund.befundID = untersuchungZuBefund.befundID JOIN Untersuchung ON untersuchungZuBefund.untersuchungsID = untersuchung.untersuchungsID WHERE patientenID=' + patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        befundID: row[0],
        latName: row[1],
        beschreibung: row[2],
        chronisch: row[3]
      } as DiagnosticFindings));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getCurrentStayByPatientID(patientenID: number){
    const query: string = 'SELECT * FROM Aufenthalt WHERE startzeitpunkt < DATE \'2024-01-15\' AND (endzeitpunkt > DATE \'2024-01-15\' OR endzeitpunkt IS NULL) AND patientenID = ' + patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        aufenthaltID: row[0],
        patientenID: row[1],
        startzeitpunkt: new Date(row[2])
      } as Stay));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async updateStay(aufenthaltID : number){
    //TODO
    let endzeitpunkt = new Date();
    const query: string = '';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response;
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllMassnahmen(){
    const query: string = 'SELECT * FROM MASSNAHME';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        massnahmenID: row[0],
        beschreibung: row[1],
        arztNoetig: row[2]
      } as Massnahme));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getCurrentBehandlungsplanElements(patientenID: number){
    let behandlungsplan : Behandlungsplan = (await this.getCurrentBehandlungsplan(patientenID))[0];

    const query: string = 'SELECT MASSNAHME.massnahmenID, MASSNAHME.beschreibung, behandlungsplanZuMassnahme.anzahl, behandlungsplanZuMassnahme.zeitpunkt, MASSNAHME.arztNoetig, massnahmeZuMedikament.medikamentID FROM MASSNAHME JOIN behandlungsplanZuMassnahme ON MASSNAHME.massnahmenID = behandlungsplanZuMassnahme.massnahmenID LEFT JOIN massnahmeZuMedikament ON MASSNAHME.massnahmenID = massnahmeZuMedikament.massnahmenID WHERE behandlungsplanZuMassnahme.behandlungsplanID='+behandlungsplan.behandlungsplanID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        massnahmenID: row[0],
        beschreibung: row[1],
        anzahl: row[2],
        zeitpunkt: new Date(row[3]),
        arztNoetig: row[4],
        medikamentID: row[5]
      } as Massnahme));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getCurrentBehandlungsplanElementsByTodayDate(patientenID: number){
    let behandlungsplan : Behandlungsplan = (await this.getCurrentBehandlungsplan(patientenID))[0];

    const query: string = 'SELECT MASSNAHME.massnahmenID, MASSNAHME.beschreibung, behandlungsplanZuMassnahme.anzahl, behandlungsplanZuMassnahme.zeitpunkt, MASSNAHME.arztNoetig, massnahmeZuMedikament.medikamentID FROM MASSNAHME JOIN behandlungsplanZuMassnahme ON MASSNAHME.massnahmenID = behandlungsplanZuMassnahme.massnahmenID LEFT JOIN massnahmeZuMedikament ON MASSNAHME.massnahmenID = massnahmeZuMedikament.massnahmenID WHERE behandlungsplanZuMassnahme.behandlungsplanID='+behandlungsplan.behandlungsplanID+' AND behandlungsplanZuMassnahme.zeitpunkt >= DATE \'2024-01-15\' AND behandlungsplanZuMassnahme.zeitpunkt < DATE \'2024-01-16\' ORDER BY behandlungsplanZuMassnahme.zeitpunkt ';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        massnahmenID: row[0],
        beschreibung: row[1],
        anzahl: row[2],
        zeitpunkt: new Date(row[3]),
        arztNoetig: row[4],
        medikamentID: row[5]
      } as Massnahme));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getMassnahmenByBehandlungsID(behandlungsID: number){
    const query: string = 'SELECT * FROM MASSNAHME JOIN behandlungZuMassnahme ON MASSNAHME.massnahmenID = behandlungZuMassnahme.massnahmenID WHERE behandlungZuMassnahme.behandlungsID='+behandlungsID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        massnahmenID: row[0],
        beschreibung: row[1],
        arztNoetig: row[2]
      } as Massnahme));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getCurrentBehandlungen(patientenID:number){
    let behandlungsplan : Behandlungsplan = (await this.getCurrentBehandlungsplan(patientenID))[0];
    let startzeit = behandlungsplan.startzeit.toLocaleDateString('sv-SE');
    let endzeit = behandlungsplan.endzeit?.toLocaleDateString('sv-SE');

    const query: string = 'SELECT * FROM BEHANDLUNG WHERE patientenID='+patientenID+' AND zeitpunkt>= DATE \''+startzeit+'\' AND zeitpunkt<= DATE \''+endzeit+'\'';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        behandlungsID: row[0],
        patientenID: row[1],
        zeitpunkt: new Date(row[2])
      } as Behandlung));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getTodayBehandlungen(patientenID:number){

    const query: string = 'SELECT * FROM BEHANDLUNG WHERE patientenID='+patientenID+' AND zeitpunkt>= DATE \'2024-01-15\' AND zeitpunkt<= DATE \'2024-01-16\' ';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        behandlungsID: row[0],
        patientenID: row[1],
        zeitpunkt: new Date(row[2])
      } as Behandlung));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getCurrentBehandlungsplan(patientenID: number){
    const query: string = 'SELECT * FROM BEHANDLUNGSPLAN WHERE startzeit < DATE \'2024-01-15\' AND patientenID='+patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        behandlungsplanID: row[0],
        patientenID: row[1],
        startzeit: new Date(row[2]),
        endzeit: new Date(row[3])
      } as Behandlungsplan));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async insertBehandlung(patientenID: number, massnahmen: Massnahme[]){
    //TODO
  }

  async getMitarbeiterByBehandlungsID(behandlungsID : number){
    const query: string = 'SELECT * FROM MITARBEITER JOIN behandlungZuMitarbeiter ON MITARBEITER.mitarbeiterID = behandlungZuMitarbeiter.mitarbeiterID WHERE behandlungZuMitarbeiter.behandlungsID='+behandlungsID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        mitarbeiterID: row[0],
        plz: row[1],
        sicherheitsstufe: row[2],
        name: row[3],
        telefonnummer: row[4],
        adresse: row[5],
        geburtsdatum: new Date(row[6]),
        krankenversicherungsnummer: row[7],
        vorgesetztenID: row[8],
        arztnummer: row[9],
        arztart: row[10]
      } as Mitarbeiter));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getMitarbeiterByOpID(opID : number){
    const query: string = 'SELECT * FROM MITARBEITER JOIN mitarbeiterZuOperation ON MITARBEITER.mitarbeiterID = mitarbeiterZuOperation.mitarbeiterID WHERE mitarbeiterZuOperation.opID='+opID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        mitarbeiterID: row[0],
        plz: row[1],
        sicherheitsstufe: row[2],
        name: row[3],
        telefonnummer: row[4],
        adresse: row[5],
        geburtsdatum: new Date(row[6]),
        krankenversicherungsnummer: row[7],
        vorgesetztenID: row[8],
        arztnummer: row[9],
        arztart: row[10]
      } as Mitarbeiter));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllOperationsByPatientID(patientenID: number){
    const query: string = 'SELECT * FROM OPERATION WHERE patientenID='+patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return response.map((row: any[]) => ({
        opID: row[0],
        patientenID: row[1],
        opSaalID: row[2],
        dringend: row[3],
        Ursache: row[4],
        startzeit: new Date(row[5]),
        endzeit: new Date(row[6])
      } as Operation));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllKomplikationenByOpID(opID: number){
    const query: string = 'SELECT * FROM KOMPLIKATION JOIN operationZuKomplikation ON operationZuKomplikation.komplikationsID = KOMPLIKATION.komplikationsID WHERE operationZuKomplikation.opID='+opID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return response.map((row: any[]) => ({
        komplikationsID: row[0],
        beschreibung: row[1],
        lebensbedrohlich: row[2]
      } as Komplikation));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getAllDepartments(){
    const query: string = 'SELECT * FROM abteilung';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return response.map((row: any[]) => ({
        abteilungsID: row[0],
        fachrichtungsID: row[1],
        quarantaene: row[2]
      } as Abteilung));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getFachrichtungByID(fachrichtungsID: number){
    const query: string = 'SELECT * FROM FACHRICHTUNG WHERE fachrichtungsID='+fachrichtungsID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return response.map((row: any[]) => ({
        fachrichtungsID: row[0],
        beschreibung: row[1]
      } as Fachrichtung));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async findBedConfigurations(ausstattung: Ausstattung) {
    const query: string = 'SELECT ausstattungsID FROM ausstattung WHERE beatmungsgeraet='+ausstattung.beatmungsgeraet+' AND iv_drip='+ausstattung.iv_drip+' AND herzmonitor='+ausstattung.herzmonitor+' AND extragross='+ausstattung.extragross;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response;
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async findFreeBed(abteilung: Abteilung, ausstattung: Ausstattung){
    let ausstattungsID = this.findBedConfigurations(ausstattung);
    const query: string = 'SELECT * FROM bett JOIN raum ON bett.raumID = raum.raumID JOIN abteilung ON abteilung.abteilungsID = raum.abteilungsID WHERE bett.ausstattungsID = '+ausstattungsID +' and abteilung.abteilungsID = '+abteilung.abteilungsID+' and einsatzbereit = 1';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        bettID: row[0],
        ausstattungsID: row[1],
        raumID: row[2],
        einsatzbereit: row[3]
      } as Bett));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }
}
