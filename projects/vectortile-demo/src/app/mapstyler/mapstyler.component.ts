import { KeyValue } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'ol/color';
import VectorTileLayer from 'ol/layer/VectorTile';
import { DrawColor } from '../color';
import { IColorMap, LegendLevel } from '../colorMap';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-mapstyler',
  templateUrl: './mapstyler.component.html',
  styleUrls: ['./mapstyler.component.scss']
})
export class MapstylerComponent implements OnInit {
  @Input() Layer!: VectorTileLayer;
  @Input() ColorMap!: IColorMap;
  detaillevel = LegendLevel;

  valueAscOrder = (a: KeyValue<string,DrawColor>, b: KeyValue<string,DrawColor>): number => {
    return a.value.label.toLowerCase().localeCompare(b.value.label.toLowerCase());
  }
 
  constructor() {
     
  }

  ngOnInit(): void {
  

  }

  ngOnChange()
  {
 

  }

  onCheckboxAllChange(event: any) {

    this.ColorMap.setShowAll(event.target.checked);
    this.Layer.getSource()!.refresh();
  }

  onSelectLevel(lev: LegendLevel) {
    this.ColorMap.setSelector(lev);
    this.Layer.getSource()!.refresh();
  }

  disEnabledLevel(level: KeyValue<string, LegendLevel>): boolean {
    return (level.value === this.ColorMap.getLegendLevel());
  }


  onCheckboxLabelsChange
    (event: any) {
    this.ColorMap.setShowAll(event.target.checked)
    this.Layer.getSource()!.refresh();
  }

  NewColorMap() {
    this.clearColorMap();
    this.Layer.getSource()!.refresh();
  }

  clearColorMap() {
    this.ColorMap.clear();
  }

  getItems(isText:boolean)
  {
    return this.ColorMap.getItems(isText);


  }





  colorArrayChecked(isText: boolean) {
  
    var  array = this.ColorMap.getItems(isText);
  

    for (let a of array!.keys()) {
      var element = array!.get(a)
      if (element!.show) {
        return true;

      }
    }
    return false;
  }

  onCheckboxChange(event: any, row: KeyValue<string, DrawColor>) {
    var ui = row.value;
    var newvalue = new DrawColor(ui.label, ui.legendfeature, ui.mapbox, ui.annotation);
    newvalue.show = event.target.checked;
    if (this.ColorMap.has(ui.label)) {
      this.ColorMap.set(ui.label, newvalue)
    }
    this.Layer.getSource()!.refresh();
  }

  onColorChange(row: KeyValue<string, DrawColor>) {
    row.value.mapbox = false;
    this.Layer.getSource()!.refresh();
  }

}
