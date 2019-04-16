import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';

// firebase
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,

    private afAuth: AngularFireAuth,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.afAuth.auth.onAuthStateChanged(fireUser => {
        console.log('onAuthStateChanged: ' + fireUser);
        this.initializePages(fireUser);
      });
    });
  }

  initializePages(fireUser: firebase.User) {
    if (fireUser == null) {
      this.appPages = [
        {
          title: 'Sign In',
          url: '/sign-in',
          icon: 'list'
        }
      ];
      this.router.navigate(['sign-in']);
    } else {
      this.appPages = [
        {
          title: 'Home',
          url: '/home',
          icon: 'home'
        },
        {
          title: 'List',
          url: '/list',
          icon: 'list'
        },
        {
          title: 'My Info',
          url: '/my-info',
          icon: 'list'
        }
      ];
      this.router.navigate(['home']);
    }
  }
}
