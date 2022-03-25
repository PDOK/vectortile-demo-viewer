import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { View } from 'ol';
import { LocationService } from '../location.service';
import { DefaultService as PdokLocationService } from '../api/locatieserver/v3'
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ResolveData } from '@angular/router';
export interface Suggest {
  response: Response;
  highlighting: Highlighting;
  spellcheck: Spellcheck;
}
export interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  docs?: (DocsEntity)[] | null;
}
export interface DocsEntity {
  weergavenaam: string;
  centroide_rd: string;
}
export interface Highlighting { };

export interface high {
  suggest?: (string)[] | null;
}
export interface Spellcheck {
  suggestions?: (null)[] | null;
  collations?: (null)[] | null;
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  $suggest!: Observable<Suggest>
  searchListVisible: boolean =false;
  searchLocation:string  ="" 






  constructor(private pdokLocationService: PdokLocationService, private locationService: LocationService) { }

  ngOnInit(): void {
    // nothing 

  }




  onSearchKey(search: string) {
    this.$suggest = this.pdokLocationService.suggestGet(search, 'weergavenaam centroide_rd', undefined, undefined, undefined, 7);
    this.searchListVisible = true; 
  }


  onSelectSearch(row: DocsEntity) {
    this.locationService.zoomto(row.centroide_rd)
    this.searchListVisible = false; 
    this.searchLocation= row.weergavenaam; 
   



  }
  getNames(a: Suggest| null) {
    if (a)
    {
      return a.response.docs
    }
    else{
    return undefined
    }
  }

}













