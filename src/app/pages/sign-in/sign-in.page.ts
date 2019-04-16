import { Component, OnInit } from '@angular/core';

import { SignInService } from 'src/app/services/sign-in.service';

import { User } from './../../models/User';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  user: User = new User();

  constructor(
    private _signIn: SignInService
  ) { }

  ngOnInit() {
  }

  signIn() {
    this._signIn.signIn();
  }

}
