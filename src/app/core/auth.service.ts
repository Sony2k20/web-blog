import { Injectable, OnInit } from '@angular/core';
import {
  signOut,
  signInWithPopup,
  authState,
  GoogleAuthProvider,
  getAuth,
  setPersistence,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements OnInit {
  authState: any = null

  constructor(public auth: AngularFireAuth) {
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
        const token = credential?.accessToken;
        const user = result.user;
        console.log(result.user.photoURL)
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
    }).catch((error) => {
    });
  }

  getUsername(){
    const auth = getAuth();
    console.log(auth.currentUser?.displayName)
    return auth.currentUser?.displayName;
  }

}
