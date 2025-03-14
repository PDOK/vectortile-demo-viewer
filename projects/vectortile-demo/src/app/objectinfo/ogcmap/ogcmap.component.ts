import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core'
import { NgElement, WithProperties } from '@angular/elements'
import { ShowlinkComponent } from '../../showlink/showlink.component'
import { CommonModule } from '@angular/common'
/* declare global {
  interface HTMLElementTagNameMap {
    'app-feature-view': NgElement & WithProperties<{
      itemsUrl: string
    }>
  }
} */


@Component({
    selector: 'app-ogcmap',
    templateUrl: './ogcmap.component.html',
    styleUrl: './ogcmap.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[ShowlinkComponent, CommonModule ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]

})
export class OgcmapComponent implements AfterViewInit {
  @ViewChild('mview')
  customMap: ElementRef | undefined
  @Input() ogcApiUrl: string = ''

  constructor(private cd: ChangeDetectorRef) {


  }


  ngAfterViewInit() {
    this.doMap()
    this.cd.detectChanges()


  }



  doMap() {

    if (this.customMap) {
      this.customMap.nativeElement.setAttribute(
        'items-url',
        this.ogcApiUrl
      )


    }
  }

}
