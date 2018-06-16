import { Component, OnInit } from '@angular/core';
import { YandexService } from '../../yandex.service';
import { Yandex } from '../../yandex.interface';

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

        this.yandexService.coordinateOfClick.subscribe(value => {
            console.log(this.coords)
            this.coords.push(value);
        })
    }

    private defineButton(): void {
        let button = new this.yandexService.ymaps.control.Button("Кнопка");
        this.yandexService.map.controls.add(button, { float: 'right' });
        button.events.add('click', e => this.toggleButton.call(this));
    }

    private toggleButton(): void {
        this._isActive = !!this._isActive ? false : true;

        if (this._isActive) {
            this.coords = [];
        } else if (!!this.coords) {
            this.createPolyline();
        }

        console.log('button is clicked');
    }

    // Создаем ломаную с помощью вспомогательного класса Polyline.
    private createPolyline(): void {
        var myPolyline = new this.yandexService.ymaps.Polyline(this.coords, {
            balloonContent: "Ломаная линия"
        }, {
            // Цвет линии.
            strokeColor: "#000000",
            // Ширина линии.
            strokeWidth: 4,
            // Коэффициент прозрачности.
            strokeOpacity: 0.5
        });

        this.yandexService.map.geoObjects.add(myPolyline);
    }

    // Определяем координаты щелчка
    private getCoordinateOfClick(): void {
        this.yandexService.map.events.add('click', function (e) {
            var coords = e.get('coordPosition');
            console.log(coords);
        });
    }
}
