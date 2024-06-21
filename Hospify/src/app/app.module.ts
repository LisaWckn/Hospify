import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderLinesComponent } from './components/header/header-lines/header-lines.component';
import { HeaderTitleComponent } from './components/header/header-title/header-title.component';
import { PatientsListComponent } from './components/body/patients-list/patients-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatCard} from "@angular/material/card";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import { PatientDetailsComponent } from './components/body/patient-details/patient-details.component';
import { IconTextComponent } from './components/icon-text/icon-text.component';
import {MatIcon} from "@angular/material/icon";
import { DiagnosticFindingComponent } from './components/body/diagnostic-finding/diagnostic-finding.component';
import {MatIconButton} from "@angular/material/button";
import { AddPatientComponent } from './components/body/admitting-patient/add-patient/add-patient.component';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import { AdmittingExistingPatientComponent } from './components/body/admitting-patient/admitting-existing-patient/admitting-existing-patient.component';
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    HeaderLinesComponent,
    HeaderTitleComponent,
    PatientsListComponent,
    PatientDetailsComponent,
    IconTextComponent,
    DiagnosticFindingComponent,
    AddPatientComponent,
    AdmittingExistingPatientComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCard,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatIcon,
    MatIconButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
