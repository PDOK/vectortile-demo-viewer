import { ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, NgModule, DoBootstrap } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ColorPickerModule } from 'ngx-color-picker'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { OlmapComponent } from './olmap/olmap.component'
import { SearchComponent } from './search/search.component'
import { ObjectinfoComponent } from './objectinfo/objectinfo.component'
import { MapexportComponent } from './mapexport/mapexport.component'
import { MapstylerComponent } from './mapstyler/mapstyler.component'
import { LocationComponent } from './location/location.component'
import { DemoboxComponent } from './demobox/demobox.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { MatDividerModule } from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowlinkComponent } from './showlink/showlink.component'
import { CustomTileComponent } from "./custom-tile/custom-tile.component";


@NgModule({ declarations: [

    ],


    schemas: [CUSTOM_ELEMENTS_SCHEMA],

    imports: [ AppComponent,BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDividerModule,
    //  MatButtonModule,
    //  MatIconModule,
    MatSlideToggleModule, CustomTileComponent,
    OlmapComponent,
    SearchComponent,
    ObjectinfoComponent,
    MapexportComponent,
    MapstylerComponent,
    LocationComponent,
    DemoboxComponent,
    ShowlinkComponent,
  ], providers: [provideHttpClient(withInterceptorsFromDi())] })

  export class AppModule implements DoBootstrap {
    ngDoBootstrap(appRef: ApplicationRef) {
      appRef.bootstrap(AppComponent);
    }
  }
