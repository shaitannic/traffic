import { Component, OnInit } from '@angular/core';
import { YandexService } from '../../yandex.service';
import { Yandex } from '../../yandex.interface';
import { Polyline } from '../../models/polyline';

@Component({
    selector: 'add-polyline',
    templateUrl: './polyline.component.html',
    styleUrls: ['./polyline.component.less']
})
export class PolylineComponent implements OnInit {
    private _isActive: boolean = false;
    private coords: Array<any> = [];

    constructor(private yandexService: YandexService) {
    }

    ngOnInit(): void {
        this.yandexService.isInited.subscribe(isInited => {
            if (isInited) {
                this.defineButton();
            }
        })

        this.yandexService.coordinateOfClick.subscribe(value => this.coords.push(value))
    }

    private defineButton(): void {
        let button = new this.yandexService.ymaps.control.Button("Кнопка");
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
