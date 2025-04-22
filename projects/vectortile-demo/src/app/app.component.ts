import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'

import {
  Visualisatie,
  getAllVisualisaties,
  getStyleUrl,
} from './enumVisualisatie'
import { LocationComponent } from './location/location.component'
import { OlmapComponent } from './olmap/olmap.component'
import { SearchComponent } from './search/search.component'
import { ShowlinkComponent } from './showlink/showlink.component'
import { environment } from '../environments/environment'
export const demoSettings = {
  demoVisualisatieRotate: false,
  demoLocatieRotate: false,
  previewFeature: !environment.production,
  demoLocationApi: true
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    LocationComponent,
    OlmapComponent,
    ShowlinkComponent,
    SearchComponent
  ]

})
export class AppComponent implements OnInit {
  enumFromValue = <T extends Record<string, string>>(
    val: string,
    _enum: T,
    errormessage: string = `${val} not in enum`
  ) => {
    const enumName = (Object.keys(_enum) as Array<keyof T>).find(
      (k) => _enum[k] === val
    )
    if (!enumName) throw new Error(errormessage)
    return _enum[enumName]
  };

  visualisatie = getAllVisualisaties();
  currentVis!: Visualisatie

  defaultVisualisatie = Visualisatie.BRTAchtergrondStandaard;
  isShow: boolean = false;
  styleurl: string = ''

  constructor() {
    /* do nothing*/
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search)
    const visParam = urlParams.get('visualisatie')
    if (visParam !== null && visParam !== undefined) {
      try {
        this.currentVis = this.enumFromValue(visParam, Visualisatie)
      } catch (error) {
        console.error(error)
        this.currentVis = Visualisatie.BGTachtergrond // Fallback to default
      }
    } else {
      this.currentVis = Visualisatie.BGTachtergrond // Default value
    }
  }


  toggleShow() {
    this.isShow = !this.isShow
    this.visualisatie = getAllVisualisaties()
  }

  receiveTitle(data: Visualisatie) {
    this.currentVis = data

    this.styleurl = getStyleUrl(this.currentVis, "netherlandsrdnewquad").styleUrl!
  }

  onSelect(vis: Visualisatie): void {
    this.currentVis = vis
    const url = new URL(window.location.href)
    url.searchParams.set('visualisatie', vis)
    window.history.replaceState({}, '', url.toString())
    this.toggleShow()
  }
}

