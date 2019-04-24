import { Component, OnInit } from '@angular/core';

import { AuthService } from './../../services/auth.service';

import { User } from './../../models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User = new User();

  constructor(
    private _auth: AuthService,
  ) { }

  ngOnInit() {
    console.log('ProfilePage');
    if (this._auth.user != null) {
      this.user.uid = this._auth.uid;
      this.user.email = this._auth.email;
    }
  }

  signOut() {
    this._auth.signOut();
  }

}
