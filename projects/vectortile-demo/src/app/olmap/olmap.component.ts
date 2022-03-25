import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Feature, Map as olMap, View, } from 'ol';
import stylefunction from 'ol-mapbox-style/dist/stylefunction'
import { getTopLeft, getWidth } from 'ol/extent.js';
import MVT from 'ol/format/MVT.js';
import { Geometry } from 'ol/geom';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import 'ol/ol.css';

import Projection from 'ol/proj/Projection';
import VectorTileSource from 'ol/source/VectorTile.js';
import Stroke from 'ol/style/Stroke';
import Style, { StyleFunction } from 'ol/style/Style';
import TileGrid from 'ol/tilegrid/TileGrid';
import { LocationService, ViewLocation } from '../location.service';
import { VectorTileUrl, tileurl } from './tileurl';
import { KeyValue } from '@angular/common';
import { getJsonurl, Visualisatie, getRandomEnumValue } from '../enumVisualisatie';
import { DrawColor } from "../color"
import { FeatureLike } from 'ol/Feature';

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
  @Input() set visualisation(vis: Visualisatie) {
    this.SelectedVisualisation = vis;

  }
  colorMap = new Map<string, DrawColor>();
  newcolorMap = new Map<string, DrawColor>();
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
    minZoom: 13
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

  constructor(private locationService: LocationService) {

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
    return (view.getZoom());
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
          //if you just want simply apply on style use "applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions); "
          //instead of the following: 
          var stfunction = stylefunction(vectorTileLayer, glStyle, "bgt", resolutions) as StyleFunction;
          this.collectLayers(vectorTileLayer, stfunction);
        });
      });

    }
    else {
      if (this.SelectedVisualisation === Visualisatie.zerodefaultA) {
        vectorTileLayer.setStyle();
      }
      else {
        this.collectLayers(vectorTileLayer, vectorTileLayer.getStyleFunction());
      }
    }
  }

  clearColorMap() {
    this.colorMap.clear();
  }

  private collectLayers(vectorTileLayer: VectorTileLayer, stfunction: StyleFunction | undefined) {
    var that = this;
    var font = "";
    const style = (feature: { getGeometry: () => any; getProperties: () => any; }) => {
      const geometry = feature.getGeometry();
      const prop = feature.getProperties();
      var color: DrawColor | undefined = undefined;
      var featurelabeltext = { text: "", rotation: 0 };
      switch (that.SelectedVisualisation) {
        case Visualisatie.standaard:
        case Visualisatie.achtergrond:
          var colorprop = 'layer'
          BGTlabeltexthandling(prop, colorprop, featurelabeltext);
          if (stfunction) {
            var tmpstyle = stfunction(feature as FeatureLike, this.view.getResolution()!);
            if (that.colorMap.has(prop[colorprop])) {
              var color = that.colorMap.get(prop[colorprop]);
              if (color!.show) {
                if (color!.mapbox) {
                  return tmpstyle;
                }
              }
            }

            else {
              var newcolor = new DrawColor(prop[colorprop], geometry, '', true);
              if (tmpstyle) {
                var stylearray = tmpstyle as Style[];
                var fill = stylearray[0].getFill()

                if (fill) {
                  var fillcolor = fill.getColor();
                  newcolor.rbgString = fillcolor as string;
                  that.colorMap.set(prop[colorprop], newcolor)
                }
                else {
                  newcolor.rbgString = 'rgba(225,255,255,0)'
                  that.colorMap.set(prop[colorprop], newcolor)

                }
              }
              return tmpstyle;
            }
          }
          break;

        case Visualisatie.zerodefaultB:
          color = new DrawColor("default zero", geometry);
          break;

        case Visualisatie.zerodefaultC_Bron:
          var colorprop = 'bronhouder';
          {
            if (that.colorMap.has(prop[colorprop])) {
              color = that.colorMap.get(prop[colorprop]);
            }

            else {
              var newcolor = new DrawColor(prop[colorprop], geometry);
              that.colorMap.set(prop[colorprop], newcolor)
              color = newcolor;
            }
          }
          break;

        case Visualisatie.zerodefaultD:
          {
            var colorprop = 'layer'
            BGTlabeltexthandling(prop, colorprop, featurelabeltext);
            if (that.colorMap.has(prop[colorprop])) {
              color = that.colorMap.get(prop[colorprop]);
            }
            else {
              var newcolor = new DrawColor(prop[colorprop], geometry);
              that.colorMap.set(prop[colorprop], newcolor)
              color = newcolor;
            }
          }
          break;
        default:
          {
            var colorprop = 'layer'
            if (that.colorMap.has(prop[colorprop])) {
            }
            else {
              var newcolor = new DrawColor(prop[colorprop], geometry);
              that.colorMap.set(prop[colorprop], newcolor)

            }
            return (vectorTileLayer.getStyle());
          }

      }
      return color!.style(featurelabeltext, font);
    }
    vectorTileLayer.setStyle(style as any);

    function BGTlabeltexthandling(prop: any, colorprop: string, featurelabeltext: { text: string; rotation: number; }) {
      if (prop[colorprop] === 'pand_nummeraanduiding') {
        featurelabeltext.text = prop['tekst'];
        var deg = prop['hoek'];
        featurelabeltext.rotation = (deg * Math.PI) / 180.0;
      }
      if (prop[colorprop] === 'openbareruimtelabel') {
        featurelabeltext.text = prop['openbareruimtenaam'];
        var deg = prop['hoek'];
        featurelabeltext.rotation = (deg * Math.PI) / 180.0;
      }
    }
  }

  setimageline(vectorlayer: any) {
    var style = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 4
        })
      }),
      new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2
        })
      })
    ]
    vectorlayer.setStyle(style);
  }


  getVectorTileSource(projection: Projection, tileEndpoint: VectorTileUrl) {
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
      url: `${tileEndpoint.url}/{z}/{x}/{y}${tileEndpoint.extension}`,
      cacheSize: 0
    })
  }

  setTileSource(projection: Projection, vectorTileLayer: VectorTileLayer) {
    let tileEndpoint: VectorTileUrl = tileurl;
    let vtSource = this.getVectorTileSource(projection, tileEndpoint)
    // set invisible to prevent unstyled flashing of vectorTileLayer
    vectorTileLayer.setVisible(false)
    vectorTileLayer.setSource(vtSource)
    vectorTileLayer.setVisible(true)
    vectorTileLayer.set('renderMode', 'hybrid')
  }

  showselectedFeature() {
    return (this.selectedFeature !== undefined);
  }

  colorArray() {
    return new Map<string, DrawColor>([...this.colorMap.entries()].sort());
  }

  onCheckboxAllChange(event: any) {
    this.colorMap.forEach(x => { x.show = event.target.checked })
    this.vectorTileLayer.getSource()!.refresh();
  }

  onColorChange(row: KeyValue<string, DrawColor>) {
    row.value.mapbox = false;
    this.vectorTileLayer.getSource()!.refresh();
  }

  onCheckboxChange(event: any, row: KeyValue<string, DrawColor>) {
    var ui = row.value;
    var newvalue = new DrawColor(ui.label, ui.legendfeature);
    newvalue.show = event.target.checked;
    if (this.colorMap.has(ui.label)) {
      this.colorMap.set(ui.label, newvalue)
    }
    this.vectorTileLayer.getSource()!.refresh();
  }

  NewColorMap() {
    this.clearColorMap();
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
        zoom: 13
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

}
