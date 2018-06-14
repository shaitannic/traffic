import { NgModule } from '@angular/core';

import { YandexMapComponent } from './map/yandex-map.component';
import { YandexService } from './yandex.service';

@NgModule({
    imports: [],
    declarations: [
        YandexMapComponent,
    ],
    exports: [
        YandexMapComponent,
    ],
    providers: [
        YandexService,
    ]
})
export class YandexModule {}
