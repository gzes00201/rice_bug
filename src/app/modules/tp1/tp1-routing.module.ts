import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Tp1HomeComponent } from './tp1-home/tp1-home.component';

const routes: Routes = [
  {path: 'tp', component: Tp1HomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tp1RoutingModule { }
