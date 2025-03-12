import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentTools/header/header.component';
import { MatPaginatorModule } from '@angular/material/paginator';

import { InventarioComponent } from './inventario-paciente/inventario-paciente.component';

import { VerPacientesComponent } from './ver-pacientes/ver-pacientes.component';
import { LoginComponent } from './componentTools/login/login.component';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';

import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './nurses/nurses-assignment/nurses-assignment.component';
import { StockComponent } from './inventory/stock/stock.component';
import { MedInfoComponent } from './inventory/med-info/med-info.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';
import { CronogramaComponent } from './inventory/cronograma/cronograma.component';
import { AsignarPacientesComponent } from './assignment/asignar-pacientes/asignar-pacientes.component';
import { AsignarEnfermerasComponent } from './assignment/asignar-enfermeras/asignar-enfermeras.component';
import { InventarioTotalComponent } from './inventario-general/inventario-total/inventario-total.component';
import { RegistroInventarioComponent } from './inventario-general/registro-inventario/registro-inventario.component';
import { InfoMedicamentoComponent } from './inventario-general/info-medicamento/info-medicamento.component';
import { RegistroEnfermerasComponent } from './nurses/registro-enfermeras/registro-enfermeras.component';
import { ListaEnfermerasComponent } from './nurses/lista-enfermeras/lista-enfermeras.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InventarioComponent,
    VerPacientesComponent,
    LoginComponent,
    RegisterPatientComponent,
    PatientInfoComponent,
    NursesAssignmentComponent,
    StockComponent,
    MedInfoComponent,
    PatientsListComponent,
    CronogramaComponent,
    AsignarPacientesComponent,
    AsignarEnfermerasComponent,
    InventarioTotalComponent,
    RegistroInventarioComponent,
    InfoMedicamentoComponent,
    RegistroEnfermerasComponent,
    ListaEnfermerasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
