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

/**
 * Komponente zum Aufnehmen eines neuen Patienten.
 *
 * Diese Komponente ermöglicht die Eingabe und Speicherung der Daten eines neuen Patienten,
 * einschließlich der Suche nach einem freien Bett basierend auf der ausgewählten Abteilung und Ausstattung.
 */
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

  /**
   * Erzeugt eine neue Instanz der `AdmittingNewPatientComponent`-Klasse.
   *
   * @param {Location} location - Der Dienst zum Navigieren.
   * @param {SqlQueriesService} sqlQueriesService - Der Dienst zum Abrufen von Daten aus der Datenbank.
   */
  constructor(private location: Location, private sqlQueriesService: SqlQueriesService) {}

  /**
   * Initialisiert die Komponente, indem die Liste der Abteilungen geladen wird.
   */
  ngOnInit(){
    this.loadDepartments();
  }

  /**
   * Lädt die Liste der Abteilungen.
   *
   * Diese Methode ruft alle Abteilungen aus der Datenbank ab und speichert sie in der `departments`-Liste.
   */
  async loadDepartments(){
    try{
      this.departments = await this.sqlQueriesService.getAllDepartments();
    }catch(error){
      console.error("Error loading departments:", error);
    }
  }

  /**
   * Sucht nach einem freien Bett basierend auf der ausgewählten Abteilung und Ausstattung.
   *
   * Diese Methode ruft alle verfügbaren Betten ab, die den Anforderungen entsprechen,
   * und speichert das erste gefundene Bett.
   */
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

  /**
   * Nimmt den neuen Patienten auf, indem die Patientendaten und der Aufenthalt gespeichert werden.
   *
   * Diese Methode speichert die Daten des neuen Patienten und den zugehörigen Aufenthalt
   * in der Datenbank.
   * @component
   * @selector app-admitting-new-patient
   * @templateUrl ./admitting-new-patient.component.html
   * @styleUrls ./admitting-new-patient.component.css
   */
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
    }
  }
}
