import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Behandlung} from "../../../models/behandlung";
import {Massnahme} from "../../../models/massnahme";
import {Mitarbeiter} from "../../../models/mitarbeiter";
import {SqlQueriesService} from "../../../services/sql-queries.service";

/**
 * Komponente zur Darstellung einer Tabelle von Behandlungen.
 *
 * Diese Komponente zeigt eine Tabelle an, die eine Liste von Behandlungen darstellt.
 * Für jede Behandlung werden die entsprechenden Maßnahmen und Mitarbeiter angezeigt.
 * Die Spalten der Tabelle umfassen Maßnahmen, Zeitpunkt und Mitarbeiter.
 *
 * @component
 * @selector app-behandlungen-tabelle
 * @templateUrl ./behandlungen-tabelle.component.html
 * @styleUrls ./behandlungen-tabelle.component.css
 */
@Component({
  selector: 'app-behandlungen-tabelle',
  templateUrl: './behandlungen-tabelle.component.html',
  styleUrl: './behandlungen-tabelle.component.css'
})
export class BehandlungenTabelleComponent implements OnChanges{
  displayedColumns: string[] = ['massnahmen', 'zeitpunkt', 'mitarbeiter'];

  @Input()
  behandlungen: Behandlung[] = [];

  massnahmen: {behandlungsID: number, massnahme: Massnahme[]}[] = [];
  mitarbeiter: {behandlungsID: number, mitarbeiter: Mitarbeiter[]}[] = [];

  /**
   * Erzeugt eine neue Instanz der `BehandlungenTabelleComponent`-Klasse.
   *
   * @param {SqlQueriesService} sqlQueryService - Der Dienst zum Abrufen von Daten aus der Datenbank.
   */
  constructor(private sqlQueryService: SqlQueriesService) {
  }

  /**
   * Wird aufgerufen, wenn sich die Eingabewerte ändern.
   *
   * Lädt die Maßnahmen und Mitarbeiter für die Behandlungen, wenn sich die Eingaben ändern.
   *
   * @param {SimpleChanges} changes - Die Änderungen der Eingabewerte.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.massnahmen = [];
    this.mitarbeiter = [];
    if (this.behandlungen) {
      this.loadMassnahmen();
      this.loadMitarbeiter();
    }
  }

  /**
   * Lädt die Maßnahmen für jede Behandlung.
   *
   * Für jede Behandlung wird die Liste der zugehörigen Maßnahmen abgerufen und gespeichert.
   */
  async loadMassnahmen(){
    for(let behandlung of this.behandlungen){
      try{
        let massnahmen = await this.sqlQueryService.getMassnahmenByBehandlungsID(behandlung.behandlungsID);
        this.massnahmen.push({behandlungsID: behandlung.behandlungsID, massnahme: massnahmen});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  /**
   * Lädt die Mitarbeiter für jede Behandlung.
   *
   * Für jede Behandlung wird die Liste der zugehörigen Mitarbeiter abgerufen und gespeichert.
   */
  async loadMitarbeiter(){
    for(let behandlung of this.behandlungen){
      try{
        let mitarbeiter = await this.sqlQueryService.getMitarbeiterByBehandlungsID(behandlung.behandlungsID);
        this.mitarbeiter.push({behandlungsID: behandlung.behandlungsID, mitarbeiter: mitarbeiter});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  /**
   * Formatiert ein Datum in ein lokalisiertes Datum-Zeit-Format.
   * @param {Date} date - Das Datum, das formatiert werden soll.
   * @return {string} Der formatierte Datums- und Zeitstring im Format "TT.MM.JJJJ HH:MM".
   */
  getTimestampToLocaleFormat(date: Date){
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
      + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}
