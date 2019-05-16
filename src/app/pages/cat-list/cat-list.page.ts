import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { SclwService } from './../../services/sclw.service';

import { Sub } from 'src/app/models/Sub';
import { Cat } from 'src/app/models/Cat';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.page.html',
  styleUrls: ['./cat-list.page.scss'],
  providers: [DatePipe]
})
export class CatListPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public sub: Sub;

  public isFabBtn = true;

  constructor(
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

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const subId = this.route.snapshot.params.subId;

    await this.getSubWithCats(subId)
      .then(() => loading.dismiss())
      .catch(() => loading.dismiss());
  }

  async getSubWithCats(subId: string): Promise<any> {
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

  async alertNewType1Cat() {
    this.isFabBtn = false;

    const defaultName = '단어장 '  + this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const alert = await this.alertCtrl.create({
      header: '단어장 추가',
      inputs: [{
        name: 'name',
        value: defaultName
      }],
      buttons: [{
        text: '취소',
        role: 'cancel',
        handler: () => {
          this.isFabBtn = true;
        }
      }, {
        text: '추가',
        handler: async (alertData) => {
          let catName = alertData.name;

          if (catName.length > 64) {
            this.cmnService.presentErrToast('64자 이하로 입력해주세요.');
            return;
          } else if (catName === '' || catName == null) {
            catName = defaultName;
          }

          const loading = await this.cmnService.getLoading();
          loading.present();

          const newCat = new Cat();
          newCat.name = catName;
          newCat.sub = this.sub;

          const rd = await this.sclwService.addType1Cat(newCat);

          if (rd.res) {
            this.sub = rd.data as Sub;
          } else {
            this.cmnService.presentErrToast(rd.toErrString());
          }

          loading.dismiss();
          this.isFabBtn = true;
        }
      }]
    });

    await alert.present();
  }

}
