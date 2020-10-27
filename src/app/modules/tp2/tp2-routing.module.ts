import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Tp2HomeComponent } from './tp2-home/tp2-home.component';

const routes: Routes = [
  {path: 'tp', component: Tp2HomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tp2RoutingModule { }
