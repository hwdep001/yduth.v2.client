import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements OnInit {

  @Input() menus: MenuInterface;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  movePage(p: PageInterface) {
    this.router.navigate([p.url], {
      queryParams: {data: JSON.stringify(p.param)},
      skipLocationChange: true
    });
  }

}
