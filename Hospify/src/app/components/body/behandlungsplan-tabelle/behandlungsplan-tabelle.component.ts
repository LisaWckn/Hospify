import {Component, Input} from '@angular/core';
import {Massnahme} from "../../../models/massnahme";

@Component({
  selector: 'app-behandlungsplan-tabelle',
  templateUrl: './behandlungsplan-tabelle.component.html',
  styleUrl: './behandlungsplan-tabelle.component.css'
})
export class BehandlungsplanTabelleComponent {
  displayedColumns: string[] = ['beschreibung', 'zeitpunkt', 'medikamentID', 'dosierung', 'arztNoetig'];

  @Input()
  massnahmen: Massnahme[] = [];

  getTimestampToLocaleFormat(date: Date){
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
      + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}
