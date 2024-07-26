import {Component, Input} from '@angular/core';
import {DiagnosticFindings} from "../../../models/diagnostic-findings";

/**
 * Komponente zur Darstellung eines diagnostischen Befunds.
 *
 * Diese Komponente zeigt die Details eines Befunds an. Die Details werden
 * über eine Eingabe (`@Input`) von außen bereitgestellt.
 *
 * @component
 * @selector app-diagnostic-finding
 * @templateUrl ./diagnostic-finding.component.html
 * @styleUrls ./diagnostic-finding.component.css
 */
@Component({
  selector: 'app-diagnostic-finding',
  templateUrl: './diagnostic-finding.component.html',
  styleUrl: './diagnostic-finding.component.css'
})
export class DiagnosticFindingComponent {
  @Input()
  diagnosticFinding: DiagnosticFindings = {befundID: 0, latName:"", beschreibung: "", chronisch: false};
}
