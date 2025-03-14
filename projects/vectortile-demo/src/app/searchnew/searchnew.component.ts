import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core'

import { FeatureLike } from 'ol/Feature'
import { LocationService } from '../location.service'
@Component({
  selector: 'app-searchnew',
  imports: [],
  templateUrl: './searchnew.component.html',
  styleUrl: './searchnew.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  encapsulation: ViewEncapsulation.None


})
export class SearchnewComponent {
  @Output() activeSearchText = new EventEmitter<string>();
  currentFeature: FeatureLike | undefined = undefined

  constructor(  private locationService: LocationService) { }





  handleactiveSearchText(event: Event): void {


    console.log("active text")
    const csevent = event as CustomEvent
    const searchText = csevent.detail
    console.log(searchText)
    this.activeSearchText.emit(searchText)


  }

  handleactiveFeature(event: Event): void {
    const csevent = event as CustomEvent
    const feature = csevent.detail as unknown as FeatureLike
    this.currentFeature = feature
    console.log(this.currentFeature.getProperties())
    const extent = feature.getGeometry()!.getExtent()
    const centerX = (extent[0] + extent[2]) / 2
    const centerY = (extent[1] + extent[3]) / 2
    const center = [centerX, centerY]
    const wktCenter = `POINT(${center[0]} ${center[1]})`;
    this.locationService.zoomto(wktCenter, "test")

  }
}
