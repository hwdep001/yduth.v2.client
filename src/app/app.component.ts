import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';

import { Platform, Events, IonRouterOutlet, ToastController, MenuController } from '@ionic/angular';
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

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  public menuDisabled = true;
  public menus = new Array<MenuInterface>();

  private pagesMap: Map<string, PageInterface>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private events: Events,
    private router: Router,
    private toastCtrl: ToastController,
    private menu: MenuController,
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

      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
      }

      this.subscribeBackButton();
      this.events.subscribe('menu-setting', (fireUser) => {
        this.hideSplashScreen();
        this.setMenus(fireUser);
      });
    });
  }

  setMenus(user: User) {
    if (user == null && this.menuDisabled === false) {
      this.menus = [];
      this.menuDisabled = true;

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
    }
  }

  hideSplashScreen(): void {
    if (this.platform.is('cordova')) {
      this.splashScreen.hide();
    }
  }

  subscribeBackButton(): void {
    this.platform.backButton.subscribeWithPriority(0, async () => {

      // close side menu
      try {
        const element = await this.menu.getOpen();
        if (element) {
          this.menu.close();
          return;
        }
      } catch (err) {
        console.log(err);
      }

      // close modal
      // try {
      //   const element = await this.modalCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      // close action sheet
      // try {
      //   const element = await this.actionSheetCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      // close popover
      // try {
      //   const element = await this.popoverCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (err) {
      //   console.log(err);
      // }

      if (this.router.url === '/sign-in') {
        navigator['app'].exitApp();
      } else if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {

        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          navigator['app'].exitApp(); // work in ionic 4
        } else {
            this.backBtnToast();
            this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }

  async backBtnToast() {
    const toast = await this.toastCtrl.create({
      message: 'Press back again to exit App.',
      position: 'bottom',
      color: 'medium',
      animated: true,
      translucent: true,
      duration: 2000
    });
    toast.present();
  }

}
