import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { YandexService } from './yandex.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    YandexService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
