import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Car } from '../models';
import { environment } from '../../environments/environment';
import { ClickHandler } from '.';

declare var ymaps: any;

@Injectable()
export class YandexService {
    public ymaps: any;
    public map: any;
    public isInited: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    private _apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        this.ymaps = ymaps;
        this.ymaps.ready().then(() => {
            this.initMap();
        });
    }

    public getUsers(): Observable<any> {
        return this.http.get(this._apiUrl + '/users');
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
}
