import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { User } from './../../models/User';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage implements OnInit {

  user: User = new User();

  constructor(
    private _auth: AuthService,
  ) { }

  ngOnInit() {
    console.log('MyInfoPage');
    if (this._auth.user != null) {
      this.user.uid = this._auth.uid;
      this.user.email = this._auth.email;
    }
  }

  signOut() {
    this._auth.signOut();
  }

}
