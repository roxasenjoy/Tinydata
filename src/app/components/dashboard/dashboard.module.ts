import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../shared/services/dashboard.service';
import { SharedModule } from '../../shared/shared.module';

import {BrowserModule} from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularMaterialModule} from '../../angular-material.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
  ],
  declarations: [
    DashboardComponent,
  ],
  exports: [DashboardComponent],
  providers: [
    DashboardService
  ]
})
export class DashboardModule {}
