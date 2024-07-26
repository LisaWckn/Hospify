import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Patient} from "../../../models/patient";
import {SqlQueriesService} from "../../../services/sql-queries.service";

/**
 * `PatientsListComponent` ist eine Angular-Komponente, die eine Liste von Patienten anzeigt.
 *
 * Diese Komponente zeigt eine Tabelle mit Patienteninformationen und ermöglicht das Navigieren zu detaillierteren Patientendaten
 * sowie das Hinzufügen neuer Patienten.
 *
 * @component
 * @selector app-patients-list
 * @templateUrl ./patients-list.component.html
 * @styleUrls ./patients-list.component.css
 */
@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css'
})
export class PatientsListComponent implements OnInit{
  displayedColumns: string[] = ['patientenID', 'name', 'geschlecht', 'geburtsdatum', 'kontakttelefon' ,'krankenversicherungsnummer'];
  dataSource : Patient[] = [];
  loading: boolean = true; // Initial auf true setzen

  /**
   * Erzeugt eine Instanz der `PatientsListComponent`.
   *
   * @param router - Der Angular-Router für die Navigation.
   * @param sqlQueriesService - Der Dienst für SQL-Abfragen zur Patientenliste.
   */
  constructor(private router: Router, private sqlQueriesService: SqlQueriesService) {}

  /**
   * Wird beim Initialisieren der Komponente aufgerufen.
   * Lädt die Patientenliste.
   */
  ngOnInit(): void {
    this.loadPatients();
  }

  /**
   * Lädt die Liste der aktuellen Patienten und aktualisiert die `dataSource`.
   * Setzt den `loading`-Status auf `false`, wenn die Daten geladen sind.
   */
  async loadPatients() {
    try {
      this.dataSource = await this.sqlQueriesService.getAllPresentPatients();
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      this.loading = false; // Ladezustand auf false setzen, wenn Daten geladen wurden
    }
  }

  /**
   * Navigiert zur Detailansicht des Patienten beim Klick auf eine Zeile.
   *
   * @param row - Die Zeile, die geklickt wurde, enthält die Patienten-ID.
   */
  clickRow(row: any) {
    this.router.navigate(["patient/", row.patientenID]);
  }

  /**
   * Navigiert zur Seite zum Hinzufügen eines neuen Patienten.
   */
  clickAddPatientButton() {
    this.router.navigate(["add-patient"]);
  }
}
