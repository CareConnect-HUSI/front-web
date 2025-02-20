import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';

const routes: Routes = [
  { path: 'pacientes', component: RegisterPatientComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
