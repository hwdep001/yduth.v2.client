import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  reqUrl: string;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {
    this.reqUrl = environment.apiServerUrl;
    this.testApi();
  }

  testApi(): Promise<any> {
    return this.afAuth.auth.currentUser.getIdToken(true).then(idToken => {
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

}
