import { NgModule } from '@angular/core';

import { YandexControlsModule } from './controls/controls.module';
import { YandexMapComponent } from './map/yandex-map.component';
import { YandexService } from './yandex.service';

@NgModule({
    imports: [
        YandexControlsModule,
    ],
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
