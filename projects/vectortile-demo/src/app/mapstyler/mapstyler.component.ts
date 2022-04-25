import { KeyValue } from '@angular/common';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'ol/color';
import VectorTileLayer from 'ol/layer/VectorTile';
import { DrawColor } from '../color';

@Component({
  selector: 'app-mapstyler',
  templateUrl: './mapstyler.component.html',
  styleUrls: ['./mapstyler.component.scss']
})
export class MapstylerComponent implements OnInit {
  @Input() Layer!: VectorTileLayer;
  @Input() ColorMap!: Map<string, DrawColor>;



  constructor() { }

  ngOnInit(): void {
  }

  onCheckboxAllChange(event: any) {
    this.ColorMap.forEach((x: { show: any; }) => { x.show = event.target.checked })
    this.Layer.getSource()!.refresh();
  }

  onCheckboxLabelsChange
    (event: any) {
    this.ColorMap.forEach((x: DrawColor) => {
      if (x.isText()) {
        x.show = event.target.checked
      }
    })
    this.Layer.getSource()!.refresh();
  }


  NewColorMap() {
    this.clearColorMap();
    this.Layer.getSource()!.refresh();
  }

  clearColorMap() {
    this.ColorMap.clear();
  }



  colorArray(isText: boolean) {
    return new Map<string, DrawColor>([...this.ColorMap.entries()].filter(x => x[1].isText() === isText).sort());
  }

  colorArrayChecked(isText: boolean) {
    var array = this.colorArray(isText)

    for (let a of array.keys()) {
      var element = array.get(a)
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
