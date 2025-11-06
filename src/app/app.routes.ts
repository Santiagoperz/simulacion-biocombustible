import { Routes } from '@angular/router';
import { SimuladorComponent } from './simulador/simulador';

export const routes: Routes = [
  { path: '', component: SimuladorComponent },
  { path: '**', redirectTo: '' } // <- por si entras a cualquier otra ruta
];
