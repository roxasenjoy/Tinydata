import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {GET_USERS, RESEARCH_USERS} from '../../graphql';
import {Apollo} from 'apollo-angular';


@Injectable()
export class FilterService {
  constructor(
    private apollo: Apollo,
  ) {}


  getUsers(idAccount: any, searchText: any): Observable<any> {
    return this.apollo.query({
      query: GET_USERS,
      variables: {
        idAccount,
        searchText
      }
    });
  }

  researchUsers(value: string): Observable<any>{
    return this.apollo.query({
      query: RESEARCH_USERS,
      variables: {
        value
      }
    })
  }
}
