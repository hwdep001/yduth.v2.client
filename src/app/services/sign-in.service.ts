import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  user: User;

  constructor(
    private platform: Platform,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth
  ) { }

  signIn() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  nativeGoogleLogin() {

    this.gplus.login({
      'webClientId': environment.webClientId,
      'offline': false,
      'scopes': 'profile email'
    }).then(provider => {

      console.log(provider);

      this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(provider.idToken)
      ).then(firebaseUser => {
        console.log(firebaseUser);

        this.user = new User();
        this.user.uid = firebaseUser.uid;
        this.user.email = firebaseUser.email;

      }).catch(err => {
        console.log(err);
      });

    }).catch(err => {
      console.log(err);
    });
  }

  webGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then(res => {
        console.log(res);

        this.user = new User();
        this.user.uid = res.user.uid;
        this.user.email = res.user.email;
      })
      .catch(err => {
        console.log(err);
      });
  }

  signOut() {
    this.gplus.disconnect();
    this.afAuth.auth.signOut()
      .then(() => {
        console.log('sign out!!');
        this.user = null;
      });
  }

}
