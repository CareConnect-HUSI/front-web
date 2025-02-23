import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignarEnfermerasComponent } from './asignar-enfermeras/asignar-enfermeras.component';


const routes: Routes = [
  { path: 'asignar', component: AsignarEnfermerasComponent },
  { path: '', redirectTo: '/asignar', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
