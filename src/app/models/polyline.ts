import { YandexService } from '../yandex.service';

export class Polyline {
    myPolyline: any;

    type: "Feature";

    options: any = {
        strokeColor: "#000000", // Цвет линии
        strokeWidth: 4, // Ширина линии
        strokeOpacity: 0.5 // Коэффициент прозрачности
    };

    properties: any = {
        balloonContent: "Ломаная линия"
    };

    geometry: any = {
        type: "Polygon",
        coordinates: []
    };

    constructor(private yandexService: YandexService) { }

    public create(coords): void {
        this.geometry.coordinates = coords;
        this.myPolyline = new this.yandexService.ymaps.Polyline(coords, this.properties, this.options);
        this.yandexService.map.geoObjects.add(this.myPolyline);
    }

    public save(): void {
        const object = {
            type: this.type,
            options: this.options,
            properties: this.properties,
            geometry: this.geometry
        }
        this.yandexService.save(object);
    }
}