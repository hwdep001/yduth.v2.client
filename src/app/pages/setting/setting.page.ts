import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {

  private pageInfo = environment.pageInfo;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log('SettingPage');
  }

  moveWordInit(): void {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.settingWordInit.url], navigationExtras);
  }

}
