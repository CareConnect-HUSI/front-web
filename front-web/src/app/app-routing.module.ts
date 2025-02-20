import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './patients/nurses-assignment/nurses-assignment.component';

const routes: Routes = [
  { path: 'registro-pacientes', component: RegisterPatientComponent },
  { path: 'paciente', component: PatientInfoComponent},
  { path: 'assignment', component: NursesAssignmentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
