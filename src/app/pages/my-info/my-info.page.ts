import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
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
    private afAuth: AngularFireAuth
  ) {
    console.log('MyInfoPage');
    if (this.afAuth.auth.currentUser != null) {
      this.user.uid = this.afAuth.auth.currentUser.uid;
      this.user.email = this.afAuth.auth.currentUser.email;
    }
  }

  ngOnInit() {
  }

  signOut() {
    this._auth.signOut();
  }

}
