import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Abteilung} from "../../../../models/abteilung";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Ausstattung} from "../../../../models/ausstattung";
import {Bett} from "../../../../models/bett";
import {Location} from "@angular/common";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {Patient} from "../../../../models/patient";
import {Ort} from "../../../../models/ort";
import {SqlQueriesService} from "../../../../services/sql-queries.service";

@Component({
  selector: 'app-admitting-new-patient',
  templateUrl: './admitting-new-patient.component.html',
  styleUrl: './admitting-new-patient.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmittingNewPatientComponent implements OnInit{
  bloodtypes : string[] = ["unbekannt","0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  newPatient: Patient = {name: "",plz:0, geschlecht: "", blutgruppe: "unbekannt", geburtsdatum: new Date(), adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};
  street = "";
  houseNumber = 0;
  place: Ort = {plz:"", ort:""};

  departments: Abteilung[] = [];
  selectedDepartmentID: number = 0;

  equipment: Ausstattung = {beatmungsgeraet: false, iv_drip: false, herzmonitor:false, extragross:false}
  bedFound : boolean = false;
  bed: Bett|undefined;
  errorMessage = false;

  constructor(private location: Location, private sqlQueriesService: SqlQueriesService) {}

  ngOnInit(){
    this.loadDepartments();
  }

  async loadDepartments(){
    try{
      this.departments = await this.sqlQueriesService.getAllDepartments();
    }catch(error){
      console.error("Error loading departments:", error);
    }
  }

  async findFreeBed(){
    this.bed = await this.sqlQueriesService.findFreeBed(this.departments.find(d=> d.abteilungsID == this.selectedDepartmentID)!, this.equipment);

    if(this.bed == undefined){
      this.errorMessage = true;
    }else{
      this.bedFound = true;
      this.errorMessage = false;
    }
  }

  admitPatient(){
    if(this.newPatient.name != "" && this.newPatient.geschlecht != ""){
      if(!DummyMethods.findPlace(this.place.plz)){
        DummyMethods.createPlace(this.place);
      }
      let patientID = DummyMethods.addPatient(this.newPatient);
      if(patientID!= -1){
        DummyMethods.addPlaceToPatient(patientID, this.place.plz);
        DummyMethods.addStayForPatient(0);
        DummyMethods.addBedForPatient(0, this.bed!.bettID);
      }

      this.location.back();
    }else{
      //TODO: Error Message
    }
  }
}
