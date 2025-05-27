import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from  'src/app/auth.guard'

import { InventarioComponent } from './inventario-paciente/inventario-paciente.component';
import { VerPacientesComponent } from './ver-pacientes/ver-pacientes.component';

import { ListaEnfermerasComponent } from './nurses/lista-enfermeras/lista-enfermeras.component';
import { RegistroEnfermerasComponent } from './nurses/registro-enfermeras/registro-enfermeras.component';
import { InventarioTotalComponent } from './inventario-general/inventario-total/inventario-total.component';
import { RegistroInventarioComponent } from './inventario-general/registro-inventario/registro-inventario.component';
import { RegisterPatientComponent } from './patients/register-patient/register-patient.component';
import { PatientInfoComponent } from './patients/patient-info/patient-info.component';
import { NursesAssignmentComponent } from './nurses/nurses-assignment/nurses-assignment.component';
import { StockComponent } from './inventory/stock/stock.component';
import { LoginComponent } from './componentTools/login/login.component';
import { MedInfoComponent } from './inventory/med-info/med-info.component';
import { PatientsListComponent } from './patients/patients-list/patients-list.component';
import { CronogramaComponent } from './inventory/cronograma/cronograma.component';
import { AsignarPacientesComponent } from './assignment/asignar-pacientes/asignar-pacientes.component';
import { AsignarEnfermerasComponent } from './assignment/asignar-enfermeras/asignar-enfermeras.component';
import { DetalleAsignacionComponent } from './nurses/detalle-asignacion/detalle-asignacion.component';
import { TreatmentsComponent } from './inventory/treatments/treatments.component';
import { PageNotFoundComponent } from './not-found/page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'cronograma', component: CronogramaComponent, canActivate: [AuthGuard] },
  { path: 'registro-pacientes', component: RegisterPatientComponent, canActivate: [AuthGuard] },
  { path: 'pacientes/:id', component: PatientInfoComponent, canActivate: [AuthGuard]},
  { path: 'nurses-assignment/:id', component: NursesAssignmentComponent, canActivate: [AuthGuard]},
  { path: 'inventario-paciente/:id', component: StockComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'medicamento', component: MedInfoComponent, canActivate: [AuthGuard]},
  {path: 'pacientes', component: PatientsListComponent, canActivate: [AuthGuard]},
  { path: 'inventario', component: InventarioComponent, canActivate: [AuthGuard]},
  { path: 'asignar-pacientes', component: AsignarPacientesComponent, canActivate: [AuthGuard] },
  { path: 'asignar-enfermeras', component: AsignarEnfermerasComponent, canActivate: [AuthGuard] },
  { path: 'pacientes', component: VerPacientesComponent, canActivate: [AuthGuard] },
  { path: 'inventario-total', component: InventarioTotalComponent, canActivate: [AuthGuard] },
  { path: 'registro-inventario', component: RegistroInventarioComponent, canActivate: [AuthGuard] },
  { path: 'lista-enfermeras', component: ListaEnfermerasComponent, canActivate: [AuthGuard]},
  { path: 'registro-enfermeras', component: RegistroEnfermerasComponent, canActivate: [AuthGuard]},
  { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'detalle-asignacion', component: DetalleAsignacionComponent, canActivate: [AuthGuard] },
  { path: 'treatments/:id', component: TreatmentsComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

