import { Component, ElementRef, Input, OnChanges, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core'
import { FeatureLike } from 'ol/Feature'
import { StyleFunction } from 'ol/style/Style'
import { getFillColor } from '../color'
import { ShowlinkComponent } from '../showlink/showlink.component'
import { OgcmapComponent } from './ogcmap/ogcmap.component'
import { CommonModule, NgStyle } from '@angular/common'
import { MatDivider } from '@angular/material/divider'
//declare global {
//interface HTMLElementTagNameMap {
// 'app-ogc-api-view': NgElement & WithProperties<{ styleUrl: string }>
//}
//}






type proprow = {
  title: string
  value: string

}
const DefaultColor = [0, 0, 0, 0]

@Component({
  selector: 'app-objectinfo',
  templateUrl: './objectinfo.component.html',
  styleUrls: ['./objectinfo.component.scss'],
  imports: [CommonModule, ShowlinkComponent, OgcmapComponent, NgStyle, MatDivider]

})


export class ObjectinfoComponent {


  @Input() features: FeatureLike[] = []
  @Input() resolution: number | undefined
  @Input() styleFunction: StyleFunction = {} as StyleFunction
  @Input() ogcurl: string | undefined


  private fillColor: number[] = DefaultColor






  constructor(private cd: ChangeDetectorRef) { /* empty const( */ }



  public getFeatures() {
    return this.features
  }





  isLink(prop: proprow) {
    // eslint-disable-next-line no-useless-escape
    const regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm
    return regEx.test(prop.value)
  }



  public getFeatureProperties(feature: FeatureLike): { rows: proprow[], ogcurl: string } {
    const proptable: proprow[] = []
    const prop = feature.getProperties()
    let ogcApiUrl = ""
    for (const val in prop) {
      const p: proprow = { title: val, value: prop[val] }
      if (val === "lokaal_id" || val === "lokaalid" || val === "identificatie" || val === "identificatie_lokaal_id") {
        if (this.ogcurl) {
          let field = val
          if (val === "lokaalid") {
            field = "lokaal_id"
          }
          let collection = prop["layer"]
          if (val === "identificatie_lokaal_id") {
            collection = this.renameDKK(prop, collection)


          }
          ogcApiUrl = getOgcApiImtemUrl(this.ogcurl, collection, field, prop[val])

        }


      }
      if (val === "external_fid") {
        if (this.ogcurl) {
          let collection = prop["layer"]
          collection = this.renameDKK(prop, collection)


          ogcApiUrl = getOgcApiImtemUrlExternalFid(this.ogcurl, collection, "externalFid", prop[val])
        }
      }
      proptable.push(p)
    }

    return {
      rows: proptable, ogcurl: ogcApiUrl
    }
  }


  private renameDKK(prop: { [x: string]: any }, collection: any) {
    if (prop["layer"] === "pand") {
      collection = "bebouwing"
    }

    if (prop["layer"] === "openbareruimtelabel") {
      collection = "openbareruimtenaam"
    }
    if (prop["layer"] === "kadastrale_grens") {
      collection = "kadastralegrens"
    }

    if (prop["layer"] === "pand_nummeraanduiding") {
      collection = "nummeraanduidingreeks"
    }
    return collection
  }

  selectedFillStyle(feature: FeatureLike) {
    const mpstyle = this.styleFunction
    const reso = this.resolution
    if (reso) {
      const color = getFillColor(mpstyle(feature, reso))
      return {
        'background-color': color
      }
    }
    else
      return {
        'background-color': 'white'
      }
  }


}






function getOgcApiImtemUrl(OGCurl: string, layer: string, field: string, lokaal_id: string): string {



  return OGCurl + "/collections/" + layer + "/items?crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F28992&" + field + "=" + lokaal_id
}

function getOgcApiImtemUrlExternalFid(OGCurl: string, layer: string, field: string, externalFid:string): string {



  return OGCurl + "/collections/" + layer + "/items/" + externalFid + "?crs=http%3A%2F%2Fwww.opengis.net%2Fdef%2Fcrs%2FEPSG%2F0%2F28992&"
}







