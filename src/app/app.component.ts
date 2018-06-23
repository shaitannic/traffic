import { Component } from '@angular/core';
import { ClickHandler } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    private clickHandler: ClickHandler,
  ) {
  }


}
