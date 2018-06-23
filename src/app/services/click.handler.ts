import { Injectable } from '@angular/core';
import { YandexService, ObjectManagerService } from '.';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ClickHandler {
    public coordinateOfClick: BehaviorSubject<any> = new BehaviorSubject([]);
    public firstClickPlacemarkCoords: Array<any>;
    public lastClickPlacemarkCoords: Array<any>;

    private isClickedOnPlacemark: boolean;
    private _click: number = 0;

    constructor(private yandexService: YandexService, private objectManagerService: ObjectManagerService) {
        this.yandexService.isInited.subscribe(isInited => {
            if (isInited) {
                this.yandexService.map.events.add('click', e => {
                    this.incrementClickCount();
                    this.isClickedOnPlacemark = false;
                    this.coordinateOfClick.next(e.get('coords'));
                });

                this.objectManagerService.coordsOfClick.subscribe(coords => {
                    this.incrementClickCount();
                    this.isClickedOnPlacemark = true;
                    if (this.isFirstClickOnPlacemark) {
                        this.firstClickPlacemarkCoords = coords;
                        this.coordinateOfClick.next(coords);
                    }
        
                    if (this.isSecondClickOnPlacemark) {
                        this.lastClickPlacemarkCoords = coords;
                        this.coordinateOfClick.next(coords);
                    }
                })
            }
        })
    }

    public resetBufferOfClicks(): void {
        this.firstClickPlacemarkCoords = null;
        this.lastClickPlacemarkCoords = null;
    }

    public get isFirstClickOnPlacemark(): boolean {
        return this.isClickedOnPlacemark && this._click === 1;
    }

    public get isSecondClickOnPlacemark(): boolean {
        return this.incrementClickCount && this._click > 1;
    }

    private incrementClickCount(): void {
        this._click = this._click + 1;
    }
}
