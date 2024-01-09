import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GET_USER_ACCOUNT } from '../../graphql';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  // Envoie des données pour les parents
  private titlePage = new BehaviorSubject(' ');
  titlePage$ = this.titlePage.asObservable();

  constructor(
    private apollo: Apollo
    ) { }

 
  // Changer le nom des pages pour les settings
  changeData(titlePage: string) {
    this.titlePage.next(titlePage)
  }

  /*******************************
   *        Tous les comptes     *
   *******************************/
  getUserAccount(): Observable<any>{
    return this.apollo.query({
      query: GET_USER_ACCOUNT,
      variables: {
        
      }
    });
  }




}
