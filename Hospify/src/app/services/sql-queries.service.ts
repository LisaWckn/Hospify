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
import {Operationssaal} from "../models/operationssaal";
import {Eingriff} from "../models/eingriff";
import {SqlPatientService} from "./sql-sub-services/sql-patient.service";
import {SqlMitarbeiterService} from "./sql-sub-services/sql-mitarbeiter.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {Ort} from "../models/ort";

/**
 * Service für SQL-Abfragen und Datenoperationen.
 */
@Injectable({
  providedIn: 'root'
})
export class SqlQueriesService {

  /**
   * Konstruktor für den SQLQueriesService.
   * @param dataService - Der DataService zum Ausführen von Abfragen.
   * @param sqlPatientService - Der Service für Patientenoperationen.
   * @param sqlMitarbeiterService - Der Service für Mitarbeiteroperationen.
   */
  constructor(private dataService: DataService, private sqlPatientService: SqlPatientService, private sqlMitarbeiterService: SqlMitarbeiterService) {}

  /**
   * Holt alle Patienten aus der Datenbank.
   * @return - Eine Liste aller Patienten.
   */
  async getAllPatients(): Promise<Patient[]> {
    return this.sqlPatientService.getAllPatients();
  }

  /**
   * Holt alle anwesenden Patienten.
   * @return - Eine Liste aller anwesenden Patienten.
   */
  async getAllPresentPatients(): Promise<Patient[]> {
    return this.sqlPatientService.getAllPresentPatients();
  }

  /**
   * Holt einen Patienten anhand der ID.
   * @param patientenID - Die ID des Patienten.
   * @return - Der Patient mit der angegebenen ID.
   */
  async getPatientByID(patientenID: number){
    return this.sqlPatientService.getPatientByID(patientenID);
  }

  /**
   * Holt die höchste Patienten-ID aus der Datenbank.
   * @return - Die höchste Patienten-ID.
   */
  async getMaxPatientID(){
    return this.sqlPatientService.getMaxPatientID();
  }

  /**
   * Fügt einen neuen Patienten in die Datenbank ein.
   * @param patient - Der Patient, der eingefügt werden soll.
   */
  async insertPatient(patient: Patient){
    return this.sqlPatientService.insertPatient(patient);
  }

  /**
   * Holt alle Befunde eines Patienten anhand der ID.
   * @param patientenID - Die ID des Patienten.
   * @return - Eine Liste aller Befunde des Patienten.
   */
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

