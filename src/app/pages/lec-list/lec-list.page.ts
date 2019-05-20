import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { environment } from './../../../environments/environment';

import { CommonService } from './../../services/common.service';
import { SclwService } from './../../services/sclw.service';

import { Cat } from './../../models/Cat';
import { Lec } from './../../models/Lec';

@Component({
  selector: 'app-lec-list',
  templateUrl: './lec-list.page.html',
  styleUrls: ['./lec-list.page.scss'],
})
export class LecListPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;
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

  private async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const catId = this.route.snapshot.params.catId;
    this.cat = JSON.parse(this.route.snapshot.queryParams.data) as Cat;

    await this.getLecs(catId)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.getDefaultHref();
  }

  private getDefaultHref(): void {
    this.defaultHref = [this.pageInfo.catList.url, this.cat.sub.id];
  }

  private async getLecs(catId: string): Promise<any> {
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
