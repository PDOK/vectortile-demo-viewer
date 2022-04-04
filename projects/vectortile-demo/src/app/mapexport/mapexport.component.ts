import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Map as olMap } from 'ol';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean
  }
}

const BackgroundColor = '#FFFFFF';
@Component({
  selector: 'app-mapexport',
  templateUrl: './mapexport.component.html',
  styleUrls: ['./mapexport.component.scss']
})
export class MapexportComponent {
  @Input() map!: olMap
  @ViewChild('mapCanvas', { static: false }) mapCanvas: ElementRef | undefined;
  mapContext: CanvasRenderingContext2D | undefined
  @ViewChild('downloadLink') downloadLink!: ElementRef;

  constructor() {
   //no code
  }

  downloadMap() {
    if (this.mapCanvas) {
      this.mapContext = this.mapCanvas.nativeElement.getContext('2d');
   

      var that = this
      this.map.once('rendercomplete', function () {
        if (that.mapCanvas) {
        
          
          const elements = that.map.getViewport().querySelectorAll('.ol-layer canvas')
          elements.forEach(element => {
            that.makecanvas(element as HTMLImageElement)
          });
        }

       
        if (navigator.msSaveBlob) {
          // do this old browsers stil exist? 
          navigator.msSaveBlob(that.mapCanvas!.nativeElement.toBlob(), 'map.png');
        } else {
          that.downloadLink.nativeElement.href = that.mapCanvas!.nativeElement.toDataURL('image/png');
          that.downloadLink.nativeElement.download = 'map.png';
          that.downloadLink.nativeElement.click();
        }
      });
      this.map.renderSync();
    }
  }

  makecanvas(canvas: HTMLImageElement) {
    const size = this.map.getSize()
    const width = size![0];
    const height = size![1]
    this.mapCanvas!.nativeElement.width = width;
    this.mapCanvas!.nativeElement.height = height;
    if (this.mapContext) {
      this.mapContext.fillStyle=BackgroundColor;
      this.mapContext.fillRect(0, 0, width, height);
      this.mapContext.drawImage(canvas, 0, 0);
    }
  }
}











