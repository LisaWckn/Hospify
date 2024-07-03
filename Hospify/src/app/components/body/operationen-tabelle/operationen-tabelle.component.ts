import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Operation} from "../../../models/operation";
import {Mitarbeiter} from "../../../models/mitarbeiter";
import {SqlQueriesService} from "../../../services/sql-queries.service";
import {markAsyncChunksNonInitial} from "@angular-devkit/build-angular/src/tools/webpack/utils/async-chunks";
import {Komplikation} from "../../../models/komplikation";

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

  constructor(private sqlQueryService: SqlQueriesService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.chirurgen = [];
    this.erfolgreich = [];
    if (this.operationen) {
      console.log(this.operationen);
      this.loadChirurgen();
      this.loadErfolg();
    }
  }

  async loadChirurgen(){
    for(let op of this.operationen){
      try{
        let mitarbeiter : Mitarbeiter[] = await this.sqlQueryService.getMitarbeiterByOpID(op.opID);
        let chirurg = mitarbeiter[0];
        for(let m of mitarbeiter){
          if(m.arztnummer != null){
            chirurg = m;
          }
        }
        this.chirurgen.push({opID: op.opID, chirurg: chirurg});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  async loadErfolg(){
    for(let op of this.operationen){
      try{
        let komplikationen : Komplikation[] = await this.sqlQueryService.getAllKomplikationenByOpID(op.opID);
        let erfolg = true;
        for(let komp of komplikationen){
          if(komp.lebensbedrohlich){
            erfolg = false;
          }
        }
        this.erfolgreich.push({opID: op.opID, erfolg: erfolg});
      }catch (error) {
        console.error('Error loading patients:', error);
      }
    }
  }

  getOpZeitraum(op: Operation){
    return op.startzeit.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
      + op.startzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      + " - " + op.endzeit.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year:"numeric"}) + " "
    + op.endzeit.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  getChirurg(op : Operation){
    for(let elem of this.chirurgen){
      if(elem.opID == op.opID){
        return elem.chirurg.name;
      }
    }
    return "";
  }

  getErfolg(op: Operation){
    for(let  elem of this.erfolgreich){
      if(elem.opID == op.opID){
        return elem.erfolg;
      }
    }
    return false;
  }
}
