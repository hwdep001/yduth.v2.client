import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-sort-popover',
  templateUrl: './sort-popover.component.html',
  styleUrls: ['./sort-popover.component.scss'],
})
export class SortPopoverComponent {

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  /**
   * 리턴 sort 데이터
   * @param column 컬럼명
   * @param direction 0: ASC, 1: DESC
   */
  async dismiss(column: string, direction: number) {
    await this.popoverCtrl.dismiss({
      column,
      direction
    }, 'sort');
  }

}
