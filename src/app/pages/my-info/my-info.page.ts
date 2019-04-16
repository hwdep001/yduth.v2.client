import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SignInService } from 'src/app/services/sign-in.service';
import { User } from './../../models/User';

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.page.html',
  styleUrls: ['./my-info.page.scss'],
})
export class MyInfoPage implements OnInit {

  user: User = new User();

  constructor(
    private _signIn: SignInService,
    private afAuth: AngularFireAuth
  ) {
    if (this.afAuth.auth.currentUser != null) {
      this.user.uid = this.afAuth.auth.currentUser.uid;
      this.user.email = this.afAuth.auth.currentUser.email;
    }
  }

  ngOnInit() {
  }

  signOut() {
    this._signIn.signOut();
  }

}
