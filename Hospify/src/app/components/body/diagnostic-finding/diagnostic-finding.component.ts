import {Component, Input} from '@angular/core';
import {DiagnosticFindings} from "../../../models/diagnostic-findings";

@Component({
  selector: 'app-diagnostic-finding',
  templateUrl: './diagnostic-finding.component.html',
  styleUrl: './diagnostic-finding.component.css'
})
export class DiagnosticFindingComponent {
  @Input()
  diagnosticFinding: DiagnosticFindings = {befundID: 0, latName:"", beschreibung: "", chronisch: false};
}
