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

  async presentSucToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      color: 'primary',
      duration: 2000,
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

  async presentErrToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

}
