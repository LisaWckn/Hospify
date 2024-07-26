import {Component, Input} from '@angular/core';
import {Massnahme} from "../../../models/massnahme";

/**
 * Komponente zur Darstellung einer Tabelle von Behandlungsplänen.
 *
 * Diese Komponente zeigt eine Tabelle an, die eine Liste von Maßnahmen im Behandlungsplan darstellt.
 * Die Spalten der Tabelle umfassen Beschreibung, Zeitpunkt, Medikamenten-ID, Dosierung und ob ein Arzt notwendig ist.
 *
 * @component
 * @selector app-behandlungsplan-tabelle
 * @templateUrl ./behandlungsplan-tabelle.component.html
 * @styleUrls ./behandlungsplan-tabelle.component.css
 */
@Component({
  selector: 'app-behandlungsplan-tabelle',
  templateUrl: './behandlungsplan-tabelle.component.html',
  styleUrl: './behandlungsplan-tabelle.component.css'
})
export class BehandlungsplanTabelleComponent {
  displayedColumns: string[] = ['beschreibung', 'zeitpunkt', 'medikamentID', 'dosierung', 'arztNoetig'];

  @Input()
  massnahmen: Massnahme[] = [];

  /**
   * Formatiert ein Datum in ein lokalisiertes Datum-Zeit-Format.
   *
   * @param {Date} date - Das Datum, das formatiert werden soll.
   * @return {string} Der formatierte Datums- und Zeitstring im Format "TT.MM.JJJJ HH:MM".
   */
  getTimestampToLocaleFormat(date: Date){
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
      + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}
