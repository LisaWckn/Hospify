import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Abteilung} from "../../../../models/abteilung";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Ausstattung} from "../../../../models/ausstattung";
import {Bett} from "../../../../models/bett";
import {Location} from "@angular/common";
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {Patient} from "../../../../models/patient";
import {Ort} from "../../../../models/ort";

@Component({
  selector: 'app-admitting-new-patient',
  templateUrl: './admitting-new-patient.component.html',
  styleUrl: './admitting-new-patient.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmittingNewPatientComponent {
  bloodtypes : string[] = ["unbekannt","0-", "0+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  newPatient: Patient = {name: "", geschlecht: "", blutgruppe: "unbekannt", geburtsdatum: "", adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};
  street = "";
  houseNumber = 0;
  place: Ort = {plz:"", ort:""};

  departments: Abteilung[] = DummyMethods.getAllDepartments();
  selectedDepartmentID: number = 0;

  equipment: Ausstattung = {beatmungsgeraet: false, iv_drip: false, herzmonitor:false, extragross:false}
  bedFound : boolean = false;
  bed: Bett|undefined;
  errorMessage = false;

  constructor(private location: Location) {}

  findFreeBed(){
    this.bed = DummyMethods.findFreeBed(this.departments.find(d=> d.abteilungsID == this.selectedDepartmentID)!, this.equipment);

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
