import { YandexService } from '../yandex.service';
import { Polyline } from '../models/polyline';

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
        } else if (!!this.coords) {
            let polylyne = new Polyline(this.yandexService);
            polylyne.create(this.coords);
            polylyne.save();
        }
    }

    private resetCoords(): void {
        this.coords = [];
    }
}
