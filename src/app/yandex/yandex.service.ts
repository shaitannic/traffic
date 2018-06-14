import { Injectable } from '@angular/core';
import { Yandex } from './yandex.interface';

declare var ymaps: Yandex;

@Injectable()
export class YandexService {
    public ymaps: Yandex;

    constructor(){
        this.ymaps = ymaps;
    }
}
