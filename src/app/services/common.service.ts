import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

}
