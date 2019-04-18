import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { ResponseDate } from './../models/ResponseData';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private apiServerUrl: string;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth
  ) {
    this.apiServerUrl = environment.apiServerUrl;
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
      })
      .catch(err => {
        console.log(err);
      });
  }

  async updateSignInInfo(): Promise<ResponseDate> {

    const idToken: string = await this.afAuth.auth.currentUser.getIdToken(true);
    const httpResData = await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
      headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise();

    return new ResponseDate(httpResData);
  }

  signOut() {
    this.gplus.disconnect();
    this.afAuth.auth.signOut();
  }

}
