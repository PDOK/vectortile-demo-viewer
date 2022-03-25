
import 'ol/ol.css';


import WMTSSource from 'ol/source/WMTS'

import TileLayer from 'ol/layer/Tile.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS.js'

import { getTopLeft, getWidth } from 'ol/extent.js'









import TileGrid from 'ol/tilegrid/TileGrid'


import TileDebug from 'ol/source/TileDebug'



import { applyStyle } from 'ol-mapbox-style/src/index.js';
import { tileurl } from './tileurl';
import {
  SearchComponentEvent,
  SearchComponentEventTypes
} from '@kadaster/generieke-geo-componenten-search';
/*
const tileBackgroundLayer = new TileLayer({
    extent: this.locationService.rdProjection.getExtent(),
    source: new WMTSSource({
      url: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0',
      layer: 'grijs',
      matrixSet: 'EPSG:28992',
      crossOrigin: 'Anonymous',
      format: 'image/png',
      projection: this.locationService.rdProjection,
      tileGrid: new WMTSTileGrid({
        origin: getTopLeft(this.locationService.rdProjection.getExtent()),
        resolutions: this.resolutions,
        matrixIds: this.matrixIds
      }),
      style: 'default'
    })
  })

  // TileDebug can be used to show boundaries of tiling schema
    // off by one vertically
    const debugTLayer = new TileLayer({
        source: new TileDebug({
          projection: this.locationService.rdProjection,
          tileGrid: new TileGrid({
            extent: this.locationService.rdProjection.getExtent(),
            resolutions: this.resolutions,
            tileSize: [256, 256],
            origin: getTopLeft(this.locationService.rdProjection.getExtent())
          })
        })
      })

      */ 