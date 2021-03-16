import { Injectable } from '@angular/core';
import * as izitoast from 'izitoast';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  confirm(message: string, okCallBack: () => any) {
    izitoast.show({
      theme: 'dark',
      timeout: 2500,
      message,
      position: 'center',
      progressBarColor: 'rgb(0, 255, 184)',
      buttons: [
        [
          '<button>Ok</button>',
          (instance: any, toast: any) => {
            okCallBack();

            instance.hide(
              {
                transitionOut: 'fadeOutUp',
              },
              toast
            );
          },
        ],
        [
          '<button>Close</button>',
          (instance: any, toast: any) => {
            instance.hide(
              {
                transitionOut: 'fadeOutUp',
              },
              toast
            );
          },
        ],
      ],
    });
  }

  success(message: string) {
    izitoast.success({
      title: 'Success:',
      message,
      position: 'topCenter',
      timeout: 2500,
    });
  }

  error(message: string) {
    izitoast.error({
      title: 'Error:',
      message,
      position: 'bottomRight',
      timeout: 2500,
    });
  }

  warning(message: string) {
    izitoast.warning({
      title: 'Warning:',
      message,
      position: 'bottomRight',
      timeout: 2500,
    });
  }

  info(message: string) {
    izitoast.info({
      title: 'Info:',
      message,
      position: 'bottomRight',
      timeout: 2500,
    });
  }

  message(message: string) {
    izitoast.show({
      message,
      position: 'center',
      timeout: 4000,
    });
  }
}
