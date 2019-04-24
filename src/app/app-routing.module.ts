import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { environment } from 'src/environments/environment';

const pageInfo = environment.pageInfo;

const routes: Routes = [
  {
    path: pageInfo.root.path,
    redirectTo: pageInfo.home.path,
    pathMatch: 'full'
  },
  {
    path: pageInfo.signIn.path,
    loadChildren: './pages/sign-in/sign-in.module#SignInPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.home.path,
    loadChildren: './pages/home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.catList.path,
    loadChildren: './pages/cat-list/cat-list.module#CatListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.groupList.path,
    loadChildren: './pages/group-list/group-list.module#GroupListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.profile.path,
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.photo.path,
    loadChildren: './pages/photo/photo.module#PhotoPageModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
