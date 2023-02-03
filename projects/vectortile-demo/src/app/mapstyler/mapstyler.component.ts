import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';

import VectorTileLayer from 'ol/layer/VectorTile';
import { DrawColor } from '../color';
import { IColorMap, LegendLevel } from '../colorMap';


@Component({
  selector: 'app-mapstyler',
  templateUrl: './mapstyler.component.html',
  styleUrls: ['./mapstyler.component.scss']
})
export class MapstylerComponent {
  @Input() Layer!: VectorTileLayer;
  @Input() ColorMap!: IColorMap;
  detaillevel = LegendLevel;

  valueAscOrder = (a: KeyValue<string, DrawColor>, b: KeyValue<string, DrawColor>): number => {
    return a.value.label.toLowerCase().localeCompare(b.value.label.toLowerCase());
  }

  constructor() {

    //expected empty
  }


  hasTextlabels() {
    return this.ColorMap.hasText();
  }

  onCheckboxAllChange(event: any) {

    this.ColorMap.setShowAll(event.target.checked);
    this.refreshlayer();
  }

  onSelectLevel(lev: LegendLevel) {
    this.ColorMap.setSelector(lev);
    this.refreshlayer();
  }

  disEnabledLevel(level: KeyValue<string, LegendLevel>): boolean {
    return (level.value === this.ColorMap.getLegendLevel());
  }


  onCheckboxLabelsChange(event: any) {
    this.ColorMap.setShowAllText(event.target.checked)
    this.refreshlayer();
  }

  NewColorMap() {

    this.clearColorMap();

    this.refreshlayer();
  }

  clearColorMap() {
    this.ColorMap.clear();
  }

  getItems(isText: boolean) {
    return this.ColorMap.getItems(isText);


  }

  colorArrayChecked(isText: boolean) {

    const array = this.ColorMap.getItems(isText);


    for (const a of array.keys()) {
      const element = array.get(a)
      if (element?.show) {
        return true;

      }
    }
    return false;
  }

  onCheckboxChange(event: any, row: KeyValue<string, DrawColor>) {
    const ui = row.value;
    const newvalue = new DrawColor(ui.label, ui.legendfeature, ui.mapbox, ui.annotation);
    newvalue.show = event.target.checked;
    if (this.ColorMap.has(ui.label)) {
      this.ColorMap.set(ui.label, newvalue)
    }
    this.refreshlayer()
  }

  onColorChange(row: KeyValue<string, DrawColor>) {

    row.value.mapbox = false;
    this.refreshlayer();
  }


  private refreshlayer() {
    this.Layer.getSource()?.refresh();
  }
}
