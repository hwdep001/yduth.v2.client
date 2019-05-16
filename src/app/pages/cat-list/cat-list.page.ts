import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from './../../services/common.service';
import { SubService } from './../../services/sub.service';

import { Sub } from 'src/app/models/Sub';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.page.html',
  styleUrls: ['./cat-list.page.scss'],
})
export class CatListPage implements OnInit {

  public sub: Sub;

  constructor(
    private route: ActivatedRoute,
    private cmnService: CommonService,
    private subService: SubService
  ) { }

  ngOnInit() {
    console.log('CatListPage');
    this.initData();
  }

  async initData() {
    const loading = await this.cmnService.getLoading();
    loading.present();

    const subId = this.route.snapshot.params.subId;

    await this.getSubWithCats(subId)
    .then(() => loading.dismiss())
    .catch(() => loading.dismiss());
  }

  async getSubWithCats(subId: string): Promise<any> {
    return await this.subService.getSubWithCats(subId)
      .then(rd => {
        if (rd.res) {
          this.sub = rd.data as Sub;
        } else {
          alert(rd.toErrString());
        }
      }). catch(err => alert(err));
  }

}
