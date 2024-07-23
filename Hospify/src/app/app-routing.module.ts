import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientsListComponent } from "./components/body/patients-list/patients-list.component";
import { PatientDetailsComponent } from "./components/body/patient-details/patient-details.component";
import { AddPatientComponent } from "./components/body/admitting-patient/add-patient/add-patient.component";
import { NewOperationComponent } from "./components/body/new-operation/new-operation.component";

/**
 * Definiert die Routen für die Anwendung.
 * @type {Routes}
 */
const routes: Routes = [
  { path: "", redirectTo: "/patients", pathMatch: "full" }, // Standardroute, leitet zu /patients um
  { path: "patients", component: PatientsListComponent }, // Route zur Patientenliste
  { path: "add-patient", component: AddPatientComponent }, // Route zum Hinzufügen eines Patienten
  { path: "patient/:id", component: PatientDetailsComponent }, // Route zu den Patientendetails
  { path: "new-operation/:id", component: NewOperationComponent } // Route zur Erstellung einer neuen Operation für einen Patienten
];

/**
 * Das Routing-Modul der Anwendung.
 * Dieses Modul konfiguriert die RouterModule mit den definierten Routen
 * und exportiert RouterModule zur Verwendung in der Anwendung.
 *
 * @NgModule Dekorator kennzeichnet eine Klasse als Angular-Modul und konfiguriert
 * das Angular-Modulsystem.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
