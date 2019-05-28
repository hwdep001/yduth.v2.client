import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CommonService } from 'src/app/services/common.service';
import { SclwService } from 'src/app/services/sclw.service';

import { Sub } from 'src/app/models/Sub';
import { Cat } from 'src/app/models/Cat';
import { DayListModalPage } from '../../modals/day-list-modal/day-list-modal.page';

@Component({
  selector: 'app-setting-word',
  templateUrl: './setting-word.page.html',
  styleUrls: ['./setting-word.page.scss'],
})
export class SettingWordPage implements OnInit {

  public subList: Array<Sub>;

  constructor(
    private modalCtrl: ModalController,
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

  async presentInitModal(cat: Cat): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: DayListModalPage,
      componentProps: {
        'cat': cat
      }
    });

    return await modal.present();
  }

}
