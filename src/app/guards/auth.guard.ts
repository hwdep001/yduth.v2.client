import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../services/auth.service';

import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private events: Events,
    private afAuth: AngularFireAuth,
    private _auth: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    return  new Promise((resolve, reject) => {
      this.afAuth.auth.onAuthStateChanged(async (fireUser: firebase.User) => {
        console.log('[auth guard] onAuthStateChanged: ' + fireUser);

        /**
         * user가 null인데 firebase가 로그인 상태이면 로그인 처리
         */
        if (fireUser != null && this._auth.user == null) {
          await this._auth.updateSignInInfo();
        }
        const user: User = this._auth.user;

        /**
         * 로그인 했을 경우 /sign-in 접근 시 home으로 이동
         * 로그인 안했을 경우 /sign-in 페이지만 허용
         */
        if (user) {
          if (state.url === '/sign-in') {
            console.log(`[auth guard] ${state.url} - false -> home`);
            this.router.navigate(['home']);
            resolve(false);
          } else {
            console.log(`[auth guard] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          }
        } else {
          if (state.url === '/sign-in') {
            console.log(`[auth guard] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          } else {
            console.log(`[auth guard] ${state.url} - false -> sign-in`);
            this.router.navigate(['sign-in']);
            resolve(false);
          }
        }
      });
    });
  }
}
