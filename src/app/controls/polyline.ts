import { YandexService, ClickHandler } from '../services';
import { Polyline, Placemark } from '../models';

export class PolylineButton {
    private _isActive: boolean = false;
    private coords: Array<any> = [];

    constructor(private yandexService: YandexService, private clickHandler: ClickHandler) {
        let button = new this.yandexService.ymaps.control.Button("Ломаная");
        this.yandexService.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleButton.call(this));

        this.clickHandler.coordinateOfClick.subscribe(value => this.coords.push(value))
    }

    private toggleButton(): void {
        this._isActive = !!this._isActive ? false : true;

        if (this._isActive) {
            this.resetCoords();
            this.clickHandler.resetBufferOfClicks();
        } else if (!!this.coords) {
            const polyline = new Polyline(this.yandexService, this.coords);

            if (this.clickHandler.isFirstClickOnPlacemark && !this.clickHandler.isSecondClickOnPlacemark) {
                new Placemark(this.yandexService, this.clickHandler.lastClickPlacemarkCoords);
            } else if (!this.clickHandler.isSecondClickOnPlacemark && this.clickHandler.isSecondClickOnPlacemark) {
                new Placemark(this.yandexService, this.clickHandler.firstClickPlacemarkCoords);
            } else {
                new Placemark(this.yandexService, this.coords[0]);
                new Placemark(this.yandexService, this.coords[this.coords.length - 1]);
            }
            new Placemark(this.yandexService, this.coords[0]);
            polyline.save();
        }
    }

    private resetCoords(): void {
        this.coords = [];
    }
}
