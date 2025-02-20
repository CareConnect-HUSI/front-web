import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentTools/header/header.component';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './patients/nurses-assignment/nurses-assignment.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterPatientComponent,
    PatientInfoComponent,
    NursesAssignmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
