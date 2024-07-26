import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Patient} from "../../../models/patient";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {DiagnosticFindings} from "../../../models/diagnostic-findings";
import {Massnahme} from "../../../models/massnahme";
import {Behandlung} from "../../../models/behandlung";
import {Operation} from "../../../models/operation";
import {MatDialog} from "@angular/material/dialog";
import {PatientEntlassenComponent} from "../patient-entlassen/patient-entlassen.component";
import {AddBehandlungComponent} from "../add-behandlung/add-behandlung.component";
import {Stay} from "../../../models/stay";

/**
 * `PatientDetailsComponent` zeigt die Detailansicht eines Patienten, einschließlich diagnostischer Befunde, Maßnahmen, Behandlungen und Operationen.
 *
 * Diese Komponente ermöglicht die Ansicht und Verwaltung der Details eines Patienten, einschließlich der Möglichkeit,
 * den Patienten zu entlassen oder neue Behandlungen hinzuzufügen. Sie verwendet Dialoge zur Bestätigung und für Eingaben.
 *
 * @component
 * @selector app-patient-details
 * @templateUrl ./patient-details.component.html
 * @styleUrls ./patient-details.component.css
 */
@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit{
  patientID = 1;
  patient : Patient = {patientenID: -1, plz:"", name: "", geschlecht: "", blutgruppe: "", geburtsdatum: new Date(), adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};
  routeSub: Subscription = new Subscription;
  diagnosticFindings: DiagnosticFindings[] = [];
  massnahmen : Massnahme[] = [];
  behandlungen: Behandlung[] = [];
  operationen: Operation[] = [];

  currentStay : Stay = {aufenthaltID:-1, patientenID: this.patientID, startzeitpunkt: new Date()};

  wholeTimeBehandlungsplan = true;

  /**
   * Erzeugt eine Instanz der `PatientDetailsComponent`.
   *
   * @param route - Der ActivatedRoute-Dienst für den Zugriff auf Route-Parameter.
   * @param router - Der Router-Dienst zum Navigieren zwischen Seiten.
   * @param sqlQueriesService - Der Dienst zum Abrufen und Einfügen von Daten über SQL-Abfragen.
   * @param dialog - Der MatDialog-Dienst zum Öffnen von Dialogen.
   */
  constructor(private route: ActivatedRoute,private router: Router, private sqlQueriesService: SqlQueriesService, public dialog: MatDialog) { }

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   *
   * Lädt die Patientendaten, Befunde, aktuellen Aufenthalt, Maßnahmen, Behandlungen und Operationen.
   */
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.patientID = +params['id'];
    });

    this.loadPatient();
    this.loadDiagnosticFindings();
    this.loadCurrentStay();
    this.loadWholeMassnahmen();
    this.loadWholeBehandlungen();
    this.loadOperations();
  }

  /**
   * Lädt die Patientendaten basierend auf der Patienten-ID.
   */
  async loadPatient() {
    try {
      this.patient = (await this.sqlQueriesService.getPatientByID(this.patientID))[0];
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt alle Befunde des Patienten.
   */
  async loadDiagnosticFindings(){
    try {
      this.diagnosticFindings = await this.sqlQueriesService.getAllDiagnosticFindingsByPatientID(this.patientID);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt den aktuellen Aufenthalt des Patienten.
   */
  async loadCurrentStay(){
    try{
      this.currentStay = (await this.sqlQueriesService.getCurrentStayByPatientID(this.patientID))[0];
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt alle Maßnahmen des Patienten im Behandlungsplan.
   */
  async loadWholeMassnahmen() {
    try{
      this.massnahmen = await this.sqlQueriesService.getCurrentBehandlungsplanElements(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt die heutigen Maßnahmen des Patienten.
   */
  async loadTodayMassnahmen(){
    try{
      this.massnahmen = await this.sqlQueriesService.getCurrentBehandlungsplanElementsByTodayDate(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt alle Behandlungen des Patienten im Behandlungsplan.
   */
  async loadWholeBehandlungen() {
    try{
      this.behandlungen = await this.sqlQueriesService.getCurrentBehandlungen(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt die heutigen Behandlungen des Patienten.
   */
  async loadTodayBehandlungen() {
    try{
      this.behandlungen = await this.sqlQueriesService.getTodayBehandlungen(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Lädt alle Operationen des Patienten.
   */
  async loadOperations(){
    try{
      this.operationen = await this.sqlQueriesService.getAllOperationsByPatientID(this.patientID);

    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  /**
   * Ändert den Behandlungsplan je nach Auswahl, um entweder den gesamten Behandlungsplan oder nur die heutigen Maßnahmen anzuzeigen.
   */
  wholeTimeBehandlungsplanChanged(){
    if(this.wholeTimeBehandlungsplan){
      this.loadWholeMassnahmen();
      this.loadWholeBehandlungen()
    }else{
      this.loadTodayMassnahmen();
      this.loadTodayBehandlungen();
    }
  }

  /**
   * Öffnet die Seite zum Hinzufügen einer neuen Operation.
   */
  openNewOperationPage(){
    this.router.navigate(["/new-operation", this.patient.patientenID]);
  }

  /**
   * Öffnet einen Bestätigungsdialog, um den Patienten zu entlassen.
   */
  openEntlassenDialog(): void {
    const dialogRef = this.dialog.open(PatientEntlassenComponent, {
      width: '30%',
      data: { title: 'Patient entlassen', message: 'Möchten Sie den Patienten entlassen?' },
      panelClass: 'dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Benutzer hat 'Ja' gewählt
        this.entlassePatient();
      } else {
        // Benutzer hat 'Nein' gewählt
      }
    });
  }

  /**
   * Öffnet einen Dialog zum Hinzufügen einer neuen Behandlung.
   */
  openAddBehandlungDialog(): void {
    const dialogRef = this.dialog.open(AddBehandlungComponent, {
      width: '50%',
      data: { title: 'Behandlung hinzufügen', message: 'Bitte wählen Sie die Maßnahmen.' },
      panelClass: 'dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result!=false) {
        // Benutzer hat 'Ja' gewählt
        this.addBehandlung(result);
      } else {
        // Benutzer hat 'Nein' gewählt
      }
    });
  }

  /**
   * Fügt eine neue Behandlung hinzu und verknüpft diese mit den ausgewählten Maßnahmen.
   *
   * @param result - Die ausgewählten Maßnahmen, die mit der neuen Behandlung verknüpft werden sollen.
   */
  async addBehandlung(result: Massnahme[]){
    try{
      let behandlungsID = (await this.sqlQueriesService.getMaxBehandlungsID()) as number;
      behandlungsID++;

      const behandlung : Behandlung = {behandlungsID: behandlungsID, patientenID: this.patient.patientenID!, zeitpunkt: new Date()};

      await this.sqlQueriesService.insertBehandlung(behandlung);

      for(let massnahme of result){
        await this.sqlQueriesService.insertBehandlungZuMassnahme(behandlungsID, massnahme.massnahmenID);
      }

      await this.sqlQueriesService.insertBehandlungZuMitarbeiter(behandlungsID,7);
    }catch(error){
      console.error("Error inserting Behandlung:", error);
    }
  }
  /**
   * Entlässt den Patienten, indem der aktuelle Aufenthalt aktualisiert wird.
   */
  async entlassePatient(){
    try{
      await this.sqlQueriesService.updateStay(this.currentStay.aufenthaltID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  protected readonly String = String;
}
