export type OGCApiRootUrl = {
  url: string, lokaalIdRegex: RegExp, fieldname: string
} | undefined
export type VectorTileUrl = {
  vectorTileUrl: string; tileMatrixPart: string, extension: string, ogcApiRootUrl: OGCApiRootUrl, xyzTemplate:string

}
const RDPART = '/NetherlandsRDNewQuad'
export const tileurlBGT: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/lv/bgt/ogc/v1/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/lv/bgt/ogc/v1",
    lokaalIdRegex: /^[GPWL]{1}\d{4}\.[a-f0-9]{32}$/,
    fieldname: 'lokaal_id'
  }
}
export const tileurlDKK: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1",
    lokaalIdRegex: /[GPWL]{1}\d{4}\.[a-f0-9]{32}/g,
    fieldname: 'lokaal_id'
  }


}

export const tileurlWKPB: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/brk-publiekrechtelijke-beperkingen-wkpb/ogc/v1-preprod/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
    ogcApiRootUrl: undefined
  }




export const tileurlBAG: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/bag/ogc/v2/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: { url: 'https://api.pdok.nl/kadaster/bag/ogc/v2',
  lokaalIdRegex: /\d{16}/,
  fieldname: 'identificatie'
  }

}

export const tileurlBestuur: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
   ogcApiRootUrl: {
    url: "https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0",
    lokaalIdRegex: /^\d{1,16}$/,
    fieldname: 'identificatie'
  }
}

 export const tileurlBRTAchtergrond: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/brt-achtergrondkaart/ogc/v1/tiles',
  tileMatrixPart:RDPART ,
  extension: '?f=mvt',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: undefined,

}

/*
 export const tileurlBRTAchtergrond: VectorTileUrl = {
  vectorTileUrl: 'http://127.0.0.1//brt',
  tileMatrixPart:'' ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{x}/{y}',
  ogcApiRootUrl: undefined
 }
 */

export const tileurlTop10: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/brt/top10nl/ogc/v1/tiles',
  tileMatrixPart:RDPART,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/brt/top10nl/ogc/v1",
    lokaalIdRegex: /^\d{1,16}$/,
    fieldname : 'lokaal_id'
  }
}


export function getSpriteImageUrl(url: string) {
  const spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1
  const sizeFactor = spriteScale == 0.5 ? '@2x' : ''
  return url + sizeFactor + '.png'
}

export function getSpriteDataUrl(url: string) {
  const spriteScale = window.devicePixelRatio >= 1.5 ? 0.5 : 1
  const sizeFactor = spriteScale == 0.5 ? '@2x' : ''
  return url + sizeFactor + '.json'
}
