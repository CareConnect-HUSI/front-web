import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from './inventario-paciente/inventario-paciente.component';

const routes: Routes = [
  { path: 'inventario', component: InventarioComponent },
  { path: '', redirectTo: '/inventario', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
