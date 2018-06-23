import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Car } from '../models';
import { environment } from '../../environments/environment';
import { Polyline, Placemark } from '../models/index';

declare var ymaps: any;

@Injectable()
export class YandexService {
    public ymaps: any;
    public map: any;
    public objectManagerPolyline: any;
    public objectManagerPlacemark: any;
    public isInited: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _isActive: boolean = false;
    private _coords: Array<any> = [];
    private _apiUrl = environment.apiUrl;
    private isClickedOnPlacemark: boolean;
    private _clickCount: number = 0;
    public firstClickPlacemarkCoords: Array<any>;
    public lastClickPlacemarkCoords: Array<any>;

    /** Используются для установки связей между перегонами */
    private polylineRelation: Array<any>;

    constructor(private http: HttpClient) {
        this.ymaps = ymaps;
        this.ymaps.ready().then(() => {
            this.initMap();
        });

        this.isInited.subscribe(isInited => {
            if (isInited) {
                this.createAddPolylineButton();
                this.createSettingPolylineButton();
                this.createPlacemarkBuffer();
                this.createPolylineBuffer();
                this.subscribeToClickOnMap();
            }
        })
    }

    public savePolyline(params): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        const polyline = JSON.stringify(params);
        return this.http.post(this._apiUrl + '/polyline', polyline, { headers });
    }

    private initMap(): void {
        this.map = new this.ymaps.Map('map', {
            center: [55.76, 37.64],
            controls: ['zoomControl'],
            zoom: 7
        });

        this.isInited.next(true);
    }

    private createAddPolylineButton(): void {
        let button = new this.ymaps.control.Button("Ломаная");
        this.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleAddPolylineButton.call(this));
    }

    private toggleAddPolylineButton(): void {
        this._isActive = !!this._isActive ? false : true;

        if (this._isActive) {
            this.resetCoords();
            this.resetCoords();
        } else if (!!this._coords) {
            if (this.isFirstClickOnPlacemark && !this.isSecondClickOnPlacemark) {
                new Placemark(this, this.lastClickPlacemarkCoords);
            } else if (!this.isFirstClickOnPlacemark && this.isSecondClickOnPlacemark) {
                new Placemark(this, this.firstClickPlacemarkCoords);
            } else {
                new Placemark(this, this._coords[0]);
                new Placemark(this, this._coords[this._coords.length - 1]);
            }
            new Polyline(this, this._coords);
        }
    }

    private createPlacemarkBuffer(): void {
        this.objectManagerPlacemark = new ymaps.ObjectManager({
            gridSize: 32,
            clusterDisableClickZoom: true
        });

        this.map.geoObjects.add(this.objectManagerPlacemark);
        setTimeout(() => {
            this.http.get(this._apiUrl + '/placemark-object-manager').subscribe(data => {
                this.objectManagerPlacemark.add(data);
                this.objectManagerPlacemark.objects.events.add('click', e => {
                    const objectId = e.get('objectId');
                    const obj = this.objectManagerPlacemark.objects.getById(objectId);
                    const currentCoords = obj.geometry.coordinates;
                    this._coords.push(currentCoords);
        
                    this.incrementClickCount();
                    this.isClickedOnPlacemark = true;
                    if (this.isFirstClickOnPlacemark) {
                        this.firstClickPlacemarkCoords = currentCoords;
                    }
        
                    if (this.isSecondClickOnPlacemark) {
                        this.lastClickPlacemarkCoords = currentCoords;
                    }
                })
            });
        }, 1000)
    }

    private subscribeToClickOnMap(): void {
        this.map.events.add('click', e => {
            this.incrementClickCount();
            this.isClickedOnPlacemark = false;
            const coords = e.get('coords');
            this._coords.push(coords)
            console.log(coords);
        });
    }

    public get isFirstClickOnPlacemark(): boolean {
        return this.isClickedOnPlacemark && this._clickCount === 1;
    }

    public get isSecondClickOnPlacemark(): boolean {
        return this.isClickedOnPlacemark && this._clickCount > 1;
    }

    private resetCoords(): void {
        this.firstClickPlacemarkCoords = null;
        this.lastClickPlacemarkCoords = null;
        this._clickCount = 0;
        this._coords = [];
    }

    private incrementClickCount(): void {
        this._clickCount = this._clickCount + 1;
    }

    /******************** Добавить связь между перегонами *************/

    private createSettingPolylineButton(): void {
        let button = new this.ymaps.control.Button("Добавить связь");
        this.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleSettingPolylineButton.call(this));
    }

    private toggleSettingPolylineButton(): void {
        this._isActive = !!this._isActive ? false : true;

        if (this._isActive) {
            this.polylineRelation = [];
        } else if (this.polylineRelation.length > 0) {
            const params = {
                firstPolyline: this.polylineRelation[0],
                lastPolyline: this.polylineRelation[1]
            }

            const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
            this.http.post(this._apiUrl + '/add-relation', params, { headers }).subscribe(success => {
                console.log(success);
            }, err => {
                console.log(err);
            })
        }
    }

    private createPolylineBuffer(): void {
        this.objectManagerPolyline = new ymaps.ObjectManager({
            gridSize: 32,
            clusterDisableClickZoom: true
        });

        this.map.geoObjects.add(this.objectManagerPolyline);
        setTimeout(() => {
            this.http.get(this._apiUrl + '/polyline-object-manager').subscribe(data => {
                this.objectManagerPolyline.add(data);

                // клик левой кнопкой мыши
                this.objectManagerPolyline.objects.events.add('click', e => {
                    const objectId = e.get('objectId');
                    //const obj = this.objectManagerPolyline.objects.getById(objectId);
                    console.log(objectId);
                    this.polylineRelation.push(objectId);
                })
            });
        }, 1000)
    }


}
