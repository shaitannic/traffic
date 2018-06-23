import { YandexService } from '../services';

export class Placemark {
    myPlacemark: any;

    type: 'Feature';

    options: any = {
        strokeColor: '#000000', // Цвет линии
        strokeWidth: 4, // Ширина линии
        strokeOpacity: 0.5 // Коэффициент прозрачности
    };

    properties: any = {
        balloonContent: 'Перекресток'
    };

    geometry: any = {
        type: 'Point',
        coordinates: []
    };

    constructor(private yandexService: YandexService, coords: any) {
        this.geometry.coordinates = coords;

        this.myPlacemark = new this.yandexService.ymaps.GeoObject({
            geometry: this.geometry,
            properties: this.properties
        });

        this.yandexService.map.geoObjects.add(this.myPlacemark);
    }

    public save(): void {
        const object = {
            type: this.type,
            options: this.options,
            properties: this.properties,
            geometry: this.geometry
        };
        // this.yandexService.save(object);
    }
}
