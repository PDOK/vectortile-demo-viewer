import { KeyValue } from '@angular/common'
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core'

import { NgElement, WithProperties } from '@angular/elements'
import VectorTileLayer from 'ol/layer/VectorTile'
import { FeatureLike } from 'ol/Feature'
import { DrawColor } from '../color'
import { IColorMap, LegendLevel } from '../colorMap'

declare global {
  interface HTMLElementTagNameMap {
    'app-legend-view': NgElement & WithProperties<{ styleUrl: string }>
  }
}

@Component({
  selector: 'app-mapstyler',
  templateUrl: './mapstyler.component.html',
  styleUrls: ['./mapstyler.component.scss'],
})
export class MapstylerComponent implements AfterViewInit {

  @Input() Layer!: VectorTileLayer<FeatureLike>
  @Input() ColorMap!: IColorMap
  @Input() StyleUrl: string = '';
  @ViewChild('lview')
  customLegendElement: ElementRef | undefined
  detaillevel = LegendLevel;

  valueAscOrder = (
    a: KeyValue<string, DrawColor>,
    b: KeyValue<string, DrawColor>
  ): number => {
    return a.value.label
      .toLowerCase()
      .localeCompare(b.value.label.toLowerCase())
  };
  private _isShowStyler: boolean = false;
  public get isShowStyler(): boolean {
    return this._isShowStyler
  }
  public set isShowStyler(value: boolean) {
    this._isShowStyler = value
    if (!this._isShowStyler) {
      this.changeUrl()
    }
  }

  constructor() {
    //expected empty
    //  this.customLegendElement!.nativeElement.visibility = false;
  }

  ngAfterViewInit() {
    this.isShowStyler = false
  }

  toggleShowStdLegend() {
    this.isShowStyler = !this.isShowStyler
    if (!this.isShowStyler) {
      this.NewColorMap()
    }
  }

  changeUrl() {
    if (this.customLegendElement) {
      this.customLegendElement.nativeElement.setAttribute(
        'style-url',
        this.StyleUrl
      )
    } else {
      console.log('to urly ')
    }
  }

  hasTextlabels() {
    return this.ColorMap.hasText()
  }

  onCheckboxAllChange(event: any) {
    this.ColorMap.setShowAll(event.target.checked)
    this.refreshlayer()
  }

  onSelectLevel(lev: LegendLevel) {
    this.ColorMap.setSelector(lev)
    this.refreshlayer()
  }

  disEnabledLevel(level: KeyValue<string, LegendLevel>): boolean {
    return level.value === this.ColorMap.getLegendLevel()
  }

  onCheckboxLabelsChange(event: any) {
    this.ColorMap.setShowAllText(event.target.checked)
    this.refreshlayer()
  }

  NewColorMap() {
    this.clearColorMap()
    this.refreshlayer()
  }

  clearColorMap() {
    this.ColorMap.clear()
  }

  getItems(isText: boolean) {
    return this.ColorMap.getItems(isText)
  }

  colorArrayChecked(isText: boolean) {
    const array = this.ColorMap.getItems(isText)

    for (const a of array.keys()) {
      const element = array.get(a)
      if (element?.show) {
        return true
      }
    }
    return false
  }

  onCheckboxChange(event: any, row: KeyValue<string, DrawColor>) {
    const ui = row.value
    const newvalue = new DrawColor(
      ui.label,
      ui.legendfeature,
      ui.mapbox,
      ui.annotation
    )
    newvalue.show = event.target.checked
    if (this.ColorMap.has(ui.label)) {
      this.ColorMap.set(ui.label, newvalue)
    }
    this.refreshlayer()
  }

  onColorChange(row: KeyValue<string, DrawColor>) {
    row.value.mapbox = false
    this.refreshlayer()
  }

  private refreshlayer() {
    this.Layer.getSource()?.refresh()
  }

  getTitelItems() {
    if (this.StyleUrl.toLowerCase().includes('top10nl')) {
      return "id"
    }
    else {
      return ("type,plus_type,functie,fysiek_voorkomen,openbareruimtetype")
    }

  }
}
