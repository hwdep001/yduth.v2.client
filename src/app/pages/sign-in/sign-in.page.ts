import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  user: User = new User();

  constructor(
    private _auth: AuthService
  ) {
    console.log('SignInPage');
  }

  ngOnInit() {
  }

  signIn() {
    this._auth.signIn();
  }

}
