import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';

import { JwtService } from './jwt.service';

import {
  CurrentUserForProfile,
  verifyUserInformation,
  GET_USER_BY_ID,
  GET_COMPANY_NAME,
  updatePassword, GET_COMPANY_OBJECTIFS, GET_ALL_COMPANIES_NAMES
} from '../../graphql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  alreadyVisitedWelcomePageThatDay = false;


  constructor(
    private jwtService: JwtService,
    private apollo: Apollo,
    private GET_USER_BY_ID: GET_USER_BY_ID) {}

  /*
  * continueFlow: let graphQl onError middleware to handle outgoing request
  * in some cases we need to handle our error object with custom logic, we catch our error in our component
  * exp: streaming module
  * */
  getUser(payload = { handleError: true }): Observable<any> {
    return this.apollo.query({
      query: CurrentUserForProfile,
      variables: {
        handleError: payload.handleError
      }
    });
  }

  verifyUser(userId:any, value: any, type: any): Observable<any> {
    return this.apollo.mutate({
      mutation: verifyUserInformation,
      variables: {
        userId,
        value,
        type
      }
    });
  }

  updatePassword(oldPassword: any, newPassword: any): Observable<any> {
    return this.apollo.mutate({
      mutation: updatePassword,
      variables: {
        oldPassword,
        newPassword
      }
    });
  }

  // getUserById(id: any): Observable<any> {
  //   return this.apollo.query({
  //     query: GET_USER_BY_ID,
  //     variables: {
  //       id
  //     }
  //   });
  // }

  getUserById(
    id: any
  ): Observable<any> {
    return this.GET_USER_BY_ID.watch({
      id
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

  getAllCompaniesName(idCompany: any): Observable<any> {
    return this.apollo.query({
      query: GET_ALL_COMPANIES_NAMES,
      variables: {
        idCompany
      }
    });
  }

  getCompanyName(id: any): Observable<any> {
    return this.apollo.query({
      query: GET_COMPANY_NAME,
      variables: {
        id
      }
    });
  }

  getCompanyObjectifs(objectifsFilter: any): Observable<any> {
    return this.apollo.query({
      query: GET_COMPANY_OBJECTIFS,
      variables: {
        objectifsFilter
      }
    });
  }


}
