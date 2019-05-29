import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

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

  getSubIdNameMap() {
    const subMap = new Map<string, string>();
    subMap.set('sp', '맞춤법');
    subMap.set('sl', '표준어');
    subMap.set('lw', '외래어');
    subMap.set('kw', '어휘');
    subMap.set('cc', '한자');
    subMap.set('c4', '한자성어');
    subMap.set('ew', '영단어');
    return subMap;
  }

  async presentSucToast(message: string, position?: ToastOptions['position']) {

    const toast = await this.toastCtrl.create({
      message,
      position: (position === null ? 'bottom' : position),
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
