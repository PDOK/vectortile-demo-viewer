import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map } from 'rxjs'
export interface CollectionResponse {
  links: OGCApiLink[]
  collections: Collection[]
}

export interface Collection {
  id: string
  title: string
  description: string
  extent: Extent
  crs: string[]
  storageCrs: string
  links: OGCApiLink[]
  content: any[]
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


  getCollections(url: string): Observable<OGCApiLink[]> {
    let ret: OGCApiLink[] = []

    return this.http.get(`${url}/collections`).pipe(
      map((data: unknown) => {
        const r = data as CollectionResponse
        r.collections.forEach((c: Collection) => {
          const l = c.links.filter((l: OGCApiLink) => l.rel === 'items')
          ret = [...ret, ...l]
        })
        return ret
      })
    )
  }

  /* GetId(ogcapi: string, arg0: string): Observable<OGCApiLink> {
  
     const col = this.getCollections(ogcapi)
     return {} as : Link
  
  
  
   }
     */

}
