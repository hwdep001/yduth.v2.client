import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

// firebase
import { AngularFireAuth } from '@angular/fire/auth';

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

  public menuDisabled: boolean;
  public menus = new Array<MenuInterface>();

  private pagesMap: Map<string, PageInterface>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,

    private afAuth: AngularFireAuth,
  ) {
    this.initializePages();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.afAuth.auth.onAuthStateChanged(fireUser => {
        console.log('onAuthStateChanged: ' + fireUser);
        this.setMenus(fireUser);
      });
    });
  }

  initializePages(): void {
    const pagesMap = new Map<string, PageInterface>();
    pagesMap.set('home', { title: 'Home', url: '/home', icon: 'home' });
    pagesMap.set('list', { title: 'List', url: '/list', icon: 'list' });
    pagesMap.set('my-info', { title: 'My Info', url: '/my-info', icon: 'person' });
    this.pagesMap = pagesMap;
  }

  setMenus(fireUser: firebase.User) {
    if (fireUser == null) {
      this.menus = [];
      this.menuDisabled = true;
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
      this.router.navigate(['home']);
    }
  }
}
