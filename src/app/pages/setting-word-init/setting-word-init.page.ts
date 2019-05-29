import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';
import { SclwService } from 'src/app/services/sclw.service';

import { Sub } from 'src/app/models/Sub';
import { Cat } from 'src/app/models/Cat';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting-word-init',
  templateUrl: './setting-word-init.page.html',
  styleUrls: ['./setting-word-init.page.scss'],
})
export class SettingWordInitPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;

  public subList: Array<Sub>;

  constructor(
    private router: Router,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('SettingWordPage');
    this.initData();
  }

  private async initData(): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    await this.getSubsWithCats()
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());

    this.defaultHref = [this.pageInfo.setting.url];
  }

  private async getSubsWithCats(): Promise<any> {
    return await this.sclwService.getSubsWithCats()
      .then(rd => {
        if (rd.res) {
          const subList = rd.data as Array<Sub>;
          subList.forEach((sub) => {
            sub.type0CatList = sub.type0CatList.concat(sub.type1CatList);
          });
          this.subList = subList;
        } else {
          alert(rd.toErrString());
        }
      }).catch(err => alert(err));
  }

  async moveDayList(cat: Cat): Promise<any> {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        cat: JSON.stringify(cat)
      },
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.settingWordInitDays.url], navigationExtras);
  }

}
