import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  reqUrl: string;

  constructor(
    private toastCtrl: ToastController,
    private http: HttpClient,
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this.reqUrl = environment.apiServerUrl;
    // this.testApi();
    console.log('HomePage');
    // this.presentToastWithOptions('home!!!!!!!!!!!!!!!!');
  }

  testApi(): Promise<any> {
    return this._auth.getFireAuth().currentUser.getIdToken(true).then(idToken => {
      return new Promise<any>((resolve, reject) => {
        this.http.get(`${this.reqUrl}/test/user-info`, {
          headers: new HttpHeaders().set('Authorization', idToken)
        }).subscribe(data => {
          console.log(data);
        }, err => {
          console.log(err);
          reject(err);
        });
      });
    });
  }

  async presentToastWithOptions(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'middle',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

}
