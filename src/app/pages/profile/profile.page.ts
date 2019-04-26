import { Component, OnInit } from '@angular/core';
import { MenuController, AlertController, ActionSheetController } from '@ionic/angular';

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
  public user: User = new User();

  public newNickname: string;
  public nicknameDisabled: boolean;

  constructor(
    public menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private asCtrl: ActionSheetController,
    private _cmn: CommonService,
    private _auth: AuthService,
    private _user: UserService
  ) {
    this.pageInfo = environment.pageInfo;
    this.nicknameDisabled = true;
    if (this._auth.user != null) {
      this.user = this._auth.user;
      this.newNickname = this.user.nickname;
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

  async updateNickname() {

    if (this.newNickname.length < 2 || this.newNickname.length > 12) {
      alert('2~12자 사이로 입력해주세요.');
      return;
    }

    if (this.user.nickname === this.newNickname) {
      this.nicknameDisabled = true;
      return;
    }

    const loading = await this._cmn.getLoading();
    loading.present();
    const rd: ResponseData = await this._user.updateNickname(this.user.uid, this.newNickname);

    if (rd.res) {
      this.user.nickname = this.newNickname;
      this._auth.user = this.user;
      this.nicknameDisabled = true;
      loading.dismiss();
      this._cmn.presentSucToast('저장');
    } else {
      loading.dismiss();
      if (rd.code === 1104 || rd.code === 1105) {
        alert(rd.msg);
      } else {
        this._cmn.presentErrToast(rd.toErrString());
      }
    }
  }

  cancelNinkname() {
    this.newNickname = this.user.nickname;
    this.nicknameDisabled = true;
  }

  async presentPhotoAs() {
    const actionSheet = await this.asCtrl.create({
      header: '사진 변경',
      buttons: [
      {
        text: '사진 촬영',
        icon: 'camera',
        handler: () => {
          alert('준비 중');
        }
      }, {
        text: '앨범에서 사진 선택',
        icon: 'images',
        handler: () => {
          alert('준비 중');
        }
      }, {
        text: 'Google 프로필 사진으로 변경',
        icon: 'logo-googleplus',
        handler: async () => {
          this.updatePhoto(this.user.googlePhotoUrl);
        }
      }, {
        text: '기본 사진으로 변경',
        icon: 'trash',
        handler: async () => {
          this.updatePhoto(null);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    return await actionSheet.present();
  }

  private async updatePhoto(photo: string) {
    const loading = await this._cmn.getLoading();
    loading.present();
    const rd = await this._user.updatePhoto(this.user.uid, photo);

    if (rd.res) {
      this.user.photo = photo;
      this._auth.user = this.user;
      loading.dismiss();
      this._cmn.presentSucToast('저장');
    } else {
      loading.dismiss();
      this._cmn.presentErrToast(rd.toErrString());
    }
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

  private async getWithdrawAlert(withdrawHandler: any) {
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
