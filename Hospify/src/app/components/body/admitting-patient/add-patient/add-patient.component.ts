import { Component, OnInit} from '@angular/core';
import {Patient} from "../../../../models/patient";
import {DummyMethods} from "../../../../services/dummyMethods";

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent implements OnInit{
  newPatient: boolean = false;

  ngOnInit() {
    this.newPatient = false; // Standardwert auf 'true' setzen
  }
}
