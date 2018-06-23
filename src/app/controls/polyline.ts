import { YandexService } from '../yandex.service';
import { Polyline, Placemark } from '../models';

export class PolylineButton {
    private _isActive: boolean = false;
    private coords: Array<any> = [];

    constructor(private yandexService: YandexService) {
        this.yandexService.isInited.subscribe(isInited => {
            if (isInited) {
                this.defineButton();
            }
        })

        this.yandexService.coordinateOfClick.subscribe(value => this.coords.push(value))
    }

    private defineButton(): void {
        let button = new this.yandexService.ymaps.control.Button("Ломаная");
        this.yandexService.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleButton.call(this));
    }

    private toggleButton(): void {
        this._isActive = !!this._isActive ? false : true;

        if (this._isActive) {
            this.resetCoords();
            this.yandexService.resetBufferOfClicks();
        } else if (!!this.coords) {
            const polyline = new Polyline(this.yandexService, this.coords);

            if (this.yandexService.isFirstClickOnPlacemark) {
                // todo добавить связь между ребрами
            } else if (this.yandexService.isSecondClickOnPlacemark) {
                // todo добавить связь между ребрами
            } else {
                new Placemark(this.yandexService, this.coords[0]);
                new Placemark(this.yandexService, this.coords[this.coords.length - 1]);
            }

            polyline.save();
        }
    }

    private resetCoords(): void {
        this.coords = [];
    }
}
