import { Component } from '@angular/core';

import { Platform, ToastController, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

// firebase
import { AngularFireAuth } from '@angular/fire/auth';

// services
import { AuthService } from './services/auth.service';

// models
import { ResponseDate } from './models/ResponseData';
import { User } from './models/User';

interface MenuInterface {
  title: string;
  pages: Array<PageInterface>;
}

interface PageInterface {
  title: string;
  url: string;
  icon: string;
  param?: CustomObject;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public menuDisabled = true;
  public menus = new Array<MenuInterface>();

  private pagesMap: Map<string, PageInterface>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,

    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth,
    private _auth: AuthService
  ) {
    this.initializePages();
    this.initializeApp();
  }

  initializePages(): void {
    const pagesMap = new Map<string, PageInterface>();
    pagesMap.set('home', { title: 'Home', url: '/home', icon: 'home' });
    pagesMap.set('list', { title: 'List', url: '/list', icon: 'list' });
    pagesMap.set('my-info', { title: 'My Info', url: '/my-info', icon: 'person' });
    this.pagesMap = pagesMap;
  }

  async initializeApp() {
    await this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });

    await this.afAuth.auth.onAuthStateChanged(async fireUser => {

      console.log(`[app] onAuthStateChanged: ${fireUser}`);

      if (fireUser != null) {
        const resData: ResponseDate = await this._auth.updateSignInInfo();
        this.splashScreen.hide();

        if (resData.res) {
          this.setMenus(resData.data as User);
        } else {
          this._auth.signOut();
          this.presentToast(resData.toErrString());
        }

      } else {
        this.splashScreen.hide();
        this.setMenus(null);
      }
    });
  }

  setMenus(user: User) {
    if (user == null) {
      this.menus = [];
      this.menuDisabled = true;
      console.log(`[app] setMenus: sign-in`);
      this.router.navigate(['sign-in']);
    } else {
      const menus = new Array<MenuInterface>();

      let pages = [];
      pages.push(this.pagesMap.get('list'));
      menus.push({ title: 'Study', pages: pages});

      pages = [];
      pages.push(this.pagesMap.get('my-info'));
      menus.push({ title: 'Setting', pages: pages});

      this.menus = menus;
      this.menuDisabled = false;
      console.log(`[app] setMenus: home`);
      this.router.navigate(['home']);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }
}
