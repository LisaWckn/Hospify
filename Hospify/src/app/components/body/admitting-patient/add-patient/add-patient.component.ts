import { Component, OnInit} from '@angular/core';

/**
 * Komponente zum Hinzufügen eines Patienten.
 *
 * Diese Komponente bietet die Möglichkeit, einen neuen Patienten hinzuzufügen.
 *
 * @component
 * @selector app-add-patient
 * @templateUrl ./add-patient.component.html
 * @styleUrls ./add-patient.component.scss
 */
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent{
  newPatient: boolean = true;
}
