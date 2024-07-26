import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {Patient} from "../../../../models/patient";
import {DummyMethods} from "../../../../services/dummyMethods";
import {Abteilung} from "../../../../models/abteilung";
import {Ausstattung} from "../../../../models/ausstattung";
import {Bett} from "../../../../models/bett";
import {SqlQueriesService} from "../../../../services/sql-queries.service";

/**
 * Komponente zum Aufnehmen eines bestehenden Patienten.
 *
 * Diese Komponente ermöglicht die Auswahl eines bestehenden Patienten und die Suche
 * nach einem freien Bett basierend auf der ausgewählten Abteilung und Ausstattung.
 *
 * @component
 * @selector app-admitting-existing-patient
 * @templateUrl ./admitting-existing-patient.component.html
 * @styleUrls ./admitting-existing-patient.component.css
 */
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

  /**
   * Erzeugt eine neue Instanz der `AdmittingExistingPatientComponent`-Klasse.
   *
   * @param {Location} location - Der Dienst zum Navigieren.
   * @param {SqlQueriesService} sqlQueriesService - Der Dienst zum Abrufen von Daten aus der Datenbank.
   */
  constructor(private location: Location, private sqlQueriesService: SqlQueriesService) {}

  /**
   * Initialisiert die Komponente, indem die Liste der Patienten und Abteilungen geladen wird.
   */
  ngOnInit() {
    this.loadPatients();
    this.loadDepartments();
  }

  /**
   * Lädt die Liste der Patienten.
   *
   * Diese Methode ruft alle Patienten aus der Datenbank ab und speichert sie in der `patients`-Liste.
   */
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
   * Nimmt den ausgewählten Patienten auf, indem der Aufenthalt gespeichert wird.
   *
   * Diese Methode speichert den Aufenthalt des ausgewählten Patienten in der Datenbank.
   */
  async admitPatient(){
    try{
      await this.sqlQueriesService.insertAufenthalt(this.selectedPatient!.patientenID!, new Date(), this.bed!);
      this.location.back();
    }catch (error){
      console.error("Error insert stay:", error);
    }

  }
}
