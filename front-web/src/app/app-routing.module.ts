import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './nurses/nurses-assignment/nurses-assignment.component';
import { StockComponent } from './inventory/stock/stock.component';
import { LoginComponent } from './componentTools/login/login.component';
import { MedInfoComponent } from './inventory/med-info/med-info.component';

const routes: Routes = [
  { path: 'registro-pacientes', component: RegisterPatientComponent },
  { path: 'paciente', component: PatientInfoComponent},
  { path: 'assignment', component: NursesAssignmentComponent},
  { path: 'inventario', component: StockComponent},
  { path: 'login', component: LoginComponent },
  { path: 'medicamento', component: MedInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

