import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Behandlung} from "../../../models/behandlung";
import {Massnahme} from "../../../models/massnahme";
import {Mitarbeiter} from "../../../models/mitarbeiter";
import {SqlQueriesService} from "../../../services/sql-queries.service";

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

  constructor(private sqlQueryService: SqlQueriesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.massnahmen = [];
    this.mitarbeiter = [];
    if (this.behandlungen) {
      this.loadMassnahmen();
      this.loadMitarbeiter();
    }
  }

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

  getTimestampToLocaleFormat(date: Date){
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
      + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
}
