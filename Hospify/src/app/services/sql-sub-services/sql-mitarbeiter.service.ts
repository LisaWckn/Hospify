import { Injectable } from '@angular/core';
import {DataService} from "../data.service";
import {Mitarbeiter} from "../../models/mitarbeiter";

@Injectable({
  providedIn: 'root'
})
export class SqlMitarbeiterService {

  constructor(private dataService: DataService) { }

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
