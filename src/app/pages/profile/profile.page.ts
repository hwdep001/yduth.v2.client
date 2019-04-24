import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthService } from './../../services/auth.service';

import { User } from './../../models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public pageInfo;
  user: User = new User();

  constructor(
    private _auth: AuthService,
    public menuCtrl: MenuController
  ) {
    this.pageInfo = environment.pageInfo;
    if (this._auth.user != null) {
      this.user.uid = this._auth.uid;
      this.user.email = this._auth.email;
    }
  }

  ngOnInit() {
    console.log('ProfilePage');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  signOut() {
    this._auth.signOut();
  }

}
