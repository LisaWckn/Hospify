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
  selectedDepartmentID: number = 0;

  equipment: Ausstattung = {beatmungsgeraet: false, iv_drip: false, herzmonitor:false, extragross:false}
  bedFound : boolean = false;
  bed: Bett|undefined;
  errorMessage = false;

  constructor(private location: Location, private sqlQueriesService: SqlQueriesService) {}

  ngOnInit() {
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
    }catch(error){
      console.error("Error loading departments:", error);
    }
  }

  async findFreeBed() {
    this.bed = await this.sqlQueriesService.findFreeBed(this.departments.find(d=> d.abteilungsID == this.selectedDepartmentID)!, this.equipment);

    if(this.bed == undefined){
      this.errorMessage = true;
    }else{
      this.bedFound = true;
      this.errorMessage = false;
    }
  }

  async admitPatient(){
    try{
      await this.sqlQueriesService.insertAufenthalt(this.selectedPatient!.patientenID!, new Date(), this.bed!);
      this.location.back();
    }catch (error){
      console.error("Error insert stay:", error);
    }

  }
}
