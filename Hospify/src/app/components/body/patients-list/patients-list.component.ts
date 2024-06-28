import {Component, OnInit} from '@angular/core';
import {DummyMethods} from "../../../services/dummyMethods";
import {Router} from "@angular/router";
import {Patient} from "../../../models/patient";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {Stay} from "../../../models/stay";

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit{
  displayedColumns: string[] = ['patientenID', 'name', 'geschlecht', 'geburtsdatum', 'kontakttelefon' ,'krankenversicherungsnummer'];
  dataSource : Patient[] = [];
  loading: boolean = true; // Initial auf true setzen
  stays : Stay[] = [];

  constructor(private router: Router, private sqlQueriesService: SqlQueriesService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  async loadPatients() {
    try {
      this.dataSource = await this.sqlQueriesService.getAllPresentPatients();
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      this.loading = false; // Ladezustand auf false setzen, wenn Daten geladen wurden
    }
  }

  clickRow(row: any) {
    this.router.navigate(["patient/", row.patientenID]);
  }

  clickAddPatientButton() {
    this.router.navigate(["add-patient"]);
  }
}
