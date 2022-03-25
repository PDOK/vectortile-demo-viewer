import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OlmapComponent } from './olmap/olmap.component';
import { SearchComponent } from './search/search.component';
import { ObjectinfoComponent } from './objectinfo/objectinfo.component';




@NgModule({
  declarations: [
    AppComponent,
    OlmapComponent,
    SearchComponent,
    ObjectinfoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
