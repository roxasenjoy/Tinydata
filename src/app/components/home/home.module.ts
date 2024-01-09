import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { JwtService } from '../../shared/services/jwt.service';
import {AngularMaterialModule} from '../../angular-material.module';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AngularMaterialModule, LottieModule],
  declarations: [HomeComponent],
  providers: [AuthService, JwtService]
})
export class HomeModule {}
