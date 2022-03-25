import { Component, Input, OnInit } from '@angular/core';
import { Feature } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { Geometry } from 'ol/geom';
import { StyleFunction } from 'ol/style/Style';
import { createResolutionConstraint } from 'ol/View';
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

  @Input() feature: FeatureLike | undefined
  @Input() resolution: number | undefined
  @Input() styleFunction: any;

  private fillColor: number[] = DefaultColor;
 

  constructor() { }

  public getFeatureProperties(): proprow[] {
    var proptable: proprow[] = [];
    var prop = this.feature!.getProperties();
    for (var val in prop) {
      var p: proprow = { title: val, value: prop[val] };
      proptable.push(p)
    }
    return proptable;
  }


  selectedFillStyle() {
    var color = this.getFillColor()
    return {
      'background-color': color
    };
  }

  getFillColor() {
    var mpstyle = this.styleFunction;
    var reso = this.resolution;
    const st = mpstyle!(this.feature, reso!);
    var color: string | number[] | CanvasGradient | CanvasPattern = "";

    if (st instanceof Array) {
      const fill = st[st.length - 1].getFill();
      color = fill.getColor() as string;
    }
    else {
      var stStyle = st as any;
      var colcolor = stStyle.fill_.color_ as string | number[] | CanvasGradient | CanvasPattern
      color = colcolor;
    }

    if (color instanceof CanvasPattern) {
      var canvas = true;
      // not yet implemented boomgaard
    }

    return (color);
  }


 
}



