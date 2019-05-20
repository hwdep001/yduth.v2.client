import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from './../../../environments/environment';

import { SclwService } from './../../services/sclw.service';
import { CommonService } from './../../services/common.service';

import { Cat } from './../../models/Cat';
import { Day } from '../../models/day';

@Component({
  selector: 'app-day-list',
  templateUrl: './day-list.page.html',
  styleUrls: ['./day-list.page.scss'],
})
export class DayListPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;
  public cat: Cat;
  public dayList: Array<Day>;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('DayListPage');
    this.initData();
  }

  // ionViewWillEnter() { }

  private async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const catId = this.route.snapshot.params.catId;
    this.cat = JSON.parse(this.route.snapshot.queryParams.data) as Cat;

    await this.getDays(catId)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.getDefaultHref();
  }

  private getDefaultHref(): void {
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

}
