import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { SclwService } from 'src/app/services/sclw.service';

import { Cat } from './../../models/Cat';
import { Day } from './../../models/Day';

@Component({
  selector: 'app-test-ready',
  templateUrl: './test-ready.page.html',
  styleUrls: ['./test-ready.page.scss'],
})
export class TestReadyPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;

  public cat: Cat;
  public dayList: Array<Day>;

  public allCheck: boolean;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('TestReadyPage');
    this.initData();
  }

  private async initData(): Promise<any> {
    // const loading = await this.cmnService.getLoading();
    // loading.present();

    this.cat = JSON.parse(this.route.snapshot.queryParamMap.get('cat')) as Cat;

    // await this.getDays(this.cat.id)
    // .then(() => loading.dismiss())
    // .catch(() => loading.dismiss());

    this.defaultHref = [this.pageInfo.catList.url, this.cat.sub.id];
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

}
