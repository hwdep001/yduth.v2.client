import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingWordInitDaysPage } from './setting-word-init-days.page';

const routes: Routes = [
  {
    path: '',
    component: SettingWordInitDaysPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingWordInitDaysPage]
})
export class SettingWordInitDaysPageModule {}
