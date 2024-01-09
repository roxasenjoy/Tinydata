// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'http://localhost:8081/graphql',
  host: 'http://localhost:8081/',
  tinysuite: 'https://pp-admin.tiny-coaching.com/',
  timeout: 1000,
  firebase: {
    measurementId: 'G-S45YZG00BZ',
    apiKey: 'AIzaSyCfTn9FnAXoEcNd428W7C018A2nFpKwrpg',
    authDomain: 'tiny-591d8.firebaseapp.com',
    databaseURL: 'https://tiny-591d8.firebaseio.com',
    projectId: 'tiny-591d8',
    storageBucket: 'tiny-591d8.appspot.com',
    messagingSenderId: '261407700243',
    appId: '1:261407700243:web:2868b146f22399896496e6'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
