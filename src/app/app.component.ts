import { Component } from '@angular/core';
import { YandexService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private yandexService: YandexService,
  ) {
  }


}
