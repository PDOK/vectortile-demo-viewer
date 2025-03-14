import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Map as olMap } from 'ol'

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

const BackgroundColor = '#FFFFFF'
@Component({
  selector: 'app-mapexport',
  templateUrl: './mapexport.component.html',
  styleUrls: ['./mapexport.component.scss'],

})
export class MapexportComponent {
  @Input() olMap!: olMap
  @Input() legend!: HTMLElement
  @Input() downloadFilename = 'map.png'

  @ViewChild('mapCanvas', { static: false }) mapCanvas: ElementRef | undefined
  mapContext: CanvasRenderingContext2D | undefined
  @ViewChild('downloadLink') downloadLink!: ElementRef

  constructor() {
    //no code
  }

  downloadMap() {
    if (this.mapCanvas) {
      this.mapContext = this.mapCanvas.nativeElement.getContext('2d')
      if (this.olMap) {
        const elements = this.olMap.getViewport()!.querySelectorAll('.ol-layer canvas')
        this.olMap.once('rendercomplete', () => {
          this.makedownload(elements)
        })
        this.olMap.renderSync()
      }
      if (this.legend) {
        this.makedownload(this.legend.querySelectorAll('.legend-view'))

      }
    }
  }

  private makedownload(elements: NodeListOf<Element>) {
    if (this.mapCanvas) {

      let height = 0
      let width = 0

      elements.forEach((element) => {
        height += element.clientHeight
        if (element.clientWidth > width) {
          width = element.clientWidth
        }
      })

       elements.forEach(element => {
        this.makecanvas(element as HTMLImageElement, height, width)
      })
    }


    if (navigator.msSaveBlob) {

      // do this old browsers stil exist?
      navigator.msSaveBlob(this.mapCanvas!.nativeElement.toBlob(), this.downloadFilename)
    } else {
      this.downloadLink.nativeElement.href = this.mapCanvas!.nativeElement.toDataURL('image/png')
      this.downloadLink.nativeElement.download = this.downloadFilename
      this.downloadLink.nativeElement.click()
    }
  }

  makecanvas(canvas: HTMLImageElement,  height: number, width: number ){
    this.mapCanvas!.nativeElement.width = width
    this.mapCanvas!.nativeElement.height = height
    if (this.mapContext) {
      this.mapContext.fillStyle = BackgroundColor
      this.mapContext.fillRect(0, 0, width, height)
      this.mapContext.drawImage(canvas, 0, 0)
    }
  }
}











