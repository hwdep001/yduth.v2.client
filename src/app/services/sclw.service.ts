import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

import { ResponseData } from '../models/ResponseData';
import { Sub } from './../models/Sub';
import { Cat } from './../models/Cat';
import { Day } from './../models/day';

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

  async getSubsWithCats(): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/subs-cats`, {
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

  //////////////////////////////////////////////////////////////////////////////////

  async addType1Cat(cat: Cat): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = cat;

    await this.http.post(`${this.apiServerUrl}/type1-cat`, data, {
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

  async updateDeleteType1Cats(sub: Sub): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = sub;

    await this.http.post(`${this.apiServerUrl}/type1-cats`, data, {
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

  //////////////////////////////////////////////////////////////////////////////////

  async getDays(catId: number): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    await this.http.get(`${this.apiServerUrl}/days/${catId}`, {
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

  async addType1Day(day: Day): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = day;

    await this.http.post(`${this.apiServerUrl}/type1-day`, data, {
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

  async updateDeleteType1Days(catId: number,
    updateDayList: Array<Day>, deleteDayList: Array<Day>): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = {
      catId,
      deleteDayList: deleteDayList,
      updateDayList: updateDayList,
    };

    await this.http.post(`${this.apiServerUrl}/type1-days`, data, {
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

  //////////////////////////////////////////////////////////////////////////////////

  async initWordUser(
    typeList: Array<number>, dayIdList: Array<number>): Promise<ResponseData> {

    const idToken: string = await this.authService.getIdToken();
    let rd = new ResponseData({});

    const data = {
      typeList,
      dayIdList
    };

    await this.http.post(`${this.apiServerUrl}/word-user/init`, data, {
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
