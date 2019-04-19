import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  constructor(
    private _auth: AuthService
  ) { }

  ngOnInit() {
    console.log('SignInPage');
  }

  signIn() {
    this._auth.signIn();
  }

}
