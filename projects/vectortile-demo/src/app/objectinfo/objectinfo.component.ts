import { Component, ElementRef, Input, OnChanges, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core'
import { FeatureLike } from 'ol/Feature'
import { StyleFunction } from 'ol/style/Style'
import { getFillColor } from '../color'
import { NgElement, WithProperties } from '@angular/elements'
import { environment } from '../../environments/environment'

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
  styleUrls: ['./objectinfo.component.scss']
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
      if (val === "lokaal_id" || val === "lokaalid") {
        if (this.ogcurl) {
          ogcApiUrl = getOgcApiImtemUrl(this.ogcurl, prop["layer"], 'lokaal_id', prop[val])
        }

      }

      proptable.push(p)
    }





    return {
      rows: proptable, ogcurl: ogcApiUrl
    }
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







