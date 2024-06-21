import { Component } from '@angular/core';
import {Patient} from "../../../../models/patient";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Abteilung} from "../../../../models/abteilung";

@Component({
  selector: 'app-admitting-existing-patient',
  templateUrl: './admitting-existing-patient.component.html',
  styleUrl: './admitting-existing-patient.component.css'
})
export class AdmittingExistingPatientComponent {
  patients : Patient[] = DummyMethods.getAllPatients();
  selectedPatientID : number = 1;
  departments: Abteilung[] = DummyMethods.getAllDepartments();
  selectedDepartmentID: number = 0;

  bedFound : boolean = false;

  findFreeBed() {

  }
}
