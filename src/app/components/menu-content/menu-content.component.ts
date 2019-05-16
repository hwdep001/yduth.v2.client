import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements OnInit {

  @Input() menus: MenuInterface;
  public skipLocationChange = environment.skipLocationChange;

  constructor() { }

  ngOnInit() {}

}
