import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {DummyMethods} from "../../../services/dummyMethods";
import {Patient} from "../../../models/patient";

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit{
  patientID = 0;
  patient : Patient = DummyMethods.emptyPatient;
  routeSub: Subscription = new Subscription;

  diagnosticFindings = DummyMethods.getAllDiagnosticFindingsByPatientID(0);

  currentStay = DummyMethods.getCurrentStayByPatientID(this.patientID);

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
      this.patientID = +params['id'];
    });

    this.patient = DummyMethods.getPatientByID(this.patientID);
    this.currentStay = DummyMethods.getCurrentStayByPatientID(this.patientID);
  }
}
