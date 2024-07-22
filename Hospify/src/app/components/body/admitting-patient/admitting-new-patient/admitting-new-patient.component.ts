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
  bloodtypes : string[] = ["0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  newPatient: Patient = {name: "",plz:"", geschlecht: "Maennlich", blutgruppe: "0-", geburtsdatum: new Date(0), adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: "Gesetzlich"};
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

  async findFreeBed() {
    try{
      let bedArray : Bett[] = await this.sqlQueriesService.findFreeBed(this.departments.find(d=> d.abteilungsID == this.selectedDepartmentID)!, this.equipment);

      if(bedArray.length == 0){
        this.errorMessage = true;
      }else{
        this.bedFound = true;
        this.errorMessage = false;

        this.bed = bedArray[0];
        console.log(this.bed);
      }
    }catch (error){
      console.error("Error finding bed:", error);
    }
  }

  async admitPatient(){
    if(this.newPatient.name != "" && this.newPatient.geschlecht != ""){
      let placeArray = await this.sqlQueriesService.findOrt(this.place.plz)
      if(placeArray.length == 0){
        await this.sqlQueriesService.insertOrt(this.place);
      }

      this.newPatient.adresse = this.street +" " +  this.houseNumber;
      this.newPatient.plz = this.place.plz;
      let patientID = await this.sqlQueriesService.getMaxPatientID() as number;
      patientID++;

      await this.sqlQueriesService.insertPatient(this.newPatient);

      await this.sqlQueriesService.insertAufenthalt(patientID, new Date(), this.bed!);

      this.location.back();
    }else{
      //TODO: Error Message
    }
  }
}
