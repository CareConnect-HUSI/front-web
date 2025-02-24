import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerPacientesComponent } from './ver-pacientes/ver-pacientes.component';

import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './nurses/nurses-assignment/nurses-assignment.component';
import { StockComponent } from './inventory/stock/stock.component';
import { LoginComponent } from './componentTools/login/login.component';
import { MedInfoComponent } from './inventory/med-info/med-info.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';

const routes: Routes = [
  { path: 'registro-pacientes', component: RegisterPatientComponent },
  { path: 'paciente/id', component: PatientInfoComponent},
  { path: 'assignment', component: NursesAssignmentComponent},
  { path: 'inventario', component: StockComponent},
  { path: 'login', component: LoginComponent },
  { path: 'medicamento', component: MedInfoComponent},
  {path: 'pacientes', component: PatientsListComponent},
  { path: 'pacientes', component: VerPacientesComponent },
  { path: '', redirectTo: '/ver-pacientes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

