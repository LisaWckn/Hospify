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
    const currentDate = new Date().toLocaleDateString('sv-SE');
    //Korrekter Query: SELECT * FROM Patient WHERE patientenID IN (SELECT patientenID FROM Aufenthalt WHERE startzeitpunkt < CURRENT_DATE AND (endzeitpunkt > CURRENT_DATE OR endzeitpunkt IS NULL))
    const query: string = 'SELECT * FROM PATIENT WHERE patientenID IN (SELECT patientenID FROM Aufenthalt WHERE startzeitpunkt < DATE \''+currentDate+'\' AND (endzeitpunkt > DATE \''+currentDate+'\' OR endzeitpunkt IS NULL))';
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
    let patientenID :number = await this.getMaxPatientID() as number;
    patientenID++;

    const dateString = patient.geburtsdatum.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});

    const query: string = 'INSERT INTO PATIENT (patientenID, plz, name, geschlecht, blutgruppe, geburtsdatum, adresse, kontakttelefon, verstorben, krankenversicherungsnummer, gewicht, krankenkassenstatus) ' +
      'VALUES ('+patientenID+', \''+patient.plz+'\', \''+patient.name+'\', \''+patient.geschlecht+'\', \''+patient.blutgruppe+'\', \''+dateString+'\',' +
      ' \''+patient.adresse+'\', \''+patient.kontakttelefon+'\', '+this.boolToInt(patient.verstorben)+', \''+patient.krankenversicherungsnummer+'\', '+patient.gewicht+', \''+patient.krankenkassenstatus+'\')';

    this.dataService.executeInsert(query).subscribe(
      result => {
        console.log('Rows Inserted:', result.rowsAffected);
      },
      error => {
        console.error('Error executing insert:', error);
      }
    );
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
