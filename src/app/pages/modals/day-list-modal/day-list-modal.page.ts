import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { environment } from 'src/environments/environment';

import { CommonService } from 'src/app/services/common.service';
import { SclwService } from 'src/app/services/sclw.service';

import { Cat } from 'src/app/models/Cat';
import { Day } from 'src/app/models/Day';

@Component({
  selector: 'app-day-list-modal',
  templateUrl: './day-list-modal.page.html',
  styleUrls: ['./day-list-modal.page.scss'],
})
export class DayListModalPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;

  public cat: Cat;
  public dayList: Array<Day>;

  public initTypeList = [];
  public allCheck = false;
  public isInitBtn = false;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
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

    this.cat = this.navParams.get('cat') as Cat;

    await this.getDays(this.cat.id)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.defaultHref = [this.pageInfo.setting.word.url];
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

  async closeModal() {
    await this.modalController.dismiss();
  }

  clickAllCheck(ev): void {
    const checkVal = !ev.target.checked;
    for (const day of this.dayList) {
      day.checked = checkVal;
    }
  }

  clickCheck(ev, day: Day): void {
    const checkVal = !ev.target.checked;
    day.checked = checkVal;

    let allCheck = true;
    for (const tempDay of this.dayList) {
      if (!tempDay.checked) {
        allCheck = false;
        break;
      }
    }

    this.allCheck = allCheck;
    day.checked = !checkVal;
  }

  checkInitBtn(): void {
    if (this.initTypeList.length > 0) {
      for (const day of this.dayList) {
        if (day.checked) {
          this.isInitBtn = true;
          break;
        } else {
          this.isInitBtn = false;
        }
      }
    } else {
      this.isInitBtn = false;
    }
  }

  async init() {
    const dayIdList = new Array<number>();
    this.dayList.forEach((day) => {
      if (day.checked) {
        dayIdList.push(day.id);
      }
    });

    return await this.sclwService.initWordUser(this.initTypeList, dayIdList)
      .then(rd => {
        if (rd.res) {
          this.closeModal();
          this.cmnService.presentSucToast('초기화 성공');
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

}
