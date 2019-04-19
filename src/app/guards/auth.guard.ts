import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Events } from '@ionic/angular';
import { Observable } from 'rxjs';

import { AuthService } from './../services/auth.service';

import { User } from './../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isSubscription = false;
  private unsubscribe: firebase.Unsubscribe;

  constructor(
    private router: Router,
    private events: Events,
    private _auth: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    return  new Promise((resolve, reject) => {

      if (this.isSubscription) {
        this.unsubscribe();
        this.isSubscription = false;
      }

      this.unsubscribe = this._auth.getFireAuth().onAuthStateChanged(async (fireUser: firebase.User) => {
        // console.log('[auth guard] onAuthStateChanged: ' + fireUser);
        this.isSubscription = true;

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
            // console.log(`[auth guard] ${state.url} - false -> home`);
            this.router.navigate(['home']);
            resolve(false);
          } else {
            // console.log(`[auth guard] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          }
        } else {
          if (state.url === '/sign-in') {
            // console.log(`[auth guard] ${state.url} - true`);
            this.events.publish('menu-setting', user);
            resolve(true);
          } else {
            // console.log(`[auth guard] ${state.url} - false -> sign-in`);
            state.url = '/sign-in';   // 로그인 화면에서 뒤로가기 방지용
            this.router.navigate(['sign-in']);
            resolve(false);
          }
        }
      });
    });
  }
}
