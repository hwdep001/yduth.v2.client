import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseData } from './../models/ResponseData';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServerUrl: string;

  constructor(
    private http: HttpClient,
    private _auth: AuthService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  async withdraw(): Promise<ResponseData> {

    const idToken: string = await this._auth.getIdToken();
    let rd = new ResponseData({});
    // rd = new ResponseData(
    //   await this.http.post(`${this.apiServerUrl}/withdraw`, null, {
    //     headers: new HttpHeaders().set('Authorization', idToken)
    // }).toPromise() as ResponseData);

    await this.http.delete(`${this.apiServerUrl}/user/withdraw`, {
        headers: new HttpHeaders().set('Authorization', idToken)
    }).toPromise().then(reponse => {
      rd = new ResponseData(reponse);
    }).catch((err: HttpErrorResponse) => {
      rd.code = err.status;
      rd.msg = err.statusText;
      console.log(err);
    });

    return rd;
  }

}
