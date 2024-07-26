import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {Patient} from "../../models/patient";

@Injectable({
  providedIn: 'root'
})
export class SqlPatientService {

  constructor(private dataService: DataService) { }

  /**
   * Holt alle Patienten aus der Datenbank.
   * @return - Ein Array von Patienten. Jeder Patient wird als `Patient`-Objekt gemappt.
   */
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

  /**
   * Holt alle aktuell anwesenden Patienten aus der Datenbank.
   * Ein Patient gilt als anwesend, wenn der Aufenthalt begonnen hat und entweder noch nicht beendet ist oder kein Enddatum hat.
   * @return - Ein Array von Patienten, die derzeit anwesend sind. Jeder Patient wird als `Patient`-Objekt gemappt.
   */
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

  /**
   * Holt einen Patienten anhand der Patienten-ID aus der Datenbank.
   * @param patientenID - Die ID des Patienten, der abgefragt werden soll.
   * @return - Ein Array mit einem einzelnen Patienten, der als `Patient`-Objekt gemappt wird.
   */
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

  /**
   * Holt die höchste Patienten-ID aus der Datenbank.
   * @return - Die höchste Patienten-ID.
   */
  async getMaxPatientID(){
    const query: string = 'SELECT MAX(patientenID) FROM PATIENT';
    try {
      return await this.dataService.executeQuery(query).toPromise();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Fügt einen neuen Patienten in die Datenbank ein.
   * @param patient - Das `Patient`-Objekt, das die Informationen des neuen Patienten enthält.
   */
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

  /**
   * Wandelt die Antwort der Datenbankabfrage in ein Array von `Patient`-Objekten um.
   * @param response - Die Antwort der Datenbankabfrage, die als Array von Zeilen vorliegt.
   * @return - Ein Array von `Patient`-Objekten, die die Zeilen der Antwort repräsentieren.
   */
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

  /**
   * Konvertiert einen boolean-Wert in eine Ganzzahl (1 für `true`, 0 für `false`).
   * @param bool - Der boolean-Wert, der konvertiert werden soll.
   * @return - Die Ganzzahl, die den boolean-Wert repräsentiert.
   */
  boolToInt(bool: boolean) : number {
    if(bool){
      return 1;
    }else {
      return 0;
    }
  }
}
