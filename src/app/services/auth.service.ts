import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { ResponseDate } from './../models/ResponseData';
import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServerUrl: string;
  private user_: User = null;

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth
  ) {
    this.apiServerUrl = environment.apiServerUrl;
   }

  get user(): User {
    return this.user_;
  }

  get existUser(): boolean {
    return this.user_ == null ? false : true;
  }

  get uid(): string {
    return this.existUser ? this.user_.uid : null;
  }

  get email(): string {
    return this.existUser ? this.user_.email : null;
  }

  get googleDisplayName(): string {
    return this.existUser ? this.user_.googleDisplayName : null;
  }

  get googlePhotoUrl(): string {
    return this.existUser ? this.user_.googlePhotoUrl : null;
  }

  get nickname(): string {
    return this.existUser ? this.user_.nickname : null;
  }

  get photo(): string {
    return this.existUser ? this.user_.photo : null;
  }

  get createDate(): string {
    return this.existUser ? this.user_.createDate : null;
  }

  get updateDate(): string {
    return this.existUser ? this.user_.updateDate : null;
  }

  get isUsed(): boolean {
    return this.existUser ? this.user_.isUsed : false;
  }

  get roleId(): number {
    return this.existUser ? this.user_.roleId : 0;
  }

  getFireAuth(): firebase.auth.Auth {
    return this.afAuth.auth;
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
      this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(provider.idToken)
      ).then(firebaseUser => {
        // console.log(firebaseUser);
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
      .then(userCredential => {
        // console.log(userCredential);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async updateSignInInfo(): Promise<User> {

    const idToken: string = await this.afAuth.auth.currentUser.getIdToken(true);
    const resDate = new ResponseDate(await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
      headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise() as ResponseDate);

    if (resDate.res) {
      this.user_ = resDate.data as User;
    } else {
      this.signOut();
      this.presentToast(resDate.toErrString());
    }

    return this.user_;
  }

  signOut() {
    this.user_ = null;
    this.gplus.disconnect();
    this.afAuth.auth.signOut();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

}