  /**
   * Holt den aktuellen Aufenthalt eines Patienten anhand der ID.
   * @param patientenID - Die ID des Patienten.
   * @return - Der aktuelle Aufenthalt des Patienten.
   */
  async getCurrentStayByPatientID(patientenID: number){
    const currentDate = (new Date()).toLocaleDateString('sv-SE');
    const query: string = 'SELECT * FROM Aufenthalt WHERE startzeitpunkt < DATE \''+currentDate+'\' AND (endzeitpunkt > DATE \''+currentDate+'\' OR endzeitpunkt IS NULL) AND patientenID = ' + patientenID;
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

  /**
   * Aktualisiert den Aufenthalt eines Patienten.
   * @param aufenthaltID - Die ID des Aufenthalts.
   */
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

  /**
   * Holt alle Maßnahmen aus der Datenbank.
   * @return - Eine Liste aller Maßnahmen.
   */
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

  /**
   * Holt alle aktuellen Behandlungsplanelemente eines Patienten.
   * @param patientenID - Die ID des Patienten.
   * @return - Eine Liste der aktuellen Behandlungsplanelemente.
   */
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

  /**
   * Holt die heutigen Behandlungsplanelemente eines Patienten.
   * @param patientenID - Die ID des Patienten.
   * @return - Eine Liste der heutigen Behandlungsplanelemente.
   */
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

  /**
   * Holt alle Massnahmen die in Behandlungen ausgeführt werden.
   * @param patientenID - Die ID der Behandlung.
   * @return - Eine Liste der ausgeführten Massnahmen.
   */
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

  /**
   * Holt die aktuellen Behandlungen eines Patienten.
   * @param patientenID - Die ID des Patienten.
   * @return - Die aktuelle Behandlungen des Patienten.
   */
  async getCurrentBehandlungen(patientenID:number){
    let behandlungsplan : Behandlungsplan = (await this.getCurrentBehandlungsplan(patientenID))[0];
    let startzeit = behandlungsplan.startzeit.toLocaleDateString('sv-SE');
    let endzeit = behandlungsplan.endzeit?.toLocaleDateString('sv-SE');

    const query: string = 'SELECT * FROM BEHANDLUNG WHERE patientenID='+patientenID;
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

  /**
   * Holt die heutigen Behandlungen eines Patienten.
   * @param patientenID - Die ID des Patienten.
   * @return - Die heutigen Behandlungen des Patienten.
   */
  async getTodayBehandlungen(patientenID:number){
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate.getTime());
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const query: string = 'SELECT * FROM BEHANDLUNG WHERE patientenID='+patientenID+' AND zeitpunkt>= DATE \''+currentDate.toLocaleDateString('sv-SE')+'\' AND zeitpunkt<= DATE \''+tomorrowDate.toLocaleDateString('sv-SE')+'\' ';
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

  /**
   * Holt den aktuellen Behandlungsplan eines Patienten.
   * @param patientenID - Die ID des Patienten.
   * @return - Der aktuelle Behandlungsplan des Patienten.
   */
  async getCurrentBehandlungsplan(patientenID: number){
    const currentDate = new Date().toLocaleDateString('sv-SE');
    const query: string = 'SELECT * FROM BEHANDLUNGSPLAN WHERE startzeit < DATE \''+currentDate+'\' AND patientenID='+patientenID;
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

  /**
   * Holt die höchste Behandlungs-ID aus der Datenbank.
   * @return - Die höchste Behandlungs-ID.
   */
  async getMaxBehandlungsID(){
    const query: string = 'SELECT MAX(behandlungsID) FROM BEHANDLUNG';
    try {
      return await this.dataService.executeQuery(query).toPromise();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Fügt eine neue Behandlung in die Datenbank ein.
   * @param behandlung - Die Behandlung, die eingefügt werden soll.
   */
  async insertBehandlung(behandlung: Behandlung){
    const dateString = behandlung.zeitpunkt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});
    const timeString = behandlung.zeitpunkt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const zeitpunkt= dateString + " " + timeString;

    const query: string = 'INSERT INTO BEHANDLUNG (behandlungsID, patientenID, zeitpunkt) ' +
      'VALUES ('+behandlung.behandlungsID+', '+behandlung.patientenID+', \''+zeitpunkt+'\')';

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
   * Fügt eine Beziehung zwischen einer Behandlung und einer Maßnahme in die Datenbank ein.
   * @param behandlungsID - Die ID der Behandlung.
   * @param massnahmenID - Die ID der Maßnahme.
   */
  async insertBehandlungZuMassnahme(behandlungsID: number, massnahmenID: number){
    const query: string = 'INSERT INTO behandlungZuMassnahme (behandlungsID, massnahmenID) ' +
      'VALUES ('+behandlungsID+', '+massnahmenID+')';

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
   * Fügt eine Beziehung zwischen einer Behandlung und einem Mitarbeiter in die Datenbank ein.
   * @param behandlungsID - Die ID der Behandlung.
   * @param mitarbeiterID - Die ID des Mitarbeiters.
   */
  async insertBehandlungZuMitarbeiter(behandlungsID: number, mitarbeiterID: number){
    const query: string = 'INSERT INTO behandlungZuMitarbeiter (mitarbeiterID, behandlungsID) ' +
      'VALUES ('+mitarbeiterID+', '+behandlungsID+')';

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
   * Holt alle Mitarbeiter, die an einer bestimmten Behandlung beteiligt sind.
   * @param behandlungsID - Die ID der Behandlung.
   * @return - Alle Mitarbeiter die an der Behandlung beteiligt sind.
   */
  async getMitarbeiterByBehandlungsID(behandlungsID : number){
    return this.sqlMitarbeiterService.getMitarbeiterByBehandlungsID(behandlungsID);
  }

  /**
   * Holt alle Mitarbeiter, die an einer bestimmten Operation beteiligt sind.
   * @param opID - Die ID der Operation.
   * @return - Alle Mitarbeiter die an der Operation beteiligt .
   */
  async getMitarbeiterByOpID(opID : number){
    return this.sqlMitarbeiterService.getMitarbeiterByOpID(opID);
  }

  /**
   * Holt alle Mitarbeiter, die keine Arztnummer haben.
   * @return - Alle Mitarbeiter ohne Arztnummer.
   */
  async getMitarbeiterByArztnummerNULL(){
    return this.sqlMitarbeiterService.getMitarbeiterByArztnummerNULL();
  }

  /**
   * Holt alle Mitarbeiter, die durch eine bestimmte Fachrichtungs-ID identifiziert sind.
   * @param fachrichtungsID - Die ID der Fachrichtung.
   * @return - Alle Mitarbeiter die mit der Fachrichtung zusammen hängen.
   */
  async getMitarbeiterByFachrichtungsID(fachrichtungsID: number){
    return this.sqlMitarbeiterService.getMitarbeiterByFachrichtungsID(fachrichtungsID);
  }

  /**
   * Holt alle Operationen, die für einen bestimmten Patienten durchgeführt wurden.
   * @param patientenID - Die ID des Patienten.
   * @return - Alle Operationen die an dem Patienten durchgeführt wurden.
   */
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

  /**
   * Holt die höchste Operation-ID aus der Datenbank.
   * @return - Die höchste Operation-ID.
   */
  async getMaxOperationID(){
    const query: string = 'SELECT MAX(opID) FROM Operation';
    try {
      return await this.dataService.executeQuery(query).toPromise();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Fügt eine neue Operation in die Datenbank ein.
   * @param op - Das Operation-Objekt, das die zu speichernden Informationen enthält.
   */
  async insertOperation(op: Operation){
    let dateString = op.startzeit.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});
    let timeString = op.startzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const startzeit= dateString + " " + timeString;

    dateString = op.endzeit.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});
    timeString = op.endzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const endzeit= dateString + " " + timeString;

    const query: string = 'INSERT INTO OPERATION (opID, patientenID, opSaalID, startzeit, endzeit, dringend, Ursache) ' +
      'VALUES ('+op.opID+', '+op.patientenID+', '+op.opSaalID+', \''+startzeit+'\', \''+endzeit+'\', '+this.boolToInt(op.dringend)+', \''+op.Ursache+'\')';

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
   * Fügt eine Beziehung zwischen einem Mitarbeiter und einer Operation in die Datenbank ein.
   * @param opID - Die ID der Operation.
   * @param mitarbeiter - Das Mitarbeiter-Objekt, das an der Operation teilnimmt.
   */
  async insertMitarbeiterZuOperation(opID: number, mitarbeiter: Mitarbeiter){
    const query: string = 'INSERT INTO mitarbeiterZuOperation (mitarbeiterID, opID) ' +
      'VALUES ('+mitarbeiter.mitarbeiterID+', '+opID+')';

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
   * Fügt eine Beziehung zwischen einer Operation und einer Komplikation in die Datenbank ein.
   * @param opID - Die ID der Operation.
   * @param komplikation - Das Komplikation-Objekt, das mit der Operation verknüpft werden soll.
   */
  async insertOperationZuKomplikation(opID: number, komplikation: Komplikation){
    const query: string = 'INSERT INTO operationZuKomplikation (komplikationsID, opID) ' +
      'VALUES ('+komplikation.komplikationsID+', '+opID+')';

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
   * Fügt eine Beziehung zwischen einer Operation und einem Eingriff in die Datenbank ein.
   * @param opID - Die ID der Operation.
   * @param eingriff - Das Eingriff-Objekt, das mit der Operation verknüpft werden soll.
   */
  async insertOperationZuEingriff(opID: number, eingriff: Eingriff){
    const query: string = 'INSERT INTO operationZuEingriff (opID, eingriffID) ' +
      'VALUES ('+opID+', '+eingriff.eingriffID+')';

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
   * Holt alle Komplikationen, die mit einer bestimmten Operation verknüpft sind.
   * @param opID - Die ID der Operation.
   * @return - Alle Komplikationen die in der Operation vorkam.
   */
  async getAllKomplikationenByOpID(opID: number){
    const query: string = 'SELECT * FROM KOMPLIKATION JOIN operationZuKomplikation ON operationZuKomplikation.komplikationsID = KOMPLIKATION.komplikationsID WHERE operationZuKomplikation.opID='+opID;
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
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

  /**
   * Holt alle Komplikationen aus der Datenbank.
   * @return - Alle Komplikationen.
   */
  async getAllKomplikationen(){
    const query: string = 'SELECT * FROM KOMPLIKATION';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
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

  /**
   * Holt alle Einsatzbereiten Operationssäle aus der Datenbank.
   * @return - Alle einsatzbereiten Operationssäle.
   */
  async getAllAvailableOpSaele(){
    const query: string = 'SELECT * FROM OPERATIONSSAAL WHERE einsatzbereit=1';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        opSaalID: row[0],
        einsatzbereit: row[1]
      } as Operationssaal));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt alle Eingriffe aus der Datenbank.
   * @return - Alle Eingriffe.
   */
  async getAllEingriffe(){
    const query: string = 'SELECT * FROM eingriff';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        eingriffID: row[0],
        beschreibung: row[1],
        zeitschaetzung: row[2]
      } as Eingriff));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt alle Abteilungen aus der Datenbank.
   * @return - Alle Abteilungen.
   */
  async getAllDepartments(){
    const query: string = 'SELECT * FROM abteilung';
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
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

  /**
   * Holt eine Fachrichtung anhand ihrer ID aus der Datenbank.
   * @param fachrichtungsID - Die ID der Fachrichtung.
   * @return - Die Fachrichtung mit der angegebenen ID.
   */
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

  /**
   * Holt die Fachrichtung(en) eines Mitarbeiters anhand seiner ID.
   * @param mitarbeiterID - Die ID des Mitarbeiters.
   * @return - Alle Fachrichtungen des Mitarbeiters.
   */
  async getFachrichtungByArztID(mitarbeiterID: number){
    const query: string = 'SELECT FACHRICHTUNG.fachrichtungsID, FACHRICHTUNG.beschreibung FROM FACHRICHTUNG JOIN fachrichtungZuMitarbeiter ON fachrichtungZuMitarbeiter.fachrichtungsID=FACHRICHTUNG.fachrichtungsID WHERE mitarbeiterID='+mitarbeiterID;
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

  /**
   * Holt die Fachrichtung(en) in der sich ein Patient aufgehalten hat, anhand seiner ID.
   * @param patientID - Die ID des Patienten.
   * @return - Alle Fachrichtungen in der sich der Patient aufgehalten hat.
   */
  async getFachrichtungByPatientID(patientID: number){
    try {
      const stay = (await this.getCurrentStayByPatientID(patientID))[0];
      console.log(stay);

      const query: string = 'SELECT * FROM FACHRICHTUNG JOIN ABTEILUNG ON FACHRICHTUNG.fachrichtungsID=ABTEILUNG.fachrichtungsID' +
        ' JOIN RAUM ON RAUM.abteilungsID=ABTEILUNG.abteilungsID JOIN BETT ON RAUM.raumID=BETT.raumID' +
        ' JOIN aufenthaltZuBett ON BETT.bettID=aufenthaltZuBett.bettID JOIN AUFENTHALT ON aufenthaltZuBett.aufenthaltID=AUFENTHALT.aufenthaltID' +
        ' JOIN PATIENT ON AUFENTHALT.patientenID=PATIENT.patientenID WHERE PATIENT.patientenID='+patientID + ' AND AUFENTHALT.aufenthaltID='+stay.aufenthaltID;

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

  /**
   * Findet den Ort anhand der Postleitzahl.
   * @param plz - Die Postleitzahl des Ortes.
   * @return - Den Ort.
   */
  async findOrt(plz: string){
    try {
      const query: string = 'SELECT * FROM ORT WHERE plz='+plz;

      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        plz: row[0],
        ort: row[1]
      } as Ort));
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Fügt einen neuen Ort in die Datenbank ein.
   * @param ort - Das Ort-Objekt, das die zu speichernden Informationen enthält.
   */
  async insertOrt(ort: Ort) {
    const query: string = 'INSERT INTO ORT (plz, ort) ' +
      'VALUES (\''+ort.plz+'\', \''+ort.ort+'\')';

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
   * Findet die Bettenkonfigurationen basierend auf der Ausstattung.
   * @param ausstattung - Das Ausstattung-Objekt, das die Kriterien für die Bettenkonfigurationen enthält.
   * @return - Ein passendes Bett mit der gesuchten Ausstattung.
   */
  async findBedConfigurations(ausstattung: Ausstattung) {
    const query: string = 'SELECT ausstattungsID FROM ausstattung WHERE beatmungsgeraet='+this.boolToInt(ausstattung.beatmungsgeraet)+' AND iv_drip='+this.boolToInt(ausstattung.iv_drip)+' AND herzmonitor='+this.boolToInt(ausstattung.herzmonitor)+' AND extragross='+this.boolToInt(ausstattung.extragross);
    try {
      const response = await this.dataService.executeQuery(query).toPromise();
      return response;
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Findet freie Betten in einer bestimmten Abteilung, die einer bestimmten Ausstattung entsprechen.
   * @param abteilung - Die Abteilung, in der nach freien Betten gesucht werden soll.
   * @param ausstattung - Die Ausstattung, die die Kriterien für die freien Betten bestimmt.
   * @return - Eine Liste der freien Betten, in der gewünschten Abteilung mit der gewünschten Ausstattung.
   */
  async findFreeBed(abteilung: Abteilung, ausstattung: Ausstattung){
    try{
      const ausstattungsID = await this.findBedConfigurations(ausstattung);

      const query: string = 'SELECT * FROM bett JOIN raum ON bett.raumID = raum.raumID JOIN abteilung ON abteilung.abteilungsID = raum.abteilungsID WHERE bett.ausstattungsID = '+ausstattungsID +' and abteilung.abteilungsID = '+abteilung.abteilungsID+' and einsatzbereit = 1';

      const response = await this.dataService.executeQuery(query).toPromise();
      return response.map((row: any[]) => ({
        bettID: row[0],
        ausstattungsID: row[1],
        raumID: row[2],
        einsatzbereit: row[3]
      } as Bett));
    }catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Holt die höchste Aufenthalts-ID aus der Datenbank.
   * @return - Die höchste Aufenthalts-ID.
   */
  async getMaxAufenthaltID(){
    const query: string = 'SELECT MAX(aufenthaltID) FROM AUFENTHALT';
    try {
      return await this.dataService.executeQuery(query).toPromise();
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  /**
   * Fügt einen neuen Aufenthalt in die Datenbank ein.
   * @param patientenID - Die ID des Patienten, der den Aufenthalt haben wird.
   * @param startzeitpunkt - Der Startzeitpunkt des Aufenthalts.
   * @param bett - Das Bett, in dem der Aufenthalt stattfindet.
   */
  async insertAufenthalt(patientenID: number, startzeitpunkt: Date, bett: Bett){
    let aufenthaltID : number = await this.getMaxAufenthaltID() as number;
    aufenthaltID++;

    await this.insertAufenthaltZuBett(bett.bettID, aufenthaltID, startzeitpunkt);

    const dateString = startzeitpunkt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});
    const timeString = startzeitpunkt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const startzeit= dateString + " " + timeString;

    const query: string = 'INSERT INTO AUFENTHALT (aufenthaltID, patientenID, startzeitpunkt) ' +
      'VALUES ('+aufenthaltID+', '+patientenID+', \''+startzeit+'\')';

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
   * Fügt eine Zuordnung eines Bettes zu einem Aufenthalt in die Datenbank ein.
   * @param bettID - Die ID des Bettes, das dem Aufenthalt zugeordnet wird.
   * @param aufenthaltID - Die ID des Aufenthalts, dem das Bett zugeordnet wird.
   * @param startzeitpunkt - Der Startzeitpunkt des Aufenthalts im Bett.
   */
  async insertAufenthaltZuBett(bettID: number, aufenthaltID: number, startzeitpunkt:Date){
    const dateString = startzeitpunkt.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year:'numeric'});
    const timeString = startzeitpunkt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const startzeit= dateString + " " + timeString;

    const query: string = 'INSERT INTO aufenthaltZuBett (bettID, aufenthaltID, startzeitpunkt) ' +
      'VALUES ('+bettID+', '+aufenthaltID+', \''+startzeit+'\')';

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
