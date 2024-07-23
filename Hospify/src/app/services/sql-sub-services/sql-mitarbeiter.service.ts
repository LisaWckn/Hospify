import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {Mitarbeiter} from "../../models/mitarbeiter";

@Injectable({
  providedIn: 'root'
})
export class SqlMitarbeiterService {

  constructor(private dataService: DataService) { }

  /**
   * Holt alle Mitarbeiter, die mit einer bestimmten Behandlungs-ID verknüpft sind.
   * @param behandlungsID - Die ID der Behandlung.
   * @return - Ein Array von Mitarbeitern, die mit der angegebenen Behandlungs-ID verknüpft sind. Jeder Mitarbeiter wird als `Mitarbeiter`-Objekt gemappt.
   */
  async getMitarbeiterByBehandlungsID(behandlungsID : number){
    const query: string = 'SELECT * FROM MITARBEITER JOIN behandlungZuMitarbeiter ON MITARBEITER.mitarbeiterID = behandlungZuMitarbeiter.mitarbeiterID WHERE behandlungZuMitarbeiter.behandlungsID='+behandlungsID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return this.mitarbeiterMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt alle Mitarbeiter, die mit einer bestimmten Operations-ID verknüpft sind.
   * @param opID - Die ID der Operation.
   * @return - Ein Array von Mitarbeitern, die mit der angegebenen Operations-ID verknüpft sind. Jeder Mitarbeiter wird als `Mitarbeiter`-Objekt gemappt.
   */
  async getMitarbeiterByOpID(opID : number){
    const query: string = 'SELECT * FROM MITARBEITER JOIN mitarbeiterZuOperation ON MITARBEITER.mitarbeiterID = mitarbeiterZuOperation.mitarbeiterID WHERE mitarbeiterZuOperation.opID='+opID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return this.mitarbeiterMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt alle Mitarbeiter, bei denen die Arztnummer auf `NULL` gesetzt ist.
   * @return - Ein Array von Mitarbeitern, deren Arztnummer `NULL` ist. Jeder Mitarbeiter wird als `Mitarbeiter`-Objekt gemappt.
   */
  async getMitarbeiterByArztnummerNULL(){
    const query: string = 'SELECT * FROM MITARBEITER WHERE arztnummer is NULL';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return this.mitarbeiterMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt alle Mitarbeiter, die einer bestimmten Fachrichtung zugeordnet sind und eine Arztnummer haben.
   * @param fachrichtungsID - Die ID der Fachrichtung.
   * @return - Ein Array von Mitarbeitern, die der angegebenen Fachrichtung zugeordnet sind und eine Arztnummer haben. Jeder Mitarbeiter wird als `Mitarbeiter`-Objekt gemappt.
   */
  async getMitarbeiterByFachrichtungsID(fachrichtungsID: number){
    const query: string = 'SELECT * FROM MITARBEITER JOIN fachrichtungZuMitarbeiter ON fachrichtungZuMitarbeiter.mitarbeiterID=MITARBEITER.mitarbeiterID WHERE MITARBEITER.arztnummer is not NULL AND fachrichtungZuMitarbeiter.fachrichtungsID='+fachrichtungsID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      console.log(response);
      return this.mitarbeiterMapping(response);
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Wandelt die Antwort der Datenbankabfrage in ein Array von `Mitarbeiter`-Objekten um.
   * @param response - Die Antwort der Datenbankabfrage, die als Array von Zeilen vorliegt.
   * @return - Ein Array von `Mitarbeiter`-Objekten, die die Zeilen der Antwort repräsentieren.
   */
  mitarbeiterMapping(response: any){
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
  }

}
