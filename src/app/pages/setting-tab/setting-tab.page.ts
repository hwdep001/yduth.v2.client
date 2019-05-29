import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting-tab',
  templateUrl: './setting-tab.page.html',
  styleUrls: ['./setting-tab.page.scss'],
})
export class SettingTabPage implements OnInit {

  public pageInfo = environment.pageInfo;

  constructor() { }

  ngOnInit() {
    // console.log('SettingTabPage');
  }

}
