import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {ProfileService} from "./profile.service";
@Injectable()
export class AuthGuardService implements CanActivate {
  finishedSurvey: Boolean = false;
  constructor(
    public auth: AuthService,
    public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }

}
