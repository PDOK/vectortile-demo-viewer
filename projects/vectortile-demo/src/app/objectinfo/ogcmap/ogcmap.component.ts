import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core'
import { NgElement, WithProperties } from '@angular/elements'
declare global {
  interface HTMLElementTagNameMap {
    'app-feature-view': NgElement & WithProperties<{
      itemsUrl: string
    }>
  }
}


@Component({
  selector: 'app-ogcmap',
  templateUrl: './ogcmap.component.html',
  styleUrl: './ogcmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
