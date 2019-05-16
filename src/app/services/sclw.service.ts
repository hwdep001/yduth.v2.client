import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

import { ResponseData } from '../models/ResponseData';
import { Cat } from './../models/Cat';
import { Lec } from './../models/Lec';

@Injectable({
  providedIn: 'root'
})
export class SclwService {

  private apiServerUrl: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.apiServerUrl = environment.apiServerUrl;
  }

  async getSubWithCats(subId: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/sub-cats/${subId}`, {
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

  async addType1Cat(cat: Cat): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = cat;

    await this.http.put(`${this.apiServerUrl}/type1-cat`, data, {
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

  async getLecs(catId: string): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    // let rd = new ResponseData({});

    // await this.http.get(`${this.apiServerUrl}/lecs/${catId}`, {
    //     headers: new HttpHeaders().set('Authorization', idToken)
    // }).toPromise().then(reponse => {
    //   rd = new ResponseData(reponse);
    // }).catch((err: HttpErrorResponse) => {
    //   rd.code = err.status;
    //   rd.msg = err.statusText;
    //   console.log(err);
    // });

    const rd = new ResponseData({});
    const lecList = new Array<Lec>();
    const lec1 = new Lec();
    lec1.id = 1;
    lec1.name = 'lec1';
    lec1.num = 1;
    const lec2 = new Lec();
    lec2.id = 2;
    lec2.name = 'lec2';
    lec2.num = 2;
    const lec3 = new Lec();
    lec3.id = 3;
    lec3.name = 'lec3';
    lec3.num = 3;
    lecList.push(lec1);
    lecList.push(lec2);
    lecList.push(lec3);
    rd.res = true;
    rd.data = lecList;

    return rd;
  }

}
