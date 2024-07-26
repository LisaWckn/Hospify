import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Operation} from "../../../models/operation";
import {Mitarbeiter} from "../../../models/mitarbeiter";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {Komplikation} from "../../../models/komplikation";

/**
 * `OperationenTabelleComponent` zeigt eine Tabelle mit Operationen an, einschließlich Details zu Chirurgen und dem Erfolg der Operationen.
 *
 * Diese Komponente rendert eine Tabelle, die eine Liste von Operationen anzeigt. Für jede Operation wird der Zeitraum, der Chirurg und der Erfolg angezeigt.
 * Die Informationen zu Chirurgen und dem Erfolg der Operationen werden dynamisch geladen und aufbereitet.
 *
 * @component
 * @selector app-operationen-tabelle
 * @templateUrl ./operationen-tabelle.component.html
 * @styleUrls ./operationen-tabelle.component.css
 */
@Component({
  selector: 'app-operationen-tabelle',
  templateUrl: './operationen-tabelle.component.html',
  styleUrl: './operationen-tabelle.component.css'
})
export class OperationenTabelleComponent implements OnChanges{
  displayedColumns: string[] = ['id', 'zeitraum', 'chirurg', 'ursache', 'erfolgreich'];

  @Input()
  operationen: Operation[] = [];

  chirurgen : {opID: number, chirurg: Mitarbeiter}[] = [];
  erfolgreich: {opID: number, erfolg: boolean}[] = [];

  /**
   * Erzeugt eine Instanz der `OperationenTabelleComponent`.
   *
   * @param sqlQueryService - Der Dienst zum Abrufen von Daten über SQL-Abfragen.
   */
  constructor(private sqlQueryService: SqlQueriesService) {
  }

  /**
   * Wird aufgerufen, wenn sich die Eingabewerte ändern. Lädt die Chirurgen und den Erfolg der Operationen neu.
   *
   * @param changes - Die Änderungen an den Eingabewerten.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.chirurgen = [];
    this.erfolgreich = [];
    if (this.operationen) {
      this.loadChirurgen();
      this.loadErfolg();
    }
  }

  /**
   * Lädt die Chirurgen für jede Operation basierend auf deren ID.
   */
  async loadChirurgen(){
    for(let op of this.operationen){
      try{
        let mitarbeiter : Mitarbeiter[] = await this.sqlQueryService.getMitarbeiterByOpID(op.opID!);
        let chirurg = mitarbeiter[0];
        for(let m of mitarbeiter){
          if(m.arztnummer != null){
            chirurg = m;
          }
        }
        this.chirurgen.push({opID: op.opID!, chirurg: chirurg});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  /**
   * Lädt den Erfolg jeder Operation basierend auf deren ID.
   */
  async loadErfolg(){
    for(let op of this.operationen){
      try{
        let komplikationen : Komplikation[] = await this.sqlQueryService.getAllKomplikationenByOpID(op.opID!);
        let erfolg = true;
        for(let komp of komplikationen){
          if(komp.lebensbedrohlich){
            erfolg = false;
          }
        }
        this.erfolgreich.push({opID: op.opID!, erfolg: erfolg});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  /**
   * Gibt den Zeitraum der Operation als formatierte Zeichenkette zurück.
   *
   * @param op - Die Operation, deren Zeitraum zurückgegeben werden soll.
   * @return {string} Der formatierte Zeitraum der Operation.
   */
  getOpZeitraum(op: Operation){
    if(op.endzeit != undefined){
      return op.startzeit.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
        + op.startzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        + " - " + op.endzeit.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
        + op.endzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }else{
      return op.startzeit.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
        + op.startzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        + " - in Arbeit";
    }

  }

  /**
   * Gibt den Chirurgen für eine gegebene Operation zurück.
   *
   * @param op - Die Operation, deren Chirurg zurückgegeben werden soll.
   * @return {string} Der Name des Chirurgen.
   */
  getChirurg(op : Operation){
    for(let elem of this.chirurgen){
      if(elem.opID == op.opID){
        return elem.chirurg.name;
      }
    }
    return "";
  }

  /**
   * Gibt den Erfolg einer gegebenen Operation zurück.
   *
   * @param op - Die Operation, deren Erfolg zurückgegeben werden soll.
   * @return {boolean} Der Erfolg der Operation.
   */
  getErfolg(op: Operation){
    for(let  elem of this.erfolgreich){
      if(elem.opID == op.opID){
        return elem.erfolg;
      }
    }
    return false;
  }
}
