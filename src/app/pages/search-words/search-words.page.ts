import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

import { SclwService } from './../../services/sclw.service';
import { CommonService } from './../../services/common.service';

import { Sub } from './../../models/Sub';
import { Cat } from './../../models/Cat';
import { Day } from './../../models/day';

@Component({
  selector: 'app-search-words',
  templateUrl: './search-words.page.html',
  styleUrls: ['./search-words.page.scss'],
})
export class SearchWordsPage implements OnInit {

  private pageInfo = environment.pageInfo;
  public defaultHref: any;
  private sub: Sub;
  private cat: Cat;
  private day: Day;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('SearchWordsPage');
    this.initData();
  }

  private async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.sub = JSON.parse(this.route.snapshot.queryParamMap.get('sub')) as Sub;
    this.cat = JSON.parse(this.route.snapshot.queryParamMap.get('cat')) as Cat;
    this.day = JSON.parse(this.route.snapshot.queryParamMap.get('day')) as Day;

    await this.searchWords(this.sub, this.cat, this.day)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.getDefaultHref();
  }

  private getDefaultHref(): void {
    if (this.day != null) {
      // this.defaultHref = `${this.pageInfo.wordList.path}/${this.day.id}`;
    } else if (this.cat != null) {
      this.defaultHref = [this.pageInfo.dayList.url, this.cat.id];
    } else {
      this.defaultHref = [this.pageInfo.catList.url, this.sub.id];
    }
  }

  private async searchWords(sub: Sub, cat: Cat, day: Day): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(true);
    });
    // return await this.sclwService.getDays(catId)
    //   .then(rd => {
    //     if (rd.res) {
    //       this.dayList = rd.data as Array<Lec>;
    //     } else {
    //       alert(rd.toErrString());
    //     }
    //   }). catch(err => alert(err));
  }

}
