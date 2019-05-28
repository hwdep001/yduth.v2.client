import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthGuard } from './../../guards/auth.guard';
import { SettingTabPage } from './setting-tab.page';

const p = environment.pageInfo;

const routes: Routes = [
  {
    path: '',
    redirectTo: p.setting.tab.path,
    pathMatch: 'full'
  },
  {
    path: p.setting.tab.path,
    component: SettingTabPage,
    children: [
      {
        path: '',
        redirectTo: p.setting.word.path,
        pathMatch: 'full'
      },
      {
        path: p.setting.word.path,
        loadChildren: './setting-word/setting-word.module#SettingWordPageModule',
        canActivate: [AuthGuard]
      },
      {
        path: p.setting.exam.path,
        loadChildren: './setting-exam/setting-exam.module#SettingExamPageModule',
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingTabPage]
})
export class SettingTabPageModule {}
