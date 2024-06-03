
import { View } from 'ol'
import { Injectable } from '@angular/core'
import { HttpParams } from "@angular/common/http"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject } from 'rxjs'
import WKT from 'ol/format/WKT'
import { Point } from 'ol/geom'
import Projection from 'ol/proj/Projection'
import { Coordinate } from 'ol/coordinate'

//const REFgeo=`https://geodata.nationaalgeoregister.nl/locatieserver/revgeo`
const REFgeo = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse`

export enum ChangeType {
  search = "search",
  move = "move"

}

export interface Locserver {
  response: Response
}

export interface Response {
  numFound: number
  start: number
  maxScore: number
  docs: Doc[]
}

export interface Doc {
  type: string
  weergavenaam: string
  id: string
  score: number
  afstand: number
}



export type ViewLocation = {
  change: ChangeType
  view: View | undefined
  name: string
}


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
    view: this.initialView,
    name: ""
  };


  private messageSource = new BehaviorSubject(this.initialViewLocation);
  //private init: ViewLocation = { view: this.initialView, event: this.initialEvent };

  public currentLocation = this.messageSource.asObservable();

  constructor(private http: HttpClient) {
    this.changeLocation(this.initialViewLocation)
  }

  changeLocation(location: ViewLocation) {
    this.messageSource.next((location))
  }


  async changeView(view: View) {
    const location = this.initialViewLocation
    location.view = view
    location.change = ChangeType.move
    location.name = await this.getLocationName(view.getCenter()!)
    this.messageSource.next((location))
  }

  zoomto(wkt: string, name: string) {
    const point = this.wktToCoordinates(wkt)

    const location = this.initialViewLocation
    location.view!.setCenter(point)
    location.name = name
    location.change = ChangeType.search
    this.messageSource.next((location))

  }


  wktToCoordinates(wkt: string): any {
    const format = new WKT()
    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:28992',
      featureProjection: 'EPSG:28992',
    })
    const point = feature.getGeometry() as Point
    return (point!.getCoordinates())
  }

  async getLocationName(xy: Coordinate): Promise<string> {
    const params = new HttpParams().append('X', xy[0]).append('Y', xy[1]).append('rows', 1)
    const doc = await this.http.get<Locserver>(REFgeo, { params }).toPromise()
    if (doc!.response.docs[0].weergavenaam) {
      return doc!.response.docs[0].weergavenaam
    }
    else {
      return ""
    }
  }
}




