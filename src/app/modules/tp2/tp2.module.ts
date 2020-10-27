import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tp2Component } from './tp2.component';
import { Tp2HomeComponent } from './tp2-home/tp2-home.component';
import { Tp2RoutingModule } from './tp2-routing.module';



@NgModule({
  declarations: [
    Tp2Component,
    Tp2HomeComponent
  ],
  imports: [
    CommonModule,
    Tp2RoutingModule
  ]
})
export class Tp2Module { }
