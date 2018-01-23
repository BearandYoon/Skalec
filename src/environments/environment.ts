// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDSW3ypSxLFrTl2aL9Bx6NZ2U1CQSVcZdg',
    authDomain: 'framework-dev.firebaseapp.com',
    databaseURL: 'https://framework-dev.firebaseio.com',
    projectId: 'framework-dev',
    storageBucket: 'framework-dev.appspot.com',
    messagingSenderId: '1084724587881'
  }
};
