import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_TINYSUITE_TOKEN } from 'src/app/graphql';


@Injectable()
export class JwtService {

  constructor(
    private apollo: Apollo,
  ) {}

  getToken(): String {
    return window.localStorage['jwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.clear();
  }

  getTinysuiteToken(){
    return this.apollo.query({
      query: GET_TINYSUITE_TOKEN
    });
  }

}
