import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/dist/providers/nav-controller';

import { environment } from 'src/environments/environment';
import { CommonService } from './../../services/common.service';
import { SclwService } from './../../services/sclw.service';

import { Sub } from 'src/app/models/Sub';
import { Cat } from 'src/app/models/Cat';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.page.html',
  styleUrls: ['./cat-list.page.scss'],
})
export class CatListPage implements OnInit {

  public pageInfo = environment.pageInfo;
  public sub: Sub;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
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

  moveLecList(cat: Cat): void {
    const sub = this.sub;
    sub.type0CatList = null;
    sub.type1CatList = null;
    cat.sub = sub;

    const navigationExtras: NavigationExtras = {
      queryParams: cat,
      skipLocationChange: environment.skipLocationChange
    };
    this.router.navigate([this.pageInfo.lecList.url, cat.id], navigationExtras);
  }

}
