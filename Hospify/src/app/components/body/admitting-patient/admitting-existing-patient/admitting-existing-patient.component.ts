import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {Patient} from "../../../../models/patient";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Abteilung} from "../../../../models/abteilung";
import {Ausstattung} from "../../../../models/ausstattung";
import {Bett} from "../../../../models/bett";
import {SqlQueriesService} from "../../../../services/sql-queries.service";

@Component({
  selector: 'app-admitting-existing-patient',
  templateUrl: './admitting-existing-patient.component.html',
  styleUrl: './admitting-existing-patient.component.css'
})
export class AdmittingExistingPatientComponent implements OnInit{
  loading: boolean = true; // Initial auf true setzen

  patients : Patient[] = [];
  selectedPatient : Patient = this.patients[0];
  departments: Abteilung[] = [];
  departmentNames: {abteilungsID: number, beschreibung:string}[] = [];
  selectedDepartmentID: number = 0;

  equipment: Ausstattung = {beatmungsgeraet: false, iv_drip: false, herzmonitor:false, extragross:false}
  bedFound : boolean = false;
  bed: Bett|undefined;
  errorMessage = false;

  constructor(private location: Location, private sqlQueriesService: SqlQueriesService) {}

  ngOnInit() {
    this.departmentNames = [];
    this.loadPatients();
    this.loadDepartments();
  }

  async loadPatients(){
    try{
      this.patients = await this.sqlQueriesService.getAllPatients();
      this.selectedPatient = this.patients[0];
    }catch(error){
      console.error("Error loading departments:", error);
    }finally {
      this.loading = false;
    }
  }

  async loadDepartments(){
    try{
      this.departments = await this.sqlQueriesService.getAllDepartments();
      this.loadDepartmentNames();
    }catch(error){
      console.error("Error loading departments:", error);
    }
  }

  async loadDepartmentNames(){
    for(let dep of this.departments){
      try{
        let fachrichtung = (await this.sqlQueriesService.getFachrichtungByID(dep.fachrichtungsID))[0];
        this.departmentNames.push({abteilungsID:dep.abteilungsID, beschreibung:fachrichtung.beschreibung});
      }catch (error){
        console.error("Error loading fachrichtung: ", error);
      }
    }
  }

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
    DummyMethods.addStayForPatient(this.selectedPatient!.patientenID!);
    DummyMethods.addBedForPatient(this.selectedPatient!.patientenID!, this.bed!.bettID);

    this.location.back();
  }
}
