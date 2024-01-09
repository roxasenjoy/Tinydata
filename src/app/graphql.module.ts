import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, ApolloLink} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { environment } from 'src/environments/environment';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AuthService } from './shared/services/auth.service';


const uri = environment.api_url; // <-- add the URL of the GraphQL server here
let authService: AuthService;
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('jwtToken');
    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
  });

  const error = onError((error:any) => {
    if (error && error.networkError && error.networkError.status === 401) {
      authService.logOut()
    }
  });

  const link = ApolloLink.from([error, basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  providers: [
    AuthService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
  constructor(private service: AuthService) {
    authService = service;
  }
}
