import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private datePipe: DatePipe,
  ) { }

  async presentSucToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
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
      message,
      position: 'bottom',
      color: 'danger',
      showCloseButton: true,
      closeButtonText: 'Close',
      animated: true,
      translucent: true
    });
    toast.present();
  }

  async getAlert(header: string, subHeader: string, message: string): Promise<HTMLIonAlertElement> {
    return await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: ['Close']
    });
  }

  async getLoading(message?: string, duration?: number): Promise<HTMLIonLoadingElement> {
    return await this.loadingCtrl.create({
      spinner: 'bubbles',
      message: (message == null ? 'Loading...' : message),
      animated: true,
      translucent: true,
      duration: (duration == null ? 20000 : duration)
    });
  }

  toStringDateTime(date?: Date, format?: string): string {
    if (date == null) {
      date = new Date();
    }
    if (format == null || format.trim() === '') {
      format = 'yyyy-MM-dd HH:mm:ss';
    }
    return this.datePipe.transform(date, format);
  }

}
