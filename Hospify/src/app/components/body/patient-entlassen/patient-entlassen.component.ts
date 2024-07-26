import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

/**
 * `PatientEntlassenComponent` ist eine Angular-Komponente, die als Bestätigungsdialog für das Entlassen eines Patienten dient.
 *
 * Diese Komponente wird in einem Dialog angezeigt und bietet zwei Optionen: Abbrechen oder Bestätigen.
 * Sie wird verwendet, um den Benutzer zu fragen, ob er den Entlassvorgang des Patienten bestätigen möchte.
 *
 * @component
 * @selector app-patient-entlassen
 * @templateUrl ./patient-entlassen.component.html
 * @styleUrls ./patient-entlassen.component.css
 */
@Component({
  selector: 'app-patient-entlassen',
  templateUrl: './patient-entlassen.component.html',
  styleUrl: './patient-entlassen.component.css'
})
export class PatientEntlassenComponent {
  /**
   * Erzeugt eine Instanz der `PatientEntlassenComponent`.
   *
   * @param dialogRef - Referenz auf den MatDialog, um den Dialog zu schließen.
   * @param data - Die Daten, die an den Dialog übergeben werden.
   */
  constructor(
    public dialogRef: MatDialogRef<PatientEntlassenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * Schließt den Dialog und gibt `false` zurück, um den Entlassvorgang abzubrechen.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Schließt den Dialog und gibt `true` zurück, um den Entlassvorgang zu bestätigen.
   */
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
