import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

import { CommonService } from 'src/app/services/common.service';
import { SclwService } from 'src/app/services/sclw.service';

import { Cat } from 'src/app/models/Cat';
import { Day } from 'src/app/models/Day';

@Component({
  selector: 'app-setting-word-init-days',
  templateUrl: './setting-word-init-days.page.html',
  styleUrls: ['./setting-word-init-days.page.scss'],
})
export class SettingWordInitDaysPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;

  public cat: Cat;
  public dayList: Array<Day>;

  public initTypeList = [];
  public allCheck = false;
  public isIndeterminate = false;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('DayListModalPage');
    this.initData();
  }

  private async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.cat = JSON.parse(this.route.snapshot.queryParams.cat) as Cat;

    await this.getDays(this.cat.id)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.defaultHref = [this.pageInfo.settingWordInit.url];
  }

  private async getDays(catId: number): Promise<any> {
    return await this.sclwService.getDays(catId)
      .then(rd => {
        if (rd.res) {
          this.dayList = rd.data as Array<Day>;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  clickAllCheck() {
    setTimeout(async () => {
      const loading = await this.cmnService.getLoading();
      loading.present();
      this.dayList.forEach(day => {
        day.checked = this.allCheck;
      });

      loading.dismiss();
    });
  }

  clickCheck(): void {
    console.log('dd');
    const totalItems = this.dayList.length;
    let checked = 0;
    this.dayList.map(day => {
      if (day.checked) {
        checked++;
      }
    });
    if (checked > 0 && checked < totalItems) {
      // If even one item is checked but not all
      this.isIndeterminate = true;
      this.allCheck = false;
    } else if (checked === totalItems) {
      // If all are checked
      this.allCheck = true;
      this.isIndeterminate = false;
    } else {
      // If none is checked
      this.isIndeterminate = false;
      this.allCheck = false;
    }
  }

  async init() {
    if (this.initTypeList.length === 0) {
      this.cmnService.getAlert(null, null, '초기화 항목을 선택해 주세요').then(alert => {
        alert.present();
      });
      return;
    }

    const dayIdList = new Array<number>();
    this.dayList.forEach((day) => {
      if (day.checked) {
        dayIdList.push(day.id);
      }
    });

    if (dayIdList.length === 0) {
      this.cmnService.getAlert(null, null, 'Day를 선택해 주세요').then(alert => {
        alert.present();
      });
      return;
    }

    return await this.sclwService.initWordUser(this.initTypeList, dayIdList)
      .then(rd => {
        if (rd.res) {
          this.cmnService.presentSucToast('초기화 성공', 'top');
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

}
