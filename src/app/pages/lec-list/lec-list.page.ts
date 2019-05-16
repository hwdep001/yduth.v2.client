import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { environment } from './../../../environments/environment';

import { CommonService } from './../../services/common.service';
import { SclwService } from './../../services/sclw.service';

import { Cat } from './../../models/Cat';
import { Lec } from './../../models/Lec';
// import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-lec-list',
  templateUrl: './lec-list.page.html',
  styleUrls: ['./lec-list.page.scss'],
})
export class LecListPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public cat: Cat;
  public lecList: Array<Lec>;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('LecListPage');
    this.initData();
  }

  // ionViewWillEnter() { }

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const catId = this.route.snapshot.params.catId;
    this.cat = this.route.snapshot.queryParams as Cat;
    console.log(this.cat);

    await this.getLecs(catId)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  async getLecs(catId: string): Promise<any> {
    return await this.sclwService.getLecs(catId)
      .then(rd => {
        if (rd.res) {
          this.lecList = rd.data as Array<Lec>;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

}
