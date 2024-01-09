import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {JwtService} from '../../shared/services/jwt.service';


import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { SubmitPasswordComponent } from './submit-password/submit-password.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AuthComponent, ForgotPasswordComponent, ResetPasswordComponent, CreatePasswordComponent, SubmitPasswordComponent],
  providers: [AuthService, JwtService, Apollo, HttpLink],
})
export class AuthModule { }
