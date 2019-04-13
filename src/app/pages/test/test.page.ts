import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  user: TestUser;

  constructor(
    private platform: Platform,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

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

        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email
        };

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
        this.user = {
          email: res.user.email,
          uid: res.user.uid
        };
        console.log(res);
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

interface TestUser {
  uid: string;
  email: string;
}
