import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment';

import { SclwService } from './../../services/sclw.service';
import { CommonService } from './../../services/common.service';

import { Sub } from './../../models/Sub';
import { Cat } from './../../models/Cat';
import { Lec } from './../../models/Lec';

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
  private lec: Lec;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private sclwService: SclwService
  ) { }

  ngOnInit() {
    console.log('LecListPage');
    this.initData();
  }

  private async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    this.sub = JSON.parse(this.route.snapshot.queryParamMap.get('sub')) as Sub;
    this.cat = JSON.parse(this.route.snapshot.queryParamMap.get('cat')) as Cat;
    this.lec = JSON.parse(this.route.snapshot.queryParamMap.get('lec')) as Lec;

    await this.searchWords(this.sub, this.cat, this.lec)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());

    this.getDefaultHref();
  }

  private getDefaultHref(): void {
    if (this.lec != null) {
      // this.defaultHref = `${this.pageInfo.wordList.path}/${this.lec.id}`;
    } else if (this.cat != null) {
      this.defaultHref = [this.pageInfo.lecList.url, this.cat.id];
    } else {
      this.defaultHref = [this.pageInfo.catList.url, this.sub.id];
    }
  }

  private async searchWords(sub: Sub, cat: Cat, lec: Lec): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(true);
    });
    // return await this.sclwService.getLecs(catId)
    //   .then(rd => {
    //     if (rd.res) {
    //       this.lecList = rd.data as Array<Lec>;
    //     } else {
    //       alert(rd.toErrString());
    //     }
    //   }). catch(err => alert(err));
  }

}
