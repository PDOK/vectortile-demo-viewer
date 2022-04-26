import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Map as olMap, View, } from 'ol';
import stylefunction from 'ol-mapbox-style/dist/stylefunction'
import { getTopLeft, getWidth } from 'ol/extent.js';
import MVT from 'ol/format/MVT.js';
import { Geometry } from 'ol/geom';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import 'ol/ol.css';

import Projection from 'ol/proj/Projection';
import VectorTileSource from 'ol/source/VectorTile.js';
import Style, { StyleFunction } from 'ol/style/Style';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LocationService, ViewLocation } from '../location.service';
import { VectorTileUrl, tileurl } from './tileurl';
import { KeyValue } from '@angular/common';
import { getJsonurl, Visualisatie, getRandomEnumValue } from '../enumVisualisatie';
import { Annotation, DrawColor } from "../color"
import { FeatureLike } from 'ol/Feature';
import { DEVICE_PIXEL_RATIO } from 'ol/has';
import { applyStyle } from 'ol-mapbox-style';

interface MapboxStyle {
  version: number;
  name: string;
  id: string;
  zoom: number;
  pitch: number;
  center: number[];
  sprite: string;
  glyphs: string;

}

type proprow = {
  title: string
  value: string
}

type styleRow = {
  title: string
  style: Style
};



@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss']
})

export class OlmapComponent implements OnInit, OnChanges {
  @Output() titelEmit: EventEmitter<Visualisatie> = new EventEmitter();
  color = 'geen'
  private SelectedVisualisation: Visualisatie = Visualisatie.achtergrond;
  stfunction: StyleFunction | undefined;
  @Input() set visualisation(vis: Visualisatie) {
    this.SelectedVisualisation = vis;

  }
  colorMap = new Map<string, DrawColor>();
  vectorTileLayer = new VectorTileLayer(
    {
      renderMode: 'hybrid',
      declutter: true,
      useInterimTilesOnError: false
    })
  readonly rdProjection: Projection = new Projection({
    code: 'EPSG:28992',
    extent: [-285401.92, 22598.08, 595401.92, 903401.92]
  });

  view: View = new View({
    projection: this.rdProjection,
    center: [155000, 463000],
    zoom: 13,
    minZoom: 13,
    enableRotation: false
  });

  map1: olMap = new olMap({
    layers: [this.vectorTileLayer],
    target: 'map1',
    view: this.view
  });
  resolutions: Array<number> = [];
  matrixIds: Array<string> = [];

  public selectedFeature: Feature<Geometry> | undefined;



  public selectedFeatures: [Feature<Geometry>] | undefined = undefined;
  currentlocation: ViewLocation | undefined;
  stylerows: Array<styleRow> | undefined;
  isShowDetails: boolean = false;
  isShowLegend: boolean = false;
  isShowDemo: boolean = false;
  isDemoLocatieRotate: boolean = false;
  isDemoVisualisatieRotate: boolean = false;

  demotextLocatieAan: string = 'Willekeurige locatie roulerend (aan)';
  demotextLocatieUit: string = 'Willekeurige locatie roulerend (uit)';
  demotextLocatie = this.demotextLocatieAan

  demotextVisualisatieAan: string = 'Willekeurige visualisatie roulerend (aan)';
  demotextVisualisatieUit: string = 'Willekeurige visualisatie roulerend (uit)';
  demotextVisualisatie = this.demotextVisualisatieAan

  detailsupdate: boolean = true;

  constructor(private router: Router, private locationService: LocationService) {

  }

