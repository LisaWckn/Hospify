import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DummyMethods} from "../../../services/dummyMethods";
import {Patient} from "../../../models/patient";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {DiagnosticFindings} from "../../../models/diagnostic-findings";
import {Massnahme} from "../../../models/massnahme";
import {Behandlung} from "../../../models/behandlung";
import {Operation} from "../../../models/operation";
import {MatDialog} from "@angular/material/dialog";
import {PatientEntlassenComponent} from "../patient-entlassen/patient-entlassen.component";
import {AddBehandlungComponent} from "../add-behandlung/add-behandlung.component";

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit{
  patientID = 1;
  patient : Patient = DummyMethods.emptyPatient;
  routeSub: Subscription = new Subscription;

  diagnosticFindings: DiagnosticFindings[] = [];
  massnahmen : Massnahme[] = [];
  behandlungen: Behandlung[] = [];
  operationen: Operation[] = [];

  currentStay = DummyMethods.getCurrentStayByPatientID(this.patientID);

  wholeTimeBehandlungsplan = true;

  constructor(private route: ActivatedRoute,private router: Router, private sqlQueriesService: SqlQueriesService, public dialog: MatDialog) { }

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

  async loadPatient() {
    try {
      this.patient = (await this.sqlQueriesService.getPatientByID(this.patientID))[0];
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadDiagnosticFindings(){
    try {
      this.diagnosticFindings = await this.sqlQueriesService.getAllDiagnosticFindingsByPatientID(this.patientID);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadCurrentStay(){
    try{
      this.currentStay = (await this.sqlQueriesService.getCurrentStayByPatientID(this.patientID))[0];
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadWholeMassnahmen() {
    try{
      this.massnahmen = await this.sqlQueriesService.getCurrentBehandlungsplanElements(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadTodayMassnahmen(){
    try{
      this.massnahmen = await this.sqlQueriesService.getCurrentBehandlungsplanElementsByTodayDate(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadWholeBehandlungen() {
    try{
      this.behandlungen = await this.sqlQueriesService.getCurrentBehandlungen(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadTodayBehandlungen() {
    try{
      this.behandlungen = await this.sqlQueriesService.getTodayBehandlungen(this.patientID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  async loadOperations(){
    try{
      this.operationen = await this.sqlQueriesService.getAllOperationsByPatientID(this.patientID);

    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  wholeTimeBehandlungsplanChanged(){
    if(this.wholeTimeBehandlungsplan){
      this.loadWholeMassnahmen();
      this.loadWholeBehandlungen()
    }else{
      this.loadTodayMassnahmen();
      this.loadTodayBehandlungen();
    }
  }

  openNewOperationPage(){
    this.router.navigate(["/new-operation", this.patient.patientenID]);
  }

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

  async addBehandlung(result: Massnahme[]){
    try{
      this.sqlQueriesService.insertBehandlung(this.patient.patientenID!, result);
    }catch(error){
      console.error("Error inserting Behandlung:", error);
    }
  }

  async entlassePatient(){
    try{
      await this.sqlQueriesService.updateStay(this.currentStay.aufenthaltID);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  protected readonly String = String;
}
