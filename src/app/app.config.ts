import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CustomToastComponent } from './Common/layout/custom-toast/custom-toast.component';
import { provideNgProgressHttp, progressInterceptor } from 'ngx-progressbar/http';
import { provideNgProgressOptions } from 'ngx-progressbar';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(routes),
    provideAnimations(), // required animations providers
    provideToastr({
        toastComponent: CustomToastComponent,
        closeButton: true,
        positionClass: 'toast-top-right',
        newestOnTop: false, // added custom toast!
      }), // Toastr providers
    provideHttpClient(withInterceptors([progressInterceptor])),
    provideNgProgressOptions({
      trickleSpeed: 200,
      min: 20,
      flat: true
    })
  ]
};