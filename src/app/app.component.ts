import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// models
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
    private events: Events
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
      this.events.subscribe('menu-setting', (fireUser) => {
        this.splashScreen.hide();
        this.setMenus(fireUser);
      });
    });
  }

  setMenus(user: User) {
    if (user == null && this.menuDisabled === false) {
      this.menus = [];
      this.menuDisabled = true;
      // console.log(`[app] setMenus: X`);
    } else if (user != null && this.menuDisabled === true) {
      const menus = new Array<MenuInterface>();

      let pages = [];
      pages.push(this.pagesMap.get('list'));
      menus.push({ title: 'Study', pages: pages});

      pages = [];
      pages.push(this.pagesMap.get('my-info'));
      menus.push({ title: 'Setting', pages: pages});

      this.menus = menus;
      this.menuDisabled = false;
      // console.log(`[app] setMenus: O`);
    }
  }

}
