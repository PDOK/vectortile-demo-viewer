import { Component, Input, OnInit } from '@angular/core';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { StyleFunction } from 'ol/style/Style';
import { createResolutionConstraint } from 'ol/View';
import { getFillColor } from '../color';
type proprow = {
  title: string
  value: string
}
const DefaultColor = [0, 0, 0, 0]

@Component({
  selector: 'app-objectinfo',
  templateUrl: './objectinfo.component.html',
  styleUrls: ['./objectinfo.component.scss']
})


export class ObjectinfoComponent {

  @Input() features: FeatureLike[] = []
  @Input() resolution: number | undefined
  @Input() styleFunction: any;

  private fillColor: number[] = DefaultColor;


  constructor() { }

  public getFeatures() {
    return this.features
  }

  public getFeatureProperties(feature: FeatureLike): proprow[] {
    let proptable: proprow[] = [];
    let prop = feature.getProperties();
    for (let val in prop) {
      let p: proprow = { title: val, value: prop[val] };
      proptable.push(p)
    }
    return proptable;
  }


  selectedFillStyle(feature: FeatureLike) {
    var mpstyle = this.styleFunction;
    var reso = this.resolution;
    const st = mpstyle!(feature, reso!);

    let color = getFillColor(st)
    return {
      'background-color': color
    };
  }





}
/*
  getFillColor2(feature: FeatureLike): string {
    let mpstyle = this.styleFunction;
    let reso = this.resolution;
    const st = mpstyle!(feature, reso!);
    return (this.colorFromStyle(st, '#000000'));
  }


  colorFromStyle(style: { getFill: () => any; getStroke: () => any; }, fallbackcolor: string) {
    let color: string = '';
    if (style.getFill()) {
      const fill = style.getFill();
      if (fill) {
        color = fill.getColor();
        return color;
      }
    }


    if (style._fill)) {
      const fill = style.getFill();
      if (fill) {
        color = fill.getColor();
        return color;
      }
    }
    else {
      const stroke = style.getStroke();
      if (stroke) {
        color = stroke.getColor()
        return color;
      }
    }
    return fallbackcolor
  }
  */





