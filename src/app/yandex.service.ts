import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PolylineButton } from './controls/polyline';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Car } from './models';

declare var ymaps: any;

@Injectable()
export class YandexService {
    public ymaps: any;
    public map: any;
    public isInited: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //Координаты клика
    public coordinateOfClick: BehaviorSubject<any> = new BehaviorSubject([]);

    private url = 'http://localhost:8000';

    private _isFirstClick: boolean;
    private _isLastClick: boolean;

    public firstClickPlacemarkCoords: Array<any>;
    public lastClickPlacemarkCoords: Array<any>;

    constructor(private http: HttpClient){
        this.ymaps = ymaps;
        this.ymaps.ready().then(() => {
            this.initMap();
            let polylineButton = new PolylineButton(this);
        })
    }

    public getUsers(): Observable<any> {
        return this.http.get(this.url + '/users')
    }

    public savePolyline(params): Observable<any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const polyline = JSON.stringify(params);
        return this.http.post(this.url + '/polyline', polyline, { headers });
    }

    private initMap(): void {
        this.map = new this.ymaps.Map("map", {
            center: [55.76, 37.64],
            controls: ['zoomControl'],
            zoom: 7
        })

        // this.map.events.add('click', e => this.setCoordinates.call(this, e));
        this.isInited.next(true);
    }

    private setCoordinates(e): void {
        const coords = e.get('coords');

        if (this.isClickedOnPlacemark(e)) {

            if (this._isFirstClick) {
                this.saveFirstClickCoords(coords);
            }

            if (this._isLastClick) {
                this.saveLastClickCoords(coords);
            }
        }

        this.coordinateOfClick.next(coords);
    }

    private saveFirstClickCoords(coords): void {
        this.firstClickPlacemarkCoords = coords;
        this._isFirstClick = false;
    }

    private saveLastClickCoords(coords): void {
        this.lastClickPlacemarkCoords = coords;
    }

    /** @desc сбросить счетчик первого и последнего клика */
    public resetBufferOfClicks(): void {
        this._isFirstClick = true;
        this._isLastClick = true;
        this.firstClickPlacemarkCoords = null;
        this.lastClickPlacemarkCoords = null;
    }

    private isClickedOnPlacemark(e): boolean {
        return true;
    }

    public get isFirstClickOnPlacemark(): boolean {
        // добавить проверку, что первый клик был на Placemark
        return true;
    }

    public get isSecondClickOnPlacemark(): boolean {
        // добавить проверку, что последний клик был на Placemark
        return true;
    }
}
