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
    path: pageInfo.list.path,
    loadChildren: './pages/list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: pageInfo.myInfo.path,
    loadChildren: './pages/my-info/my-info.module#MyInfoPageModule',
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
