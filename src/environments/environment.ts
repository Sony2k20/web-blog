// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  adminUsers: ["daG4jJwPhQNP4Cmdm5KQBveoaJq1",],
  firebase: {
    projectId: 'weg-blog',
    appId: '1:548357614003:web:a41117aa696cf3998283c6',
    storageBucket: 'weg-blog.appspot.com',
	  databaseURL: "https://weg-blog-default-rtdb.firebaseio.com",
    apiKey: 'AIzaSyBvK7KxHgNEZ9K3CWGYPgIOQ_C0SuskOEY',
    authDomain: 'weg-blog.firebaseapp.com',
    messagingSenderId: '548357614003',
    measurementId: 'G-08MG26QPTV',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
