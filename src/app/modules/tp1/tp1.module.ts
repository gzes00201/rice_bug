import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tp1Component } from './tp1.component';
import { Tp1HomeComponent } from './tp1-home/tp1-home.component';
import { Tp1RoutingModule } from './tp1-routing.module';



@NgModule({
  declarations: [
    Tp1Component,
    Tp1HomeComponent
  ],
  imports: [
    CommonModule,
    Tp1RoutingModule
  ]
})
export class Tp1Module { }
