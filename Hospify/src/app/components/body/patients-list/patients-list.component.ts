import { Component } from '@angular/core';
import {DummyMethods} from "../../../services/dummyMethods";
import {Router} from "@angular/router";
import {Patient} from "../../../models/patient";

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent {
  displayedColumns: string[] = ['patientenID', 'name', 'geschlecht', 'geburtsdatum', 'kontakttelefon' ,'krankenversicherungsnummer'];
  dataSource : Patient[] = DummyMethods.getAllPatients();

  constructor(private router: Router) {}

  clickRow(row: any) {
    this.router.navigate(["patient/", row.patientenID]);
  }
}
