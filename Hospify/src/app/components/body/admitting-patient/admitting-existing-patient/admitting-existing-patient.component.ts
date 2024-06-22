import { Component } from '@angular/core';
import {Location} from '@angular/common';

import {Patient} from "../../../../models/patient";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Abteilung} from "../../../../models/abteilung";
import {Ausstattung} from "../../../../models/ausstattung";
import {Bett} from "../../../../models/bett";

@Component({
  selector: 'app-admitting-existing-patient',
  templateUrl: './admitting-existing-patient.component.html',
  styleUrl: './admitting-existing-patient.component.css'
})
export class AdmittingExistingPatientComponent {
  patients : Patient[] = DummyMethods.getAllPatients();
  selectedPatient : Patient = this.patients[0];
  departments: Abteilung[] = DummyMethods.getAllDepartments();
  selectedDepartmentID: number = 0;

  equipment: Ausstattung = {beatmungsgeraet: false, iv_drip: false, herzmonitor:false, extragross:false}
  bedFound : boolean = false;
  bed: Bett|undefined;
  errorMessage = false;

  constructor(private location: Location) {}

  findFreeBed() {
    this.bed = DummyMethods.findFreeBed(this.departments.find(d=> d.abteilungsID == this.selectedDepartmentID)!, this.equipment);

    if(this.bed == undefined){
      this.errorMessage = true;
    }else{
      this.bedFound = true;
      this.errorMessage = false;
    }
  }

  admitPatient(){
    DummyMethods.addStayForPatient(this.selectedPatient.patientenID!);
    DummyMethods.addBedForPatient(this.selectedPatient.patientenID!, this.bed!.bettID);

    this.location.back();
  }
}
