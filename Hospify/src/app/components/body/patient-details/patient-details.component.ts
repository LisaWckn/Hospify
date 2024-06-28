import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {DummyMethods} from "../../../services/dummyMethods";
import {Patient} from "../../../models/patient";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {DiagnosticFindings} from "../../../models/diagnostic-findings";

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

  currentStay = DummyMethods.getCurrentStayByPatientID(this.patientID);

  constructor(private route: ActivatedRoute, private sqlQueriesService: SqlQueriesService) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.patientID = +params['id'];
    });

    this.loadPatient();
    this.loadDiagnosticFindings();
    this.loadCurrentStay();
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
      console.log(this.currentStay);
    }catch (error) {
      console.error('Error loading patients:', error);
    }
  }

  protected readonly String = String;
}