  ngOnInit(): void {
    this.locationService.currentLocation.subscribe(currentLocation => {
      this.currentlocation = currentLocation;
      let cview = this.map1.getView();
      if (currentLocation.view) {
        cview.setCenter(currentLocation.view.getCenter());
      }
    });
    this.calcMatrixAndResolutions(this.rdProjection);
    this.resolutions = this.getResolutionsVt(11)
    this.map1 = new olMap({
      layers: [this.vectorTileLayer],
      target: 'map1',
      view: this.view

    })

    const that = this;
    this.map1.on(['moveend'], function (event) {
      that.locationService.changeView(that.map1.getView());
    });

    this.map1.on(['click', 'pointermove'], function (event) {
      const e = event as any;
      const that2 = that;
      if (that.detailsupdate) {
        that.vectorTileLayer.getFeatures(e.pixel).then(function (features) {
          if (!features.length) {
            that2.selectedFeature = undefined;
            return;
          }
          let feature = features[0];
          if (!feature) {
            return;
          }
          that2.selectedFeatures = features as [Feature<Geometry>];
          that2.selectedFeature = feature;
        });
      }
      if (event.type == 'click') {
        that.detailsupdate = !that.detailsupdate;
      }
    })

    this.setTileSource(this.rdProjection, this.vectorTileLayer);

  }

  ngOnChanges(): void {
    this.changeStyleJson(this.vectorTileLayer, this.resolutions);
  }

  toggleShowDetails() {
    this.isShowDetails = !this.isShowDetails;
  }

  toggleShowLegend() {
    this.isShowLegend = !this.isShowLegend;
  }

  toggleShowDemo() {
    this.isShowDemo = !this.isShowDemo;
  }

  hasLegend() {
    return (this.colorMap.size > 0);
  }

  getZoomLevel() {
    let view = this.map1.getView();
    return (view.getZoom()?.toFixed(1));
  }

  getDevicePixelRatio() {
    return DEVICE_PIXEL_RATIO;
  }

  getStyleUrl() {
    return (window.location.href + getJsonurl(this.SelectedVisualisation))
  }

  getResolutionsVt(z = 9) {
    return this.getMatrixIdsVt(z).map(x => 3440.64 / 2 ** (x))
  }

  getMatrixIdsVt(z = 9) {
    return Array(z + 1).fill(null).map((x, i) => i)
  }

  private calcMatrixAndResolutions(rdProjection: Projection) {
    const tileSizePixels = 256;
    const tileSizeMtrs = getWidth(rdProjection.getExtent()) / tileSizePixels;
    for (let i = 0; i <= 15; i++) {
      this.matrixIds[i] = i.toString();
      this.resolutions[i] = tileSizeMtrs / Math.pow(2, i);
    }
  }



