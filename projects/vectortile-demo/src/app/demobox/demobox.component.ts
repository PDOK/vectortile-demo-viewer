import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import { View } from 'ol'
import { demoSettings } from '../app.component'
import { Visualisatie, getRandomEnumValue } from '../enumVisualisatie'
import { LocationService } from '../location.service'
import { LocalStorageService } from '../local-storage-service'
import { CommonModule } from '@angular/common'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
    selector: 'app-demobox',
    templateUrl: './demobox.component.html',
    styleUrls: ['./demobox.component.scss'],
    imports: [
      CommonModule,
      MatSlideToggleModule,
      MatTooltipModule,
    
  ],

})
export class DemoboxComponent implements OnInit {
  @Output() visEmit: EventEmitter<Visualisatie> = new EventEmitter();

  demotextLocatieAan: string = 'Willekeurige locatie roulerend';
  demotextLocatieUit: string = 'Willekeurige locatie roulerend';
  demotextLocatie = this.demotextLocatieAan;

  demotextVisualisatieAan: string = 'Willekeurige visualisatie roulerend';
  demotextVisualisatieUit: string = 'Willekeurige visualisatie roulerend';
  demotextVisualisatie = this.demotextVisualisatieAan;

  public get isDemoVisualisatieRotate(): boolean {
    return demoSettings.demoVisualisatieRotate
  }
  public set isDemoVisualisatieRotate(value: boolean) {
    demoSettings.demoVisualisatieRotate = value
  }

  public get isDemoLocatieRotate(): boolean {
    return demoSettings.demoLocatieRotate
  }
  public set isDemoLocatieRotate(value: boolean) {
    demoSettings.demoLocatieRotate = value
  }

  public get isPreviewFeature(): boolean {
    return demoSettings.previewFeature

  }
  public set isPreviewFeature(value: boolean) {
    demoSettings.previewFeature = value
  }

  constructor(private locationService: LocationService,private localStorageService: LocalStorageService) { }
  ngOnInit(): void {
    this.locationService.currentLocation.subscribe((currentLocation) => {
      // this.currentlocation = currentLocation;
     //console.log ( this.getAllAvailableFonts());

    })
  }

  getAllAvailableFonts(): FontFace[] {
    const fontSet = document.fonts;
    console.log(fontSet);
    // some fonts may still be unloaded if they aren't used on the site

    const fonts: FontFace[] = [];
    fontSet.forEach(font => {
      fonts.push(font);

    });
    return fonts;
  }

  DemoPreviewFeaturesToggle() {
    this.isPreviewFeature = !this.isPreviewFeature
  }

  DemoRandomLocationToggle() {
    this.isDemoLocatieRotate = !this.isDemoLocatieRotate
    if (this.isDemoLocatieRotate) {
      this.demotextLocatie = this.demotextLocatieUit
      this.gotoRandomLocation()
    } else {
      this.demotextLocatie = this.demotextLocatieAan
    }
  }

  DemogotoStartLocationOnMap() {
    this.localStorageService.removeAll()
    this.visEmit.emit(Visualisatie.BGTstandaard)
    this.isDemoVisualisatieRotate = false
    this.isDemoLocatieRotate = false
    const newloc = this.locationService.initialView
    this.locationService.changeView(newloc)
  }

  DemoVisualisationToggle() {
    this.isDemoVisualisatieRotate = !this.isDemoVisualisatieRotate
    if (this.isDemoVisualisatieRotate) {
      this.demotextVisualisatie = this.demotextVisualisatieUit

      this.visEmit.emit(Visualisatie.BGTstandaard)
      this.repeating_style_function()
    } else {
      this.demotextVisualisatie = this.demotextVisualisatieAan
    }
  }

  gotoRandomLocation() {
    if (this.isDemoLocatieRotate) {
      const dx = 155000 + Math.round(Math.random() * 50000)
      const dy = 463000 + Math.round(Math.random() * 50000)
      const newloc = new View({
        projection: this.locationService.projection,
        center: [dx, dy],
        zoom: 13,
        enableRotation: false,
      })
      this.locationService.changeView(newloc)
      setTimeout(() => {
        this.gotoRandomLocation()
      }, 8000)
    }
  }

  repeating_style_function() {
    if (this.isDemoVisualisatieRotate) {
      this.visEmit.emit(getRandomEnumValue(Visualisatie))
      setTimeout(() => {
        this.repeating_style_function()
      }, Math.round(Math.random() * 4000))
    }
  }
}
