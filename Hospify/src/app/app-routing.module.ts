import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientsListComponent} from "./components/body/patients-list/patients-list.component";
import {PatientDetailsComponent} from "./components/body/patient-details/patient-details.component";
import {AddPatientComponent} from "./components/body/add-patient/add-patient.component";

const routes: Routes = [
  {path:"", redirectTo:"/patients", pathMatch: "full"},
  {path:"patients", component: PatientsListComponent},
  {path:"add-patient", component: AddPatientComponent},
  {path:"patient/:id", component:PatientDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
