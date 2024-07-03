import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-patient-entlassen',
  templateUrl: './patient-entlassen.component.html',
  styleUrl: './patient-entlassen.component.css'
})
export class PatientEntlassenComponent {
  constructor(
    public dialogRef: MatDialogRef<PatientEntlassenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
