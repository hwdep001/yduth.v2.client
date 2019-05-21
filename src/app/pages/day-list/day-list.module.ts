import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DayListPage } from './day-list.page';
import { SortPopoverComponent } from 'src/app/components/sort-popover/sort-popover.component';

const routes: Routes = [
  {
    path: '',
    component: DayListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [SortPopoverComponent],
  declarations: [
    DayListPage,
    SortPopoverComponent
  ]
})
export class DayListPageModule {}