  getFillColor(feature: Feature<Geometry>) {
    var mpstyle = this.vectorTileLayer.getStyleFunction();
    var reso = this.view.getResolution();
    const st = mpstyle!(feature, reso!);
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

  private changeStyleJson(vectorTileLayer: VectorTileLayer, resolutions: number[]) {
    this.titelEmit.emit(this.SelectedVisualisation);
    var StyleJson = getJsonurl(this.SelectedVisualisation)
    this.colorMap.clear();
    if (StyleJson !== '') {
      fetch(StyleJson).then((response) => {
        response.json().then((glStyle) => {

          //if you just want simply apply on style use "
          //import { applyStyle } from 'ol-mapbox-style';
          // applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions);
          //"instead of the following: 

          fetch(this.getSpriteDataUrl(glStyle.sprite)).then((response2) => {
            response2.json().then((spritedata) => {
              const imageUrl = this.getSpriteImageUrl(glStyle.sprite);
              this.stfunction = stylefunction(vectorTileLayer, glStyle, "bgt", resolutions, spritedata, imageUrl) as StyleFunction;
              //applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions);
              vectorTileLayer.setStyle(this.bgtstyle.bind(this) as any);

            })
          });
          // end of apply 

        });
      });

    }
    else {
      if (this.SelectedVisualisation === Visualisatie.zerodefaultA) {
        vectorTileLayer.setStyle();
      }
      else {
        vectorTileLayer.setStyle(this.bgtstyle.bind(this) as any);
      }
    }
  }



  private toBraile(instring: string) {

    return (instring.toUpperCase().split("").map(c => "⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿"[" A1B'K2L@CIF/MSP\"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)=".indexOf(c)]).join(""));

  }


  bgtstyle(feature: Feature<Geometry>, resolution: number) {
    const geometry = feature.getGeometry();
    const prop = feature.getProperties();
    // var color: DrawColor | undefined = undefined;
    var featurelabeltext = { text: "", rotation: 0, font: "12px Arial" };

    switch (this.SelectedVisualisation) {
      case Visualisatie.tactiel:
      case Visualisatie.standaard:
      case Visualisatie.achtergrond:
        var colorprop = 'layer'
        var isText = GetBGTlabelAnnotation(prop, colorprop, featurelabeltext);
        if (this.SelectedVisualisation === Visualisatie.tactiel && isText) {
          isText = this.toBraile(isText);
          featurelabeltext.text = isText;

        }

        if (this.stfunction) {
          var tmpstyle = this.stfunction(feature as FeatureLike, resolution);

          if (this.colorMap.has(prop[colorprop])) {
            var exitingColor = this.colorMap.get(prop[colorprop]);
            if (exitingColor!.show) {
              return (exitingColor!.showfreshstyle(featurelabeltext, tmpstyle));

            }
          }
          else {
            //set style 

            var newcolor = new DrawColor(prop[colorprop], feature, true, isText);
            if (this.SelectedVisualisation === Visualisatie.tactiel && isText) {
              newcolor.mapbox = false;
            }

            if (tmpstyle) {
              var stylearray = tmpstyle as Style[];
              var fill = stylearray[0].getFill()
              if (fill) {
                var fillcolor = fill.getColor();
                newcolor.rbgString = fillcolor as string;
                this.colorMap.set(prop[colorprop], newcolor)
                //add modified fill 
              }
              else {
                // newcolor.rbgString = 'rgba(0,0,0,1)'
                newcolor.style = stylearray[0];
                this.colorMap.set(prop[colorprop], newcolor)
                // add modified else
              }
            }

            return tmpstyle;
          }
        }
        break;

      case Visualisatie.zerodefaultB:
        return (new DrawColor("default zero", feature, false, false).showfreshstyle(featurelabeltext));

        break;

      case Visualisatie.zerodefaultC_Bron:
        var colorprop = 'bronhouder';
        var zcolor: DrawColor
        {
          if (this.colorMap.has(prop[colorprop])) {
            zcolor = this.colorMap.get(prop[colorprop])!;
          }

          else {
            var newbroncolor = new DrawColor(prop[colorprop], feature, false, false);
            this.colorMap.set(prop[colorprop], newbroncolor)
            zcolor = newbroncolor;
          }
        }
        return zcolor.showfreshstyle(featurelabeltext);
        break;

      case Visualisatie.zerodefaultD:
        {
          var colorprop = 'layer'
          var isText = GetBGTlabelAnnotation(prop, colorprop, featurelabeltext);
          if (this.colorMap.has(prop[colorprop])) {
            return this.colorMap.get(prop[colorprop])!.showfreshstyle(featurelabeltext);
          }
          else {
            var newcolor = new DrawColor(prop[colorprop], feature, false, isText);
            this.colorMap.set(prop[colorprop], newcolor)
            return newcolor.showfreshstyle(featurelabeltext);
          }
        }
        break;
      default: {
        throw new Error("Visualisatie not found");
      }

    }

    function GetBGTlabelAnnotation(prop: any, colorprop: string, featurelabeltext: { text: string; rotation: number; }): Annotation {

      if (prop[colorprop] === 'pand_nummeraanduiding') {
        featurelabeltext.text = prop['tekst'];

        var deg = prop['hoek'];
        featurelabeltext.rotation = (deg * Math.PI) / 180.0;
        return prop['tekst']
      }
      if (prop[colorprop] === 'openbareruimtelabel') {
        featurelabeltext.text = prop['openbareruimtenaam'];

        var deg = prop['hoek'];
        featurelabeltext.rotation = (deg * Math.PI) / 180.0;
        return prop['openbareruimtenaam']
      }
      return false
    }
  }

  getVectorTileSource(projection: Projection) {
    this.resolutions = this.getResolutionsVt(12)
    return new VectorTileSource({
      format: new MVT(),
      projection: projection,
      tileGrid: new TileGrid({
        extent: projection.getExtent(),
        resolutions: this.resolutions,
        tileSize: [256, 256],
        origin: getTopLeft(projection.getExtent())
      }),
      url: this.getVectorTileUrl(),
      cacheSize: 0
    })
  }

  getVectorTileUrl() {
    let tileEndpoint: VectorTileUrl = tileurl;
    return `${tileEndpoint.url}/{z}/{x}/{y}${tileEndpoint.extension}`;
  }

  setTileSource(projection: Projection, vectorTileLayer: VectorTileLayer) {

    let vtSource = this.getVectorTileSource(projection)
    // set invisible to prevent unstyled flashing of vectorTileLayer
    vectorTileLayer.setVisible(false)
    vectorTileLayer.setSource(vtSource)
    vectorTileLayer.setVisible(true)
    vectorTileLayer.set('renderMode', 'hybrid')
  }

  showselectedFeature() {
    return (this.selectedFeature !== undefined);
  }









  NewColorMap() {
    this.colorMap.clear();
    this.vectorTileLayer.getSource()!.refresh();
  }

  ApplyColorMap() {
    this.vectorTileLayer.getSource()!.refresh();
  }

  DemoRandomLocationToggle() {
    this.isDemoLocatieRotate = !this.isDemoLocatieRotate
    if (this.isDemoLocatieRotate) {
      this.demotextLocatie = this.demotextLocatieUit;
      this.gotoRandomLocation();
    } else {
      this.demotextLocatie = this.demotextLocatieAan;
    }
  }

  DemogotoStartLocationOnMap() {
    this.isShowDetails = false;
    this.isShowLegend = false;
    this.isShowDemo = false;
    this.isDemoVisualisatieRotate = false;
    this.isDemoLocatieRotate = false;
    this.SelectedVisualisation = Visualisatie.standaard;
    const newloc = this.locationService.initialView;
    this.changeStyleJson(this.vectorTileLayer, this.resolutions);
    this.locationService.changeView(newloc);
  }

  DemoVisualisationToggle() {
    this.isDemoVisualisatieRotate = !this.isDemoVisualisatieRotate
    if (this.isDemoVisualisatieRotate) {
      this.demotextVisualisatie = this.demotextVisualisatieUit;
      this.SelectedVisualisation = Visualisatie.achtergrond;
      this.repeating_style_function()
    } else {
      this.demotextVisualisatie = this.demotextVisualisatieAan;
    }
  }


  gotoRandomLocation() {
    if (this.isDemoLocatieRotate) {
      var dx = 155000 + Math.round(Math.random() * 50000)
      var dy = 463000 + Math.round(Math.random() * 50000)
      const newloc = new View({
        projection: this.locationService.rdProjection,
        center: [dx, dy],
        zoom: 13,
        enableRotation: false

      }); 
      this.locationService.changeView(newloc);
      setTimeout(() => { this.gotoRandomLocation() }, 8000);
    }
  }

  repeating_style_function() {
    if (this.isDemoVisualisatieRotate) {
      this.SelectedVisualisation = getRandomEnumValue(Visualisatie);
      this.changeStyleJson(this.vectorTileLayer, this.resolutions);
      setTimeout(() => { this.repeating_style_function() }, Math.round(Math.random() * 4000));
    }
  }


  getSpriteImageUrl(url: string) {
    const spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1;
    const sizeFactor = spriteScale == 0.5 ? '@2x' : '';
    return (url + sizeFactor + '.png')

  }

  getSpriteDataUrl(url: string) {
    const spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1;
    const sizeFactor = spriteScale == 0.5 ? '@2x' : '';
    return (url + sizeFactor + '.json')

  }













}

