import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, ToastController, LoadingController } from '@ionic/angular';

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
    private loadingCtrl: LoadingController,
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

  get nickname(): string {
    return this.existUser ? this.user_.nickname : null;
  }

  get photo(): string {
    return this.existUser ? this.user_.photo : null;
  }

  getFireAuth(): firebase.auth.Auth {
    return this.afAuth.auth;
  }

  async signIn() {
    const loading = await this.getLoading();
    loading.present();

    const promises = new Array();

    if (this.platform.is('cordova')) {
      promises.push(await this.nativeGoogleLogin());
    } else {
      promises.push(await this.webGoogleLogin());
    }

    // test login for devapp
    // promises.push(await this.webGoogleLogin());

    Promise.all(promises)
      .catch(err => {
        // console.log(err);
      })
      .finally(() => loading.dismiss());
  }

  webGoogleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider).catch(err => {
      // popup 취소 에러
      // console.log(err);
    });
  }

  async nativeGoogleLogin(): Promise<any> {
    return this.gplus.login(this.getGoogleLoginOptions()).then(provider => {
      return this.afAuth.auth.signInAndRetrieveDataWithCredential(
        firebase.auth.GoogleAuthProvider.credential(provider.idToken)
      );
    }).catch(err => {
      // console.log(err);
    });
  }

  googleTrySilentLogin() {
    this.gplus.trySilentLogin(this.getGoogleLoginOptions());
  }

  getGoogleLoginOptions()  {
    return {
      'webClientId': environment.webClientId,
      'offline': false,
      'scopes': 'profile email'
    };
  }

  async updateSignInInfo(): Promise<User> {

    if (this.platform.is('cordova')) {
      this.googleTrySilentLogin();
    }

    const idToken: string = await this.afAuth.auth.currentUser.getIdToken(true);
    const resDate = new ResponseDate(
      await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
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

  async updateSignInInfoForDevApp(): Promise<User> {

    let idToken = await fetch(environment.devAppTestFilePath).then(async response => {
      return await response.json().then(data => idToken = data.idToken);
    });

    const resDate = new ResponseDate(
      await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
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

  async signOut() {
    this.user_ = null;

    if (this.platform.is('cordova')) {
      await this.gplus.disconnect();
    }

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

  async getLoading(message?: string, duration?: number, backdropDismiss?: boolean): Promise<HTMLIonLoadingElement> {
    return await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: (message == null ? 'Loading...' : message),
      animated: true,
      translucent: true,
      showBackdrop: true,
      backdropDismiss: (backdropDismiss == null ? false : true),
      duration: (duration == null ? 0 : duration)
    });
  }

}
