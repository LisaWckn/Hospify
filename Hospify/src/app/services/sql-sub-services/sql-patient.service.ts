import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {Patient} from "../../models/patient";

@Injectable({
  providedIn: 'root'
})
export class SqlPatientService {

  constructor(private dataService: DataService) { }

  async getAllPatients(): Promise<Patient[]> {
    const query: string = 'SELECT * FROM PATIENT';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return this.patientMapping(response);
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
      return this.patientMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getPatientByID(patientenID: number){
    const query: string = 'SELECT * FROM PATIENT WHERE patientenID=' + patientenID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return this.patientMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async getMaxPatientID(){
    const query: string = 'SELECT MAX(patientenID) FROM PATIENT';
    try {
      return await this.dataService.executeQuery(query).toPromise();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  async insertPatient(patient: Patient){
    const query: string = 'INSERT INTO PATIENT (patientenID, plz, name, geschlecht, blutgruppe, geburtsdatum, adresse, kontakttelefon, verstorben, krankenversicherungsnummer, gewicht, krankenkassenstatus) ' +
      'VALUES (:patientenID, :plz, :name, :geschlecht, :blutgruppe, :geburtsdatum, :adresse, :kontakttelefon, :verstorben, :krankenversicherungsnummer, :gewicht, :krankenkassenstatus)';

    const patientenID = await this.getMaxPatientID() +1;

    const params = {
      patientenID: patientenID,
      plz: patient.plz,
      name: patient.name,
      geschlecht: patient.geschlecht,
      blutgruppe: patient.blutgruppe,
      geburtsdatum: patient.geburtsdatum,
      kontakttelefon: patient.kontakttelefon,
      verstorben: this.boolToInt(patient.verstorben),
      krankenversicherungsnummer: patient.krankenversicherungsnummer,
      gewicht: patient.gewicht,
      krankenkassenstatus: patient.krankenkassenstatus
    };

    return this.dataService.executeInsert(query);
  }

  patientMapping(response: any){
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
  }

  boolToInt(bool: boolean) : number {
    if(bool){
      return 1;
    }else {
      return 0;
    }
  }
}
