import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { environment } from 'src/environments/environment';

const p = environment.pageInfo;

const routes: Routes = [
  {
    path: p.root.path,
    redirectTo: p.home.path,
    pathMatch: 'full'
  },
  {
    path: p.signIn.path,
    loadChildren: './pages/sign-in/sign-in.module#SignInPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.home.path,
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.catList.path,
    loadChildren: './pages/cat-list/cat-list.module#CatListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.dayList.path,
    loadChildren: './pages/day-list/day-list.module#DayListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.examReady.path,
    loadChildren: './pages/exam-ready/exam-ready.module#ExamReadyPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.searchWords.path,
    loadChildren: './pages/search-words/search-words.module#SearchWordsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.profile.path,
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.photo.path,
    loadChildren: './pages/photo/photo.module#PhotoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.setting.path,
    loadChildren: './pages/setting-tab/setting-tab.module#SettingTabPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: p.setting.wordInit.path,
    loadChildren: './pages/setting-tab/word-init/word-init.module#WordInitPageModule',
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
