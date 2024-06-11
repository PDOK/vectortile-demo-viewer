import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'

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
  features: unknown[]
  numberReturned: number
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




  getItemLinks(url: string): Observable<OGCApiLink[]> {
    let ret: OGCApiLink[] = []

    return this.http.get(`${url}/collections`).pipe(
      map((data: unknown) => {
        const r = data as CollectionResponse
        r.collections.forEach((c: Collection) => {
          const l = c.links.filter((l: OGCApiLink) => l.rel === 'items' && l.type === FormatType.ApplicationGeoJSON)
          ret = [...ret, ...l]
        })
        return ret
      })
    )
  }

  existsIdForFeature(href: string, lokaal_id: string): Observable<false | FeatureCollectionResponse> {
    return this.http.get(href + '&lokaal_id=' + lokaal_id).pipe(map((data: unknown) => {
      const r = data as FeatureCollectionResponse
      if (r.numberReturned > 0) {
        return r
      }
      else return false
    })
    )
  }


  existsId(href: string, lokaal_id: string) {
    const links = this.getItemLinks(href)
    return links.subscribe((x) => {
      x.forEach((link) => {
        const match = this.existsIdForFeature(link.href, lokaal_id)
        match.subscribe((x => {
          return x
        }))
      })
    })
  }
}

