import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import { CommonService } from './../../services/common.service';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';

import { ResponseData } from './../../models/ResponseData';
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
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private _cmn: CommonService,
    private _auth: AuthService,
    private _user: UserService
  ) {
    this.pageInfo = environment.pageInfo;
    if (this._auth.user != null) {
      this.user = this._auth.user;
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

  withdraw() {
    this.getWithdrawAlert(() => {
      this._user.withdraw().then((rd: ResponseData) => {
        if (rd.res) {
          this._auth.signOut();
          this._cmn.presentSucToast('탈퇴 성공');
        } else {
          this._cmn.presentErrToast(rd.toErrString());
        }
      });
    });
  }

  async getWithdrawAlert(withdrawHandler: any) {
    const alert = await this.alertCtrl.create({
      header: '회원 탈퇴',
      message: '탈퇴하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel'
        }, {
          text: '탈퇴',
          handler: () => {
            withdrawHandler();
          }
        }
      ]
    });

    return await alert.present();
  }

}
