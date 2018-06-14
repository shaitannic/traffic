import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { YandexModule } from './yandex/yandex.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    YandexModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
