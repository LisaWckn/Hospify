import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from "@angular/material/core";
import {Operationssaal} from "../../../models/operationssaal";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {Eingriff} from "../../../models/eingriff";
import {Abteilung} from "../../../models/abteilung";
import {Mitarbeiter} from "../../../models/mitarbeiter";
import {Komplikation} from "../../../models/komplikation";
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Operation} from "../../../models/operation";

/**
 * `NewOperationComponent` ist eine Komponente zum Erstellen neuer Operationen.
 *
 * Diese Komponente ermöglicht das Hinzufügen neuer Operationen zu einem Patienten.
 *
 * @component
 * @selector app-new-operation
 * @templateUrl ./new-operation.component.html
 * @styleUrls ./new-operation.component.css
 * @providers [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }]
 * @changeDetection ChangeDetectionStrategy.OnPush
 */
@Component({
  selector: 'app-new-operation',
  templateUrl: './new-operation.component.html',
  styleUrl: './new-operation.component.css',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'de-DE' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewOperationComponent implements OnInit{
  patientID = 1;
  loading: boolean = false; // Initial auf true setzen
  routeSub: Subscription = new Subscription;

  currentDate = new Date();
  currentTime = this.currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  opDescription = "";

  opSaalID = -1;
  opSaele: Operationssaal[] = [];

  isDringed: boolean = false;

  selectedEingriffe: Eingriff[] = [];
  currentlySelectedEingriff = -1;
  allEingriffe: Eingriff[] = [];
  duration: number =0;

  selectedKomplikationen: Komplikation[] = [];
  currentlySelectedKomplikation = -1;
  allKomplikationen: Komplikation[] = [];

  selectedMitarbeiter: Mitarbeiter[] = [];
  currentlySelectedMitarbeiter = -1;
  allMitarbeiter: Mitarbeiter[] = [];

  errorMessage = false;

  /**
   * Erzeugt eine Instanz von `NewOperationComponent`.
   *
   * @param location - Der Standortdienst zum Navigieren.
   * @param route - Der Dienst zum Abrufen der Route-Parameter.
   * @param sqlQueriesService - Der Dienst zum Abrufen von Daten über SQL-Abfragen.
   */
  constructor(private location: Location, private route: ActivatedRoute, private sqlQueriesService: SqlQueriesService) {}

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt die erforderlichen Daten für die Auswahl von Operationssaal, Eingriffen, Komplikationen und Mitarbeitern.
   */
  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.patientID = +params['id'];
    });

    this.opSaele = [];
    this.loadOpSaele();
    this.loadEingriffe();
    this.loadKomplikationen();
    this.loadMitarbeiter();
  }

  /**
   * Lädt alle verfügbaren Eingriffe aus dem Backend.
   */
  async loadEingriffe(){
    try {
      this.allEingriffe = await this.sqlQueriesService.getAllEingriffe();
      this.currentlySelectedEingriff = this.allEingriffe.at(0)!.eingriffID;
    }catch(error){
      console.error("Error loading eingriffe:", error);
    }finally {
      this.loading = false;
    }
  }

  /**
   * Lädt alle verfügbaren Operationssäle aus dem Backend.
   */
  async loadOpSaele(){
    try{
      this.opSaele = await this.sqlQueriesService.getAllAvailableOpSaele();
      this.opSaalID = this.opSaele[0].opSaalID;
    }catch(error){
      console.error("Error loading op saele:", error);
    }
  }

  /**
   * Lädt alle verfügbaren Mitarbeiter basierend auf der Fachrichtung des Patienten.
   */
  async loadMitarbeiter(){
    try{
      const fachrichtungsID = (await this.sqlQueriesService.getFachrichtungByPatientID(this.patientID))[0].fachrichtungsID;
      this.allMitarbeiter = await this.sqlQueriesService.getMitarbeiterByArztnummerNULL();
      let fachaerzte = await this.sqlQueriesService.getMitarbeiterByFachrichtungsID(fachrichtungsID);
      let anaestesie =await this.sqlQueriesService.getMitarbeiterByFachrichtungsID(17);
      for(let arzt of fachaerzte){
        this.allMitarbeiter.push(arzt);
      }
      for(let arzt of anaestesie){
        this.allMitarbeiter.push(arzt);
      }
      this.currentlySelectedMitarbeiter = this.allMitarbeiter.at(0)!.mitarbeiterID;
    }catch(error){
      console.error("Error loading mitarbeiter:", error);
    }
  }

  /**
   * Lädt alle verfügbaren Komplikationen aus dem Backend.
   *
   * Diese Methode ruft alle Komplikationen ab und setzt die aktuell ausgewählte Komplikation
   * auf die erste in der Liste. Das `loading`-Flag wird auf `false` gesetzt, nachdem die
   * Daten geladen wurden.
   */
  async loadKomplikationen(){
    try {
      this.allKomplikationen = await this.sqlQueriesService.getAllKomplikationen();
      this.currentlySelectedKomplikation = this.allKomplikationen.at(0)!.komplikationsID;
    }catch(error){
      console.error("Error loading eingriffe:", error);
    }finally {
      this.loading = false;
    }
  }

  /**
   * Fügt den aktuell ausgewählten Eingriff zur Liste der ausgewählten Eingriffe hinzu
   * und entfernt ihn aus der Liste der verfügbaren Eingriffe.
   *
   * Aktualisiert die ID des aktuell ausgewählten Eingriffs und berechnet die Dauer der
   * Operation neu.
   */
  addEingriffToSelected() {
    let indexToDelete = -1;
    for (let i=0; i<this.allEingriffe.length;i++){
      if(this.allEingriffe.at(i)!.eingriffID == this.currentlySelectedEingriff){
        this.selectedEingriffe.push(this.allEingriffe.at(i)!);
        indexToDelete = i;
      }
    }
    if (indexToDelete > -1) {
      this.allEingriffe.splice(indexToDelete, 1);
    }

    this.currentlySelectedEingriff = this.allEingriffe.at(0)!.eingriffID;
    this.calculateDuration();
  }

  /**
   * Fügt die aktuell ausgewählte Komplikation zur Liste der ausgewählten Komplikationen
   * hinzu und entfernt sie aus der Liste der verfügbaren Komplikationen.
   *
   * Aktualisiert die ID der aktuell ausgewählten Komplikation.
   */
  addKomplikationToSelected(){
    let indexToDelete = -1;
    for (let i=0; i<this.allKomplikationen.length;i++){
      if(this.allKomplikationen.at(i)!.komplikationsID == this.currentlySelectedKomplikation){
        this.selectedKomplikationen.push(this.allKomplikationen.at(i)!);
        indexToDelete = i;
      }
    }
    if (indexToDelete > -1) {
      this.allKomplikationen.splice(indexToDelete, 1);
    }

    this.currentlySelectedKomplikation = this.allKomplikationen.at(0)!.komplikationsID;
  }

  /**
   * Fügt den aktuell ausgewählten Mitarbeiter zur Liste der ausgewählten Mitarbeiter hinzu
   * und entfernt ihn aus der Liste der verfügbaren Mitarbeiter.
   *
   * Aktualisiert die ID des aktuell ausgewählten Mitarbeiters.
   */
  addMitarbeiterToSelected(){
    let indexToDelete = -1;
    for (let i=0; i<this.allMitarbeiter.length;i++){
      if(this.allMitarbeiter.at(i)!.mitarbeiterID == this.currentlySelectedMitarbeiter){
        this.selectedMitarbeiter.push(this.allMitarbeiter.at(i)!);
        indexToDelete = i;
      }
    }
    if (indexToDelete > -1) {
      this.allMitarbeiter.splice(indexToDelete, 1);
    }

    this.currentlySelectedMitarbeiter = this.allMitarbeiter.at(0)!.mitarbeiterID;
  }

  /**
   * Berechnet die Dauer der Operation basierend auf der Zeitabschätzung der ausgewählten Eingriffe.
   */
  calculateDuration(){
    this.duration = 0;
    for(let eingriff of this.selectedEingriffe){
      this.duration += eingriff.zeitschaetzung;
    }
  }

  /**
   * Speichert die neue Operation im Backend.
   *
   * Überprüft, ob alle erforderlichen Felder ausgefüllt sind. Falls nicht, wird eine
   * Fehlermeldung angezeigt. Andernfalls werden die Operation, die Eingriffe, Komplikationen
   * und Mitarbeiter im Backend gespeichert. Die Benutzeroberfläche wird anschließend zur
   * vorherigen Seite zurückgeführt.
   */
  async saveOperation(){
    if(this.opSaalID == -1 || this.selectedEingriffe.length == 0 || this.selectedMitarbeiter.length < 5){
      this.errorMessage = true;
      return;
    }else{
      let annArzt = false;
      let fachArzt = false;
      for(let ma of this.selectedMitarbeiter){
        if(ma.arztart!= null){
          let fachrichtungsID = (await this.sqlQueriesService.getFachrichtungByArztID(ma.mitarbeiterID))[0].fachrichtungsID;
          if(fachrichtungsID == 17){
            annArzt = true;
          }else{
            fachArzt = true;
          }
        }
      }
      if(!annArzt || !fachArzt){
        this.errorMessage = true;
        return;
      }else{
        this.errorMessage = false;
        const dateTimeString = `${this.currentDate.toLocaleDateString('en-CA')}T${this.currentTime}:00`;
        let startzeit = new Date(dateTimeString);
        let endzeit = this.addMinutes(startzeit, this.duration);
        try{
          let opID = (await this.sqlQueriesService.getMaxOperationID()) as number;
          opID++;

          let op:Operation = {opID: opID, patientenID: this.patientID, opSaalID: this.opSaalID, startzeit:startzeit, endzeit:endzeit, dringend:this.isDringed, Ursache: this.opDescription};

          await this.sqlQueriesService.insertOperation(op);

          if(opID != -1){
            for(let eingriff of this.selectedEingriffe){
              await this.sqlQueriesService.insertOperationZuEingriff(opID, eingriff);
            }
            for(let komp of this.selectedKomplikationen){
              await this.sqlQueriesService.insertOperationZuKomplikation(opID, komp);
            }
            for(let mitarbeiter of this.selectedMitarbeiter){
              await this.sqlQueriesService.insertMitarbeiterZuOperation(opID, mitarbeiter);
            }
          }

          this.location.back();
        }catch(error){
          console.error("Error inserting operation." ,error);
        }
      }
    }
  }

  /**
   * Fügt die angegebene Anzahl von Minuten zum gegebenen Datum hinzu.
   *
   * @param {Date} date - Das Datum, zu dem die Minuten hinzugefügt werden sollen.
   * @param {number} minutes - Die Anzahl der Minuten, die hinzugefügt werden sollen.
   * @return {Date} - Ein neues Datum, das die hinzugefügten Minuten enthält.
   */
  addMinutes(date: Date, minutes: number): Date {
    // Erstelle eine Kopie des Datumsobjekts, um das Original nicht zu verändern
    const newDate = new Date(date.getTime());

    // Füge die Minuten hinzu
    newDate.setMinutes(newDate.getMinutes() + minutes);

    return newDate;
  }
}
