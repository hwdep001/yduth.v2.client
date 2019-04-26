import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { CommonService } from './common.service';

import { ResponseData } from './../models/ResponseData';
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
    private loadingCtrl: LoadingController,
    private gplus: GooglePlus,
    private afAuth: AngularFireAuth,
    private _cmn: CommonService
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

  get googlePhotoUrl(): string {
    return this.existUser ? this.user_.googlePhotoUrl : null;
  }

  get nickname(): string {
    return this.existUser ? this.user_.nickname : null;
  }

  get photo(): string {
    return this.existUser ? this.user_.photo : null;
  }

  set user(user: User) {
    this.user_ =  user;
  }

  getFireAuth(): firebase.auth.Auth {
    return this.afAuth.auth;
  }

  async getIdToken(): Promise<string> {
    return await this.getFireAuth().currentUser.getIdToken(true);
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
    const rd = new ResponseData(
      await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise() as ResponseData);

    if (rd.res) {
      this.user_ = rd.data as User;
    } else {
      this.signOut();
      this._cmn.presentErrToast(rd.toErrString());
    }

    return this.user_;
  }

  async updateSignInInfoForDevApp(): Promise<User> {

    let idToken = await fetch(environment.devAppTestFilePath).then(async response => {
      return await response.json().then(data => idToken = data.idToken);
    });

    const rd = new ResponseData(
      await this.http.post(`${this.apiServerUrl}/sign-in-up`, null, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise() as ResponseData);

    if (rd.res) {
      this.user_ = rd.data as User;
    } else {
      this.signOut();
      this._cmn.presentErrToast(rd.toErrString());
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

  async getLoading(): Promise<HTMLIonLoadingElement> {
    return await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: 'Loading...',
      animated: true,
      translucent: true,
      showBackdrop: true,
      backdropDismiss: false,
      duration: 20000
    });
  }

}
