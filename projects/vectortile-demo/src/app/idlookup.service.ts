import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map, mergeAll, switchMap, toArray } from 'rxjs'

export interface CollectionResponse {
  links: OGCApiLink[]
  collections: Collection[]
}



export interface FeatureCollectionResponse {
  type: string
  timeStamp: Date
  coordRefSys: string
  links: OGCApiLink[]
  conformsTo: string[]
  features: JSONFeature[]
  numberReturned: number
}



export interface JSONFeature {
  type: string
  geometry: Geometry
  properties: unknown
  id: string
}


export interface FeatureResponse {
  type: string
  geometry: Geometry
  properties: unknown
  links: OGCApiLink[]
  id: number
}

export interface Geometry {
  type: string
  coordinates: number[]
}



export interface Collection {
  id: string
  title: string
  description: string
  extent: Extent
  crs: string[]
  storageCrs: string
  links: OGCApiLink[]
  content: unknown[]
}

export interface Extent {
  spatial: Spatial
  temporal: Temporal
}

export interface Spatial {
  bbox: Array<number[]>
  crs: string
}

export interface Temporal {
  interval: Array<Array<Date | null>>
  trs: string
}

export interface OGCApiLink {
  rel: Rel
  type: FormatType
  title: string
  href: string

}

export interface DisplayItem {
  displayName: string
  link: OGCApiLink
}

export enum Rel {
  Alternate = "alternate",
  Items = "items",
  License = "license",
  Self = "self",
}

export enum FormatType {
  ApplicationGeoJSON = "application/geo+json",
  ApplicationJSON = "application/json",
  ApplicationVndOgcFgJSON = "application/vnd.ogc.fg+json",
  TextHTML = "text/html",
}

@Injectable({
  providedIn: 'root'
})
export class IdlookupService {
  private ogcApiUrl: URL | undefined = undefined

  constructor(private http: HttpClient) {
  }


  getCollections(url: string): Observable<Collection[]> {
    return this.http.get(`${url}/collections`).pipe(
      map((data: unknown) => {
        const r = data as CollectionResponse
        return r.collections
      })
    )
  }




  getItemLinks(url: string): Observable<DisplayItem[]> {
    const ret: DisplayItem[] = []

    return this.http.get(`${url}/collections`).pipe(
      map((data: unknown) => {
        const r = data as CollectionResponse
        r.collections.forEach((c: Collection) => {
          const l = c.links.filter((l: OGCApiLink) => l.rel === 'items' && l.type === FormatType.ApplicationGeoJSON)
          l.forEach((x) => {
            const d: DisplayItem = {
              displayName: c.title,
              link: x
            }
            ret.push(d)
          })
        })
        return ret
      })
    )
  }

  getFeaturesById(item: DisplayItem, lokaal_id: string): Observable<false | DisplayItem> {
    const params = new HttpParams().set('lokaal_id', lokaal_id)
    return this.checkFeatures(item, params)
  }

  existsId(href: string, lokaal_id: string) {
    return this.getItemLinks(href).pipe(
      switchMap(links => links.map(link => this.getFeaturesById(link, lokaal_id))),
      mergeAll(),
      toArray()
    )
  }

  checkFeatures(displayitem: DisplayItem, params: HttpParams): Observable<false | DisplayItem> {
    return this.http.get(displayitem.link.href, { params }).pipe(map((data) => {
      const r = data as FeatureCollectionResponse
      if (r.numberReturned > 0) {

        const flink = r.links.filter((l: OGCApiLink) => l.rel === 'self' && l.type === FormatType.ApplicationGeoJSON)[0]
        const foundlink: DisplayItem = {
          "link": flink,
          "displayName": displayitem.displayName + ' ' + params.toString().replace("=", ': ')
        }
        return foundlink
      }
      else return false
    }))
  }

  getFeatures(displayitem: DisplayItem, params: HttpParams): Observable<false | FeatureCollectionResponse> {
    return this.http.get(displayitem.link.href, { params }).pipe(map((data) => {
      const r = data as FeatureCollectionResponse
      if (r.numberReturned > 0) {
        return r
      }
      else return false
    }))
  }
}



