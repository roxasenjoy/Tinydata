import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {GET_COMPANIES_INFORMATION} from '../../graphql';
import {Apollo} from 'apollo-angular';

@Injectable()
export class EntrepriseService {
  constructor(
    private apollo: Apollo,
    private GET_COMPANIES_INFORMATION: GET_COMPANIES_INFORMATION,
  ) {}

  getCompanies(idCompany: any): Observable<any> {
    return this.GET_COMPANIES_INFORMATION.watch({
        idCompany,
    },
    {
      fetchPolicy: 'network-only' 
    }).valueChanges;
  }

}
