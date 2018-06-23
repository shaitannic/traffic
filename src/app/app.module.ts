import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { YandexService, ClickHandler } from './services';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    YandexService,
    ClickHandler,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
  constructor(private yandexService: YandexService) {}
}
