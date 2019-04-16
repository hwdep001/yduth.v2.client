import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return  new Promise((resolve, reject) => {
      /**
       * 로그인 했을 경우 /sign-in 접근 시 home으로 이동
       * 로그인 안했을 경우 /sign-in 페이지만 허용
       */
      this.afAuth.auth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          if (state.url === '/sign-in') {
            console.log(`auth guard: ${state.url} - false -> home`);
            this.router.navigate(['home']);
            resolve(false);
          } else {
            console.log(`auth guard: ${state.url} - true`);
            resolve(true);
          }
        } else {
          if (state.url === '/sign-in') {
            console.log(`auth guard: ${state.url} - true`);
            resolve(true);
          } else {
            console.log(`auth guard: ${state.url} - false -> sign-in`);
            this.router.navigate(['sign-in']);
            resolve(false);
          }
        }
      });
    });
  }
}
