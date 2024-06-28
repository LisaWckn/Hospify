import {Injectable} from '@angular/core';
import {Patient} from "../models/patient";
import {DataService} from "./data.service";
import {Stay} from "../models/stay";
import {DiagnosticFindings} from "../models/diagnostic-findings";

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
    const query: string = 'SELECT * FROM Aufenthalt WHERE startzeitpunkt < DATE \'2024-01-14\' AND (endzeitpunkt > DATE \'2024-01-14\' OR endzeitpunkt IS NULL) AND patientenID = ' + patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return response.map((row: any[]) => ({
        aufenthaltID: row[0],
        patientenID: row[1],
        startzeitpunkt: row[2],
        endzeitpunkt: row[3]
      } as Stay));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }
}
