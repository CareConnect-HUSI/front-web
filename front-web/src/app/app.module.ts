import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentTools/header/header.component';
import { AsignarEnfermerasComponent } from './asignar-enfermeras/asignar-enfermeras.component';

import { InventarioComponent } from './inventario-paciente/inventario-paciente.component';

import { VerPacientesComponent } from './ver-pacientes/ver-pacientes.component';
import { LoginComponent } from './componentTools/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';

import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './nurses/nurses-assignment/nurses-assignment.component';
import { StockComponent } from './inventory/stock/stock.component';
import { MedInfoComponent } from './inventory/med-info/med-info.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsignarEnfermerasComponent,
    InventarioComponent,
    VerPacientesComponent,
    LoginComponent,
    RegisterPatientComponent,
    PatientInfoComponent,
    NursesAssignmentComponent,
    StockComponent,
    MedInfoComponent,
    PatientsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
