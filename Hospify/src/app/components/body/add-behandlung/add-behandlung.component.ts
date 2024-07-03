import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Massnahme} from "../../../models/massnahme";
import {SqlQueriesService} from "../../../services/sql-queries.service";

@Component({
  selector: 'app-add-behandlung',
  templateUrl: './add-behandlung.component.html',
  styleUrl: './add-behandlung.component.css'
})
export class AddBehandlungComponent implements OnInit{

  selectedMassnahmen : Massnahme[] = [];

  currentlySelectedMassnahme : number = 1;

  allMassnahmen : Massnahme[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddBehandlungComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sqlQueriesService: SqlQueriesService
  ) {}

  ngOnInit(){
    this.loadMassnahmen();
  }

  async loadMassnahmen(){
    try{
      this.allMassnahmen = await this.sqlQueriesService.getAllMassnahmen();
    }catch (error){
      console.error("Error loading all massnahmen:", error);
    }
  }

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

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(this.selectedMassnahmen);
  }
}
