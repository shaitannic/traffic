import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Yandex, YandexMap } from '../yandex.interface';
import { YandexService } from '../yandex.service';

@Component({
  selector: 'yandex-map',
  templateUrl: 'yandex-map.component.html',
  styleUrls: ['./yandex-map.component.less']
})
export class YandexMapComponent implements OnInit {
  constructor(private yandexService: YandexService) { }

  ngOnInit(): void { }
}
