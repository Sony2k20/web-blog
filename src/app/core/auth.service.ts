import { Injectable, OnInit } from '@angular/core';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SnackbarComponent } from '../shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnInit {
  authState: any = null

  constructor(
    public auth: AngularFireAuth,
    private snackbarService: SnackbarComponent,
    ) {
    this.auth.authState.subscribe(res => this.authState = res)

    this.auth.onAuthStateChanged((user) => {
      let userSessionTimeout = null;
      if (user === null && userSessionTimeout) {
        clearTimeout(userSessionTimeout);
        userSessionTimeout = null;
      } else {
        user?.getIdTokenResult().then((idTokenResult) => {
          const authTime = idTokenResult.claims['auth_time'] * 1000;
          const sessionDurationInMilliseconds = 120 * 60 * 1000; // 120 min
          const expirationInMilliseconds = sessionDurationInMilliseconds - (Date.now() - authTime);
          userSessionTimeout = setTimeout(() => this.auth.signOut(), expirationInMilliseconds);
        });
      }
    });

  }

  ngOnInit(): void {

  }


  login() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        this.snackbarService.openSnackBar("Login erfolgreich", "", "green-font");
      }).catch((error) => {
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(error)
      });
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.snackbarService.openSnackBar("Logout erfolgreich", "", "green-font");
    }).catch((error) => {
      console.log(error)
    });
  }

  getUsername(){
    const auth = getAuth();
    console.log(auth.currentUser?.displayName)
    return auth.currentUser?.displayName;
  }

}
