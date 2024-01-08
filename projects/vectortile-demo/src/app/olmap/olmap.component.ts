import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { Router } from '@angular/router';
import { Feature, MapBrowserEvent, Map as olMap, View } from 'ol';
import Link from 'ol/interaction/Link.js';

import { stylefunction } from 'ol-mapbox-style';
import { getTopLeft, getWidth } from 'ol/extent.js';
import MVT from 'ol/format/MVT.js';
import { Geometry } from 'ol/geom';
import VectorTileLayer from 'ol/layer/VectorTile.js';

import { FeatureLike } from 'ol/Feature';
import { DEVICE_PIXEL_RATIO } from 'ol/has';
import Projection from 'ol/proj/Projection';
import VectorTileSource from 'ol/source/VectorTile.js';
import Fill from 'ol/style/Fill';
import { StyleFunction } from 'ol/style/Style';
import TileGrid from 'ol/tilegrid/TileGrid';
import { Annotation, DrawColor, getFillColor, LabelType } from '../color';
import { ColorMap, LegendLevel } from '../colorMap';
import {
  Visualisatie,
  getStyleUrl,
  exhaustiveGuard,
} from '../enumVisualisatie';
import { LocationService, ViewLocation } from '../location.service';

import {
  getSpriteDataUrl,
  getSpriteImageUrl,
  tileurlBAG,
  tileurlBestuur,
  tileurlBGT,
  VectorTileUrl,
} from './tileurl';
import { NgElement, WithProperties } from '@angular/elements';

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OlmapComponent implements OnInit, OnChanges {
  @Output() titelEmit: EventEmitter<Visualisatie> = new EventEmitter();
  private SelectedVisualisation: Visualisatie = Visualisatie.BGTachtergrond;
  private stfunction: StyleFunction | undefined;
  colorMap = new ColorMap(LegendLevel.d1_layer);
  showUrl = '';
  zoom: number = 13;

  @Input() set visualisation(vis: Visualisatie) {
    this.SelectedVisualisation = vis;
    this.colorMap.setSelector(LegendLevel.d1_layer);
  }

  private vectorTileLayerRD = new VectorTileLayer({
    renderMode: 'hybrid',
    declutter: true,
    useInterimTilesOnError: false,
  });

  CurrentVectorTileLayer: VectorTileLayer = this.vectorTileLayerRD;

  readonly rdProjection: Projection = new Projection({
    code: 'EPSG:28992',
    extent: [-285401.92, 22598.08, 595401.92, 903401.92],
  });

  /*
  readonly WGS84Projection: Projection = new Projection({
    code: 'EPSG:3857',
    extent: [3.2, 50.75, 7.22, 53.7]
  });
  */

  map1: olMap = new olMap({
    layers: [this.vectorTileLayerRD], //, this.vectorTileLayerRD],
    target: 'map1',
    view: this.viewRD(this.zoom),
  });

  resolutions: Array<number> = [];
  matrixIds: Array<string> = [];

  //public selectedFeature: Feature<Geometry> | undefined;

  public selectedFeatures: FeatureLike[] = [];
  currentlocation: ViewLocation | undefined;

  isShowDetails = false;
  isShowLegend = false;
  isShowDemo = false;

  detailsupdate = true;

  viewRD(minZoom: number): View {
    return new View({
      projection: this.rdProjection,
      center: [155000, 463000],
      zoom: minZoom,
      minZoom: minZoom,
      enableRotation: false,
    });
  }

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.locationService.currentLocation.subscribe((currentLocation) => {
      this.currentlocation = currentLocation;
      const cview = this.map1.getView();
      if (currentLocation.view) {
        cview.setCenter(currentLocation.view.getCenter());
      }
    });
    this.calcMatrixAndResolutions(this.rdProjection);
    this.map1 = new olMap({
      layers: [this.vectorTileLayerRD],
      target: 'map1',
      view: this.viewRD(this.zoom),
    });
    this.map1.addInteraction(new Link());

    this.map1.on(['moveend'], () => {
      this.locationService.changeView(this.map1.getView());
    });

    this.map1.on(['click', 'pointermove'], (event) => {
      let found = false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = event as any;

      if (this.detailsupdate) {
        this.selectedFeatures = [];
        this.map1.forEachFeatureAtPixel(e.pixel, (feature) => {
          if (feature) {
            found = true;
            this.selectedFeatures.push(feature);
          }
        });
      }
      if (event.type == 'click') {
        this.detailsupdate = !this.detailsupdate;
      }

      this.map1.getTargetElement().style.cursor =
        found && this.detailsupdate ? 'pointer' : '';
    });
  }

  ngOnChanges(): void {
    this.changeStyleJson();
  }

  toggleShowDetails() {
    this.isShowDetails = !this.isShowDetails;
    this.detailsupdate = this.isShowDetails;
  }

  toggleShowLegend() {
    this.isShowLegend = !this.isShowLegend;
  }

  toggleShowDemo() {
    this.isShowDemo = !this.isShowDemo;
  }

  hasLegend() {
    return this.colorMap.items.size > 0;
  }

  getZoomLevel() {
    const view = this.map1.getView();
    return view.getZoom()?.toFixed(1);
  }

  getDevicePixelRatio() {
    return DEVICE_PIXEL_RATIO;
  }

  getResolutionsVt(z = 9) {
    return this.getMatrixIdsVt(z).map((x) => 3440.64 / 2 ** x);
  }

  getMatrixIdsVt(z = 9) {
    return Array(z + 1)
      .fill(null)
      .map((x, i) => i);
  }

  private calcMatrixAndResolutions(rdProjection: Projection) {
    const tileSizePixels = 256;
    const tileSizeMtrs = getWidth(rdProjection.getExtent()) / tileSizePixels;
    for (let i = 0; i <= 15; i++) {
      this.matrixIds[i] = i.toString();
      this.resolutions[i] = tileSizeMtrs / Math.pow(2, i);
    }
  }

  getFillColor(feature: Feature<Geometry>, layer: VectorTileLayer, view: View) {
    const mpstyle = layer.getStyleFunction();
    const reso = view.getResolution();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const st = mpstyle!(feature, reso!);
    let color: string | number[] | CanvasGradient | CanvasPattern = '';

    if (st instanceof Array) {
      const fill = st[st.length - 1].getFill();
      if (fill) {
        color = fill.getColor() as string;
      }
    } else {
      const stStyle = st as any;
      const colcolor = stStyle.fill_.color_ as
        | string
        | number[]
        | CanvasGradient
        | CanvasPattern;
      color = colcolor;
    }

    if (color instanceof CanvasPattern) {
      const canvas = true;
      // not yet implemented boomgaard
    }

    return color;
  }

  visualisationChange(data: Visualisatie) {
    this.SelectedVisualisation = data;
    this.changeStyleJson();
  }

  private changeStyleJson() {
    let minzoom = 13;

    switch (this.SelectedVisualisation) {
      case Visualisatie.BESTUURBlanko:
      case Visualisatie.BESTUURWithLabels:
      case Visualisatie.BESTUURstd:
        minzoom = 3;
        break;

      default:
        break;
    }

    this.calcMatrixAndResolutions(this.rdProjection);
    this.map1.setView(this.viewRD(minzoom));
    this.titelEmit.emit(this.SelectedVisualisation);
    const vectorTileLayer = this.vectorTileLayerRD;
    const resolutions = this.resolutions;
    this.map1.setView(this.viewRD(minzoom));
    vectorTileLayer.setVisible(true);
    const JsonUrl = getStyleUrl(this.SelectedVisualisation);

    if (JsonUrl.source == 'bag') {
      this.setTileSource(
        this.rdProjection,
        this.vectorTileLayerRD,
        tileurlBAG,
        12
      );
      this.showUrl = tileurlBAG.url;
    }
    if (JsonUrl.source == 'bgt') {
      this.setTileSource(
        this.rdProjection,
        this.vectorTileLayerRD,
        tileurlBGT,
        12
      );
      this.showUrl = tileurlBGT.url;
    }
    if (JsonUrl.source == 'bestuurlijkegebieden') {
      this.setTileSource(
        this.rdProjection,
        this.vectorTileLayerRD,
        tileurlBestuur,
        2
      );
      this.showUrl = tileurlBGT.url;
    }

    if (JsonUrl.url) {
      fetch(JsonUrl.url).then((response) => {
        response.json().then((glStyle) => {
          //if you just want simply apply on style use "
          //import { applyStyle } from 'ol-mapbox-style';
          // applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions);
          //"instead of the following:
          if (glStyle.sprite) {
            fetch(getSpriteDataUrl(glStyle.sprite)).then((response2) => {
              response2.json().then((spritedata) => {
                const imageUrl = getSpriteImageUrl(glStyle.sprite);

                this.stfunction = stylefunction(
                  vectorTileLayer,
                  glStyle,
                  JsonUrl.source,
                  resolutions,
                  spritedata,
                  imageUrl
                ) as StyleFunction;
                //use applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions);
                vectorTileLayer.setStyle(this.doStyle.bind(this) as any);
              });
            });
          } else {
            this.stfunction = stylefunction(
              vectorTileLayer,
              glStyle,
              JsonUrl.source,
              resolutions
            ) as StyleFunction;
            //use applyStyle(vectorTileLayer, glStyle, "bgt", undefined, resolutions);
            vectorTileLayer.setStyle(this.doStyle.bind(this) as any);
          }
          // end of apply
        });
      });
    } else {
      switch (this.SelectedVisualisation) {
        case Visualisatie.BESTUURBlanko:
        case Visualisatie.Bagblanko:
        case Visualisatie.BGTzerodefaultA_blanco:
          vectorTileLayer.setStyle();
          break;

        /*
           case Visualisatie.Bagstd:
   
             if (vectorTileLayer.getSource()) {
               this.map1.setView(this.viewRD)
               vectorTileLayer.setStyle();
               vectorTileLayer.setVisible(true);
               vectorTileLayer.getSource()!.changed();
   
   
             }
             else {
               throw new Error("currentlayer not found");
             }
   
             */

        default:
          vectorTileLayer.setStyle(this.doStyle.bind(this) as any);
          break;
      }
    }
  }

  private toBraile(instring: LabelType): LabelType {
    return {
      text: instring.text
        .toUpperCase()
        .split('')
        .map(
          (c) =>
            '⠀⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿'[
              ' A1B\'K2L@CIF/MSP"E3H9O6R^DJG>NTQ,*5<-U8V.%[$+X!&;:4\\0Z7(_?W]#Y)='.indexOf(
                c
              )
            ]
        )
        .join(''),
      font: 'bold 40px Courier New',
      rotation: instring.rotation,
      backgroundfill: new Fill({ color: 'white' }),
    };
  }

  doStyle(feature: Feature<Geometry>, resolution: number) {
    const prop = feature.getProperties();
    let isText = GetLabelAnnotation(prop, prop['layer']);
    switch (this.SelectedVisualisation) {
      case Visualisatie.BGTtactiel:
      case Visualisatie.BGTstandaard:
      case Visualisatie.BGTachtergrond:
      case Visualisatie.Bagstd:
      case Visualisatie.BagCompleet:
      case Visualisatie.BESTUURWithLabels:
      case Visualisatie.BESTUURstd: {
        const legendTitle = this.colorMap.selector(prop);

        if (this.SelectedVisualisation === Visualisatie.BGTtactiel && isText) {
          isText = this.toBraile(isText);
        }

        if (this.stfunction) {
          const tmpstyle = this.stfunction(feature, resolution);

          if (this.colorMap.has(legendTitle)) {
            const exitingColor = this.colorMap.get(legendTitle);
            if (exitingColor?.show) {
              return exitingColor.showfreshstyle(isText, tmpstyle);
            }
          } else {
            //set style

            const newcolor = new DrawColor(legendTitle, feature, true, isText);
            if (
              this.SelectedVisualisation === Visualisatie.BGTtactiel &&
              isText
            ) {
              newcolor.mapbox = false;
            }
            if (tmpstyle) {
              newcolor.rbgString = getFillColor(tmpstyle) as string;
              this.colorMap.set(legendTitle, newcolor);
            }

            return tmpstyle;
          }
        }
        break;
      }

      //tempory disabled  case Visualisatie.BGTzerodefaultB_tegels:
      case Visualisatie.BagKleurrijk_tegels:
      case Visualisatie.BGTzerodefaultB_tegels:
        return new DrawColor(
          'default zero',
          feature,
          false,
          false
        ).showfreshstyle(isText);

      case Visualisatie.BGTzerodefaultC_Bron: {
        // const colorprop = 'bronhouder';
        const bronLegendTitle = this.colorMap.selectorBron(prop);

        let zcolor: DrawColor;
        {
          if (this.colorMap.has(bronLegendTitle)) {
            zcolor = this.colorMap.get(bronLegendTitle)!;
          } else {
            const newbroncolor = new DrawColor(
              bronLegendTitle,
              feature,
              false,
              false
            );
            this.colorMap.set(bronLegendTitle, newbroncolor);
            zcolor = newbroncolor;
          }
        }
        return zcolor.showfreshstyle(isText);
      }
      case Visualisatie.Bagkleurrijk:
      case Visualisatie.BGTzerodefaultD_kleur: {
        const layer = prop['layer'];
        const zerodefaultText = GetLabelAnnotation(prop, layer);
        if (this.colorMap.has(layer)) {
          return this.colorMap.get(layer)?.showfreshstyle(zerodefaultText);
        } else {
          const newcolor = new DrawColor(
            layer,
            feature,
            false,
            zerodefaultText
          );
          this.colorMap.set(layer, newcolor);
          return newcolor.showfreshstyle(zerodefaultText);
        }
      }

      case Visualisatie.Bagblanko:
      case Visualisatie.BGTzerodefaultA_blanco:
      case Visualisatie.BESTUURBlanko:
        return new DrawColor(
          'default zero',
          feature,
          false,
          false
        ).showfreshstyle(isText);

      default: {
        exhaustiveGuard(this.SelectedVisualisation);
      }
    }

    function GetLabelAnnotation(prop: any, layer: string): Annotation {
      let text = '';
      if (layer === 'pand_nummeraanduiding') {
        text = prop['tekst'];
      }
      if (layer === 'openbareruimtelabel') {
        text = prop['openbareruimtenaam'];
      }
      if (text !== '') {
        const deg = prop['hoek'];
        const rot = ((360 - deg) * Math.PI) / 180.0;

        const anno: LabelType = {
          text,
          rotation: rot,
          font: '',
          backgroundfill: new Fill({ color: 'white' }),
        };
        return anno;
      } else {
        return false;
      }
    }
  }

  getVectorTileSource(
    projection: Projection,
    tileEndpoint: VectorTileUrl,
    zoom: number
  ) {
    this.resolutions = this.getResolutionsVt(zoom);
    return new VectorTileSource({
      format: new MVT(),
      projection: projection,
      tileGrid: new TileGrid({
        extent: projection.getExtent(),
        resolutions: this.resolutions,
        tileSize: [256, 256],
        origin: getTopLeft(projection.getExtent()),
      }),
      url: this.getVectorTileUrl(tileEndpoint),
      cacheSize: 0,
    });
  }

  getVectorTileUrl(tileurl: VectorTileUrl) {
    return `${tileurl.url}/{z}/{y}/{x}${tileurl.extension}`;
  }

  getShowTileUrl() {
    return this.showUrl;
  }

  getShowStyleUrl() {
    const url = getStyleUrl(this.SelectedVisualisation).url;
    if (url) {
      return url;
    } else {
      {
        return '';
      }
    }
  }

  setTileSource(
    projection: Projection,
    vectorTileLayer: VectorTileLayer,
    tileEndpoint: VectorTileUrl,
    zoom: number
  ) {
    let vtSource = this.getVectorTileSource(projection, tileEndpoint, zoom);
    // set invisible to prevent unstyled flashing of vectorTileLayer
    vectorTileLayer.setVisible(false);
    vectorTileLayer.setSource(vtSource);
    vectorTileLayer.setVisible(true);
    vectorTileLayer.set('renderMode', 'hybrid');
  }

  showselectedFeatures(): boolean {
    return this.selectedFeatures.length > 0;
  }

  NewColorMap() {
    this.colorMap.clear();
    this.vectorTileLayerRD.getSource()!.refresh();
  }

  private ApplyColorMap() {
    this.vectorTileLayerRD.getSource()!.refresh();
  }
}
