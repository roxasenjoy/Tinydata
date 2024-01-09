import {Apollo} from 'apollo-angular';
import {FetchResult} from '@apollo/client/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { JwtService } from './jwt.service';

import {
  FORGOTPWD_USER_MUTATION,
  RESETPWD_USER_MUTATION,
  SIGNIN_USER_MUTATION,
  SIGNUP_TINYDATA_USER_MUTATION,
  LOGIN,
  LOGIN_TINYDATA,
  GET_COMPANIES_NAME,
  INITIALIZE_ACCOUNT,
  GET_USER_IS_SUPER_ADMIN,
  GET_USER_IS_SUPER_ADMIN_CLIENT
} from '../../graphql';


import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private apollo: Apollo,
    private router: Router,
  ) {}


  login(user: User): Observable<FetchResult<User>> {
    return this.apollo.mutate({
      mutation: SIGNIN_USER_MUTATION,
      variables: {
        login: user.login,
        password: user.password,
      }
    });
  }

  onBoardingLogin(loginn: any, passwordd: any): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN,
      variables: {
        login: loginn,
        password: passwordd
      }
    });
  }

  onBoardingLoginTinydata(loginn: any, passwordd: any, passwordRemember = false): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_TINYDATA,
      variables: {
        login: loginn,
        password: passwordd,
        passwordRemember,
      }
    });
  }

  forgotPwd(user: User): Observable<FetchResult<User>> {
    return this.apollo.mutate({
      mutation: FORGOTPWD_USER_MUTATION,
      variables: {
        email: user.email
      }
    });
  }

  resetPwd(user: User): Observable<FetchResult<User>> {
    return this.apollo.mutate({
      mutation: RESETPWD_USER_MUTATION,
      variables: {
        email: user.email,
        validationCode: user.resetPasswordCode,
        password: user.password,
      }
    });
  }

  setAuth(token : string) {
    this.jwtService.saveToken(token);
  }

  isAuthenticated() {
    if (!this.jwtService.getToken()) {
      return false;
    }
    return true;
  }

  logOut() {
    this.jwtService.destroyToken();
    this.router.navigateByUrl('/home');
  }

  getCompanies(joinCompany: boolean = false): Observable<any> {
    return this.apollo.query({
      query: GET_COMPANIES_NAME,
      variables: {
        joinCompany
      }
    });
  }

  checkUserIsSuperAdminClient(): Observable<any>{
    return this.apollo.query({
      query: GET_USER_IS_SUPER_ADMIN_CLIENT,
    });
  }

  signUpTinydata(params : any): Observable<FetchResult<User>> {
    return this.apollo.mutate({
      mutation: SIGNUP_TINYDATA_USER_MUTATION,
      variables: {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        cgu: params.cgu,
      }
    });
  }

  initializeAccount(oldPassword:string, newPassword:string): Observable<FetchResult<User>> {
    return this.apollo.mutate({
      mutation: INITIALIZE_ACCOUNT,
      variables: {
        oldPassword,
        newPassword
      }
    });
  }
}
