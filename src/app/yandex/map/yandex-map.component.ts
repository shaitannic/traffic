import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Yandex, YandexMap } from '../yandex.interface';
import { YandexService } from '../yandex.service';

@Component({
  selector: 'yandex-map',
  templateUrl: 'yandex-map.component.html',
  styleUrls: ['./yandex-map.component.less']
})
export class YandexMapComponent implements OnInit {
  private ymaps: Yandex;
  private map: YandexMap;
  private mapEl: any = document.getElementById('map');

  constructor(private yandexService: YandexService) {
    this.ymaps = yandexService.ymaps;
  }

  ngOnInit(): void {
    this.ymaps.ready().then(() => {
      this.initMap();
    })
  }

  private initMap(): void {
    this.map = new this.ymaps.Map("map", {
      center: [55.76, 37.64],
      controls: [],
      zoom: 7
    })
  }
}
