import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { SclwService } from './../../services/sclw.service';

import { Sub } from 'src/app/models/Sub';
import { Cat } from 'src/app/models/Cat';
import { deepCopy } from 'src/app/utils/deep-copy';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.page.html',
  styleUrls: ['./cat-list.page.scss'],
  providers: [DatePipe]
})
export class CatListPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public unsubscribeBackEvent: Subscription;

  public sub: Sub;
  public subCopy: Sub;
  public allCheck: boolean;

  public isFabBtn = true;
  public isSetting = false;

  constructor(
    private platform: Platform,
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private alertCtrl: AlertController,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('CatListPage');
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
        this.cancelSetting();
      });
    });
  }

  async initData(): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const subId = this.route.snapshot.params.subId;

    await this.getSubWithCats(subId)
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());
  }

  private async getSubWithCats(subId: string): Promise<any> {
    return await this.sclwService.getSubWithCats(subId)
      .then(rd => {
        if (rd.res) {
          this.sub = rd.data as Sub;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

  moveLecListPage(cat: Cat): void {
    const sub = new Sub();
    sub.id = this.sub.id;
    sub.name = this.sub.name;
    sub.num = this.sub.num;
    cat.sub = sub;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(cat)
      },
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.lecList.url, cat.id], navigationExtras);
  }

  moveSearchPage(): void {
    const sub = new Sub();
    sub.id = this.sub.id;
    sub.name = this.sub.name;
    sub.num = this.sub.num;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        sub: JSON.stringify(sub)
      },
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.searchWords.url], navigationExtras);
  }

  onRenderItems(event): void {
    const size = this.sub.type1CatList.length - 1;
    const from = size - event.detail.from;
    const to = size - event.detail.to;

    const draggedItem = this.sub.type1CatList.splice(from, 1)[0];
    this.sub.type1CatList.splice(to, 0, draggedItem);
    event.detail.complete();
  }

  clickAllCheck(ev) {
    const checkVal = !ev.target.checked;
    for (const cat of this.sub.type1CatList) {
      cat.checked = checkVal;
    }
  }

  clickCatCheck(ev, cat: Cat) {
    const checkVal = !ev.target.checked;
    cat.checked = checkVal;

    let allCheck = true;
    for (const tempCat of this.sub.type1CatList) {
      if (!tempCat.checked) {
        allCheck = false;
        break;
      }
    }

    this.allCheck = allCheck;
    cat.checked = !checkVal;
  }

  clickSetting(): void {
    this.subscribeBackButton();
    this.subCopy = <Sub>deepCopy(this.sub);
    this.isSetting = true;
    this.isFabBtn = false;
  }

  cancelSetting(): void {
    this.unsubscribeBackEvent.unsubscribe();
    this.sub = this.subCopy;
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
            this.updateDeleteType1Cat();
          }
        }
      ]
    });

    await alert.present();
  }

  clickTrash(): void {
    this.sub.type1CatList = this.sub.type1CatList.filter((cat) => {
      return !cat.checked;
    });
  }

  private async addType1Cat(newName: string): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const newCat = new Cat();
    newCat.name = newName;
    newCat.sub = this.sub;

    const rd = await this.sclwService.addType1Cat(newCat);

    if (rd.res) {
      this.sub = rd.data as Sub;
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    loading.dismiss();
  }

  private async updateDeleteType1Cat(): Promise<any> {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const catCopyMap = new Map<Number, Cat>();
    const sub = new Sub();
    sub.id = this.sub.id;
    sub.name = this.sub.name;
    sub.num = this.sub.num;
    sub.type0CatList = new Array<Cat>();  // for delete list
    sub.type1CatList = new Array<Cat>();  // for update list

    // subCopy map 생성
    this.subCopy.type1CatList.forEach((cat) => {
      catCopyMap.set(cat.id, cat);
    });

    // 비교하여 update list에 추가
    this.sub.type1CatList.forEach((cat, index) => {
      const catCopy = catCopyMap.get(cat.id);

      cat.num = index + 1;
      if (catCopy.name !== cat.name || catCopy.num !== cat.num) {
        sub.type1CatList.push(cat);
      }

      catCopyMap.delete(catCopy.id);
    });

    // subCopy map 남은 목록 delete list에 추가
    catCopyMap.forEach((cat) => {
      sub.type0CatList.push(cat);
    });

    const rd = await this.sclwService.updateDeleteType1Cat(sub);

    if (rd.res) {
      this.sub = rd.data as Sub;
      this.isSetting = false;
      this.isFabBtn = true;
    } else {
      this.cmnService.presentErrToast(rd.toErrString());
    }

    loading.dismiss();
  }

  async alertNewType1Cat() {
    this.isFabBtn = false;

    const defaultName = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const alert = await this.alertCtrl.create({
      header: '단어장 추가',
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

          this.addType1Cat(alertData.name.trim())
            .finally(() => this.isFabBtn = true);
        }
      }]
    });

    await alert.present();
  }

  async alertUpdateName(cat: Cat) {
    const alert = await this.alertCtrl.create({
      header: '이름 변경',
      inputs: [{
        name: 'name',
        value: cat.name,
        placeholder: cat.name
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
            cat.name = alertData.name.trim();
          }
        }
      }]
    });

    await alert.present();
  }

}
