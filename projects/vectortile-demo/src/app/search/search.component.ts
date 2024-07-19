import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { DefaultService as PdokLocationService } from '../api/locatieserver/v3'
import { DisplayItem, IdlookupService } from '../idlookup.service'
import { LocationService } from '../location.service'

export interface Suggest {
  response: Response
  highlighting: Highlighting
  spellcheck: Spellcheck
}
export interface Response {
  numFound: number
  start: number
  maxScore: number
  docs?: (DocsEntity)[] | null
}
export interface DocsEntity {
  weergavenaam: string
  centroide_rd: string
}
export interface Highlighting { }

export interface high {
  suggest?: (string)[] | null
}
export interface Spellcheck {
  suggestions?: (null)[] | null
  collations?: (null)[] | null
}



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  $suggest!: Observable<Suggest>
  searchListVisible: boolean = false;
  searchLocation: string = ""
  $ids!: Observable<(false | DisplayItem)[]>

  constructor(private pdokLocationService: PdokLocationService, private locationService: LocationService, private idlookupService: IdlookupService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // nothing 
  }

  onSearchKey(search: string) {
    const ogc = this.locationService.OgcAPI
    if (ogc) {
      const t = this.findTokens(search, ogc.lokaalIdRegex)
      if (t.length > 6) {
        const lokaalid = t[0]
        this.$ids = this.idlookupService.existsId(ogc.url, lokaalid)
      }
    }
    if (search.length > 2) {
      this.$suggest = this.pdokLocationService.suggestGet(search, 'weergavenaam centroide_rd', undefined, undefined, undefined, 7)
    }
    this.searchListVisible = true
  }


  findTokens(input: string, regex: RegExp): string[] {

    const matches = input.match(regex)
    return matches || []
  }

  onSelectSearch(row: DocsEntity) {
    this.locationService.zoomto(row.centroide_rd, row.weergavenaam)
    this.searchListVisible = false
    this.searchLocation = row.weergavenaam
  }

  onSelectSearchID(row: false | DisplayItem) {
    if (row) {
      this.locationService.zoomToFeatures(row.link, row.displayName)
      this.searchListVisible = false
      this.searchLocation = row.displayName
    } else {
      throw Error("Wrong call for selectid")
    }


  }
  getNames(a: Suggest | null): DocsEntity[] | null | undefined {
    if (a) {
      return a.response.docs
    }
    else {
      return undefined
    }
  }


  getids(ids: (false | DisplayItem)[] | null) {
    if (ids) {
      return ids.filter((x) => typeof x != "boolean") as DisplayItem[]
    }
    else return undefined
  }
}