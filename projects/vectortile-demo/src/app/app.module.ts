import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { ColorPickerModule } from 'ngx-color-picker'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { OlmapComponent } from './olmap/olmap.component'
import { SearchComponent } from './search/search.component'
import { ObjectinfoComponent } from './objectinfo/objectinfo.component'
import { OgcmapComponent } from './objectinfo/ogcmap/ogcmap.component'
import { MapexportComponent } from './mapexport/mapexport.component'
import { MapstylerComponent } from './mapstyler/mapstyler.component'
import { LocationComponent } from './location/location.component'
import { DemoboxComponent } from './demobox/demobox.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { MatDividerModule } from '@angular/material/divider'
import { MatTooltipModule } from '@angular/material/tooltip'
import { ShowlinkComponent } from './showlink/showlink.component'


@NgModule({ declarations: [
        AppComponent,
        OlmapComponent,
        SearchComponent,
        ObjectinfoComponent,
        MapexportComponent,
        MapstylerComponent,
        LocationComponent,
        DemoboxComponent,
        ShowlinkComponent,
        OgcmapComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ColorPickerModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatDividerModule,
        //  MatButtonModule,
        //  MatIconModule,
        MatSlideToggleModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
