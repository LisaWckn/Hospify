import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Massnahme} from "../../../models/massnahme";
import {SqlQueriesService} from "../../../services/sql-queries.service";

/**
 * Komponente zum Hinzufügen einer neuen Behandlung.
 *
 * Diese Komponente wird in einem Dialog verwendet, um dem Benutzer das Hinzufügen von Maßnahmen zu einer Behandlung zu ermöglichen.
 *
 * @component
 * @selector app-add-behandlung
 * @templateUrl ./add-behandlung.component.html
 * @styleUrls ./add-behandlung.component.scss
 */
@Component({
  selector: 'app-add-behandlung',
  templateUrl: './add-behandlung.component.html',
  styleUrl: './add-behandlung.component.css'
})
export class AddBehandlungComponent implements OnInit{

  selectedMassnahmen : Massnahme[] = [];

  currentlySelectedMassnahme : number = 1;

  allMassnahmen : Massnahme[] = [];

  /**
   * Erzeugt eine neue Instanz der `AddBehandlungsComponent`-Klasse.
   *
   * @param dialogRef - Referenz auf das Dialogfenster.
   * @param data - Daten, die an das Dialogfenster übergeben wurden.
   * @param sqlQueriesService - Service für SQL-Abfragen.
   */
  constructor(
    public dialogRef: MatDialogRef<AddBehandlungComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sqlQueriesService: SqlQueriesService
  ) {}

  /**
   * Initialisiert die Komponente, indem die Liste der Massnahmen geladen wird.
   */
  ngOnInit(){
    this.loadMassnahmen();
  }

  /**
   * Lädt alle verfügbaren Maßnahmen.
   *
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen, um die Liste der Maßnahmen zu laden.
   */
  async loadMassnahmen(){
    try{
      this.allMassnahmen = await this.sqlQueriesService.getAllMassnahmen();
    }catch (error){
      console.error("Error loading all massnahmen:", error);
    }
  }

  /**
   * Fügt die aktuell ausgewählte Maßnahme zur Liste der ausgewählten Maßnahmen hinzu.
   */
  addMassnahmeToSelected() {
    let indexToDelete = -1;
    for (let i=0; i<this.allMassnahmen.length;i++){
      if(this.allMassnahmen.at(i)!.massnahmenID == this.currentlySelectedMassnahme){
        this.selectedMassnahmen.push(this.allMassnahmen.at(i)!);
        indexToDelete = i;
      }
    }
    if (indexToDelete > -1) {
      this.allMassnahmen.splice(indexToDelete, 1);
    }

    this.currentlySelectedMassnahme = this.allMassnahmen.at(0)!.massnahmenID;
  }

  /**
   * Schließt das Dialogfenster ohne Auswahl.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Schließt das Dialogfenster und übergibt die ausgewählten Maßnahmen.
   */
  onYesClick(): void {
    this.dialogRef.close(this.selectedMassnahmen);
  }
}
