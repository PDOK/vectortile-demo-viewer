
import { View } from 'ol'
import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Subject, BehaviorSubject } from 'rxjs';
import WKT from 'ol/format/WKT';
import { Point } from 'ol/geom';
import Projection from 'ol/proj/Projection'
export enum ChangeType {
  search = "search",
  move = "move"

}




export type ViewLocation = {
  change: ChangeType;
  view: View | undefined;
};


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public rdProjection = new Projection({
    code: 'EPSG:28992',
    extent: [-285401.92, 22598.08, 595401.92, 903401.92]
  })
  public initialView = new View({
    projection: this.rdProjection,
    center: [155000, 463000],
    zoom: 13, 
    enableRotation: false

  });

  readonly initialViewLocation: ViewLocation = {
    change: ChangeType.move,
    view: this.initialView
  }    ;


  private messageSource = new BehaviorSubject(this.initialViewLocation);
  //private init: ViewLocation = { view: this.initialView, event: this.initialEvent };

  public currentLocation = this.messageSource.asObservable();

  constructor(private http: HttpClient) {
    this.changeLocation(this.initialViewLocation);
  }

  changeLocation(location: ViewLocation) {
    this.messageSource.next((location))
  }


  changeView(view: View) {
    const location = this.initialViewLocation;
    location.view = view;
    location.change = ChangeType.move;
    this.messageSource.next((location))
  }

  zoomto(wkt: string) {
    var point = this.wktToCoordinates(wkt)

    const location = this.initialViewLocation;
    location.view!.setCenter(point)
    location.change = ChangeType.search;
    this.messageSource.next((location))

  }


  wktToCoordinates(wkt: string): any {
    const format = new WKT();
    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:28992',
      featureProjection: 'EPSG:28992',
    });
    const point  = feature.getGeometry() as Point;
    return (point!.getCoordinates());
  }


}


