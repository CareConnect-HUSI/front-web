import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';

const routes: Routes = [
  { path: 'registro-pacientes', component: RegisterPatientComponent },
  { path: 'paciente', component: PatientInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
