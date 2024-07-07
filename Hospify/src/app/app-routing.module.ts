import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PatientsListComponent} from "./components/body/patients-list/patients-list.component";
import {PatientDetailsComponent} from "./components/body/patient-details/patient-details.component";
import {AddPatientComponent} from "./components/body/admitting-patient/add-patient/add-patient.component";
import {NewOperationComponent} from "./components/body/new-operation/new-operation.component";

const routes: Routes = [
  {path:"", redirectTo:"/patients", pathMatch: "full"},
  {path:"patients", component: PatientsListComponent},
  {path:"add-patient", component: AddPatientComponent},
  {path:"patient/:id", component:PatientDetailsComponent},
  {path:"new-operation/:id", component: NewOperationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
