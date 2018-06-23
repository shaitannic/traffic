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
    public isInited: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private _isActive: boolean = false;
    private _coords: Array<any> = [];
    private _apiUrl = environment.apiUrl;
    private isClickedOnPlacemark: boolean;
    private _clickCount: number = 0;
    public firstClickPlacemarkCoords: Array<any>;
    public lastClickPlacemarkCoords: Array<any>;

    private objectManagerPlacemark: any;
    private objectManagerPolyline: any;

    constructor(private http: HttpClient) {
        this.ymaps = ymaps;
        this.ymaps.ready().then(() => {
            this.initMap();
        });

        this.isInited.subscribe(isInited => {
            if (isInited) {
                this.createButton();
                this.createBufferForPlacemark();
                this.createBufferForPolyline();
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

    private createButton(): void {
        let button = new this.ymaps.control.Button("Ломаная");
        this.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleButton.call(this));
    }

    private toggleButton(): void {
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

    private createBufferForPlacemark(): void {
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
                    console.log(obj);
        
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

    private createBufferForPolyline(): void {
        this.objectManagerPolyline = new ymaps.ObjectManager({
            gridSize: 32,
            clusterDisableClickZoom: true
        });
        this.map.geoObjects.add(this.objectManagerPolyline);
        this.http.get(this._apiUrl + '/polyline-object-manager').subscribe(data => {
            this.objectManagerPolyline.add(data);
        })
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
}
