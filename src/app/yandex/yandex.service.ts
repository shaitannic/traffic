import { Injectable } from '@angular/core';
import { Yandex, YandexMap } from './yandex.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

declare var ymaps: Yandex;

@Injectable()
export class YandexService {
    public ymaps: any;
    public map: any;
    public isInited: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //Координаты клика
    public coordinateOfClick: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(){
        this.ymaps = ymaps;
        this.ymaps.ready().then(() => {
            this.initMap();
        })
    }

    private initMap(): void {
        this.map = new this.ymaps.Map("map", {
            center: [55.76, 37.64],
            controls: [],
            zoom: 7
        })

        this.map.events.add('click', e => this.setCoordinates.call(this, e));
        this.isInited.next(true);
    }

    private setCoordinates(e): void {
        var coords = e.get('coords');
        this.coordinateOfClick.next(coords);
    }
}
