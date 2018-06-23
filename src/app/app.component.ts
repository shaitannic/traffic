import { Component, OnInit } from '@angular/core';
import { YandexService } from './services';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  _apiUrl = environment.apiUrl;
  isShowContextMenu: boolean = false;
  form: FormGroup;

  constructor(
    private yandexService: YandexService,
    private http: HttpClient,
  ) {
    this.form = new FormGroup({
      objectId: new FormControl(''),
      inputStream: new FormControl(''),
      outputStream: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.yandexService.isInited.subscribe(isInited => {
      if (isInited) {
        // клик правой кнопкой мыши
        this.yandexService.objectManagerPolyline.objects.events.add('contextmenu', e => {
          this.form.controls.objectId.setValue(e.get('objectId'));
          console.log(e.get('objectId'));
          // const obj = this.yandexService.objectManagerPolyline.objects.getById(objectId);
          if (this.isShowContextMenu) {
            this.isShowContextMenu = false;
          } else {
            this.getPolylineInfo(this.form.controls.objectId.value).subscribe(obj => {
              this.form.controls.objectId.setValue(obj.objectId);
              this.form.controls.inputStream.setValue(obj.inputStream);
              this.form.controls.outputStream.setValue(obj.inputStream);
              this.isShowContextMenu = true;
            })
          }
        })
      }
    })
  }

  submit(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // const params = JSON.stringify(this.form.value);
    const params = {
      id: this.form.controls.objectId.value,
      inputStream: this.form.controls.inputStream.value,
      outputStream: this.form.controls.outputStream.value
    }

    this.isShowContextMenu = false;
    this.http.put(this._apiUrl + '/polyline', JSON.stringify(params), { headers });
  }

  public getPolylineInfo(id): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const options = { params: new HttpParams().set('objectId', id) };
    return this.http.get(this._apiUrl + '/polyline', options);
  }
}
