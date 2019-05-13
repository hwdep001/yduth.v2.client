import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Sub } from 'src/app/models/Sub';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.page.html',
  styleUrls: ['./cat-list.page.scss'],
})
export class CatListPage implements OnInit {

  public sub = new Sub();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.sub = JSON.parse(this.route.snapshot.queryParamMap.get('data')) as Sub;
  }

}
