import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PolylineButton } from './controls/polyline';
import 'rxjs/Rx';

declare var ymaps: any;

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
            let polylineButton = new PolylineButton(this);
        })
    }

    public save(object): void {
        // todo save to file
        // request to server
    }

    private initMap(): void {
        this.map = new this.ymaps.Map("map", {
            center: [55.76, 37.64],
            controls: ['zoomControl'],
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
