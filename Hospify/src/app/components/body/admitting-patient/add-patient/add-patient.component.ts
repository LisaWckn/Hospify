import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent{
  newPatient: boolean = true;
}
