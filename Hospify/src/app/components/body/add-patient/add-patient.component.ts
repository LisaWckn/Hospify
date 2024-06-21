import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit{
  newPatient: boolean = true;

  ngOnInit() {
    this.newPatient = true; // Standardwert auf 'true' setzen
  }
}
