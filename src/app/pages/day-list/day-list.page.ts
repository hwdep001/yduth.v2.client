import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Platform, AlertController, PopoverController } from '@ionic/angular';

import { environment } from './../../../environments/environment';
import { Subscription } from 'rxjs';

import { SortPopoverComponent } from './../../components/sort-popover/sort-popover.component';

import { SclwService } from './../../services/sclw.service';
import { CommonService } from './../../services/common.service';

import { Cat } from './../../models/Cat';
import { Day } from '../../models/day';
import { deepCopy } from 'src/app/utils/deep-copy';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.page.html',
  styleUrls: ['./day-list.page.scss'],
})
export class DayListPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;
  public unsubscribeBackEvent: Subscription;

  public cat: Cat;
  public dayList: Array<Day>;
  public dayListCopy: Array<Day>;
  public allCheck: boolean;

  public isFabBtn = true;
  public isSetting = false;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('DayListPage');
    this.initData();
  }

  // ionViewWillEnter() { }
  ionViewWillLeave() {
    if (this.unsubscribeBackEvent != null) {
      this.unsubscribeBackEvent.unsubscribe();
    }
  }

  private subscribeBackButton(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(1, async () => {
      this.zone.run(() => {
        this.cancelSetting(this.dayListCopy);
      });
    });
  }

  private async initData(): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const catId = this.route.snapshot.params.catId;
    this.cat = JSON.parse(this.route.snapshot.queryParams.data) as Cat;

    await this.getDays(catId)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.defaultHref = [this.pageInfo.catList.url, this.cat.sub.id];
  }

  private async getDays(catId: string): Promise<any> {
    return await this.sclwService.getDays(catId)
      .then(rd => {
        if (rd.res) {
          this.dayList = rd.data as Array<Day>;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  moveWordListPage(day: Day): void {
  }

  moveXXXPage() {
  }

  moveSearchPage(): void {
    const cat = new Cat();
    cat.id = this.cat.id;
    cat.name = this.cat.name;
    cat.num = this.cat.num;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        sub: JSON.stringify(this.cat.sub),
        cat: JSON.stringify(cat)
      },
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.searchWords.url], navigationExtras);
  }

  onRenderItems(event): void {
    const from = event.detail.from;
    const to = event.detail.to;

    const draggedItem = this.dayList.splice(from, 1)[0];
    this.dayList.splice(to, 0, draggedItem);
    event.detail.complete();
  }

  clickAllCheck(ev) {
    const checkVal = !ev.target.checked;
    for (const day of this.dayList) {
      day.checked = checkVal;
    }
  }

  clickDayCheck(ev, day: Day) {
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

  clickSetting(): void {
    this.subscribeBackButton();
    this.dayListCopy = <Array<Day>>deepCopy(this.dayList);
    this.isSetting = true;
    this.isFabBtn = false;
  }

  cancelSetting(dayList: Array<Day>): void {
    this.unsubscribeBackEvent.unsubscribe();
    this.dayList = dayList;
    this.isSetting = false;
    this.isFabBtn = true;
  }

  async saveSetting(): Promise<any> {
    const alert = await this.alertCtrl.create({
      message: '저장하시겠습니까?',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: '저장',
          handler: () => {
            this.updateDeleteType1Days();
          }
        }
      ]
    });

    await alert.present();
  }

  clickTrash(): void {
    this.dayList = this.dayList.filter((day) => {
      return !day.checked;
    });
  }

  private async addType1Day(newName: string): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const newDay = new Day();
    newDay.name = newName;
    newDay.cat = this.cat;

    const rd = await this.sclwService.addType1Day(newDay);

    if (rd.res) {
      this.dayList = rd.data as Array<Day>;
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    loading.dismiss();
  }

  private async updateDeleteType1Days(): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const dayCopyMap = new Map<Number, Day>();
    const updateDayList = new Array<Day>();
    const deleteDayList = new Array<Day>();

    // dayCopyMap 생성
    this.dayListCopy.forEach((day) => {
      dayCopyMap.set(day.id, day);
    });

    // 비교하여 update list에 추가
    this.dayList.forEach((day, index) => {
      const dayCopy = dayCopyMap.get(day.id);

      day.num = index + 1;
      if (dayCopy.name !== day.name || dayCopy.num !== day.num) {
        updateDayList.push(day);
      }

      dayCopyMap.delete(dayCopy.id);
    });

    // dayCopyMap 남은 목록 delete list에 추가
    dayCopyMap.forEach((day) => {
      deleteDayList.push(day);
    });

    if (updateDayList.length === 0 && deleteDayList.length === 0) {
      this.cancelSetting(this.dayListCopy);
      loading.dismiss();
      return;
    }

    const rd = await this.sclwService.updateDeleteType1Days(
      this.cat.id, updateDayList, deleteDayList);

    if (rd.res) {
      this.cancelSetting(rd.data as Array<Day>);
      this.cmnService.presentSucToast('저장');
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    loading.dismiss();
  }

  async alertNewType1Day() {
    this.isFabBtn = false;

    const defaultName = this.cmnService.toStringDateTime();

    const alert = await this.alertCtrl.create({
      header: 'Day 추가',
      inputs: [{
        name: 'name',
        value: defaultName,
        placeholder: defaultName
      }],
      buttons: [{
        text: '취소',
        role: 'cancel',
        handler: () => {
          this.isFabBtn = true;
        }
      }, {
        text: '추가',
        handler: (alertData) => {
          if (alertData.name.length > 64) {
            this.cmnService.presentErrToast('64자 이하로 입력해주세요.');
            return false;
          } else if (alertData.name.trim() === '' || alertData.name == null) {
            alertData.name = defaultName;
          }

          this.addType1Day(alertData.name.trim())
            .finally(() => this.isFabBtn = true);
        }
      }]
    });

    await alert.present();
  }

  async alertUpdateName(day: Day) {
    const alert = await this.alertCtrl.create({
      header: '이름 변경',
      inputs: [{
        name: 'name',
        value: day.name,
        placeholder: day.name
      }],
      buttons: [{
        text: '취소',
        role: 'cancel'
      }, {
        text: '변경',
        handler: (alertData) => {
          if (alertData.name.length > 64) {
            this.cmnService.presentErrToast('64자 이하로 입력해주세요.');
            return false;
          } else if (alertData.name.trim() === '' || alertData.name == null) {
            this.cmnService.presentErrToast('이름을 입력해주세요.');
            return false;
          } else {
            day.name = alertData.name.trim();
          }
        }
      }]
    });

    await alert.present();
  }

  async sortCatList(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: SortPopoverComponent,
      event: ev,
      translucent: true,
      cssClass: 'sort-popover'
    });

    popover.onDidDismiss().then(evDetail => {
      if (evDetail.role === 'sort') {
        const column = evDetail.data.column;
        const direction = evDetail.data.direction;

        if (direction === 0) {
          this.dayList.sort((a, b) => (a[column] > b[column]) ? 1 : -1);
        } else {
          this.dayList.sort((a, b) => (a[column] > b[column]) ? -1 : 1);
        }
      }
    });

    await popover.present();
  }

}
