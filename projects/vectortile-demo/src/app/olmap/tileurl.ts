export type OGCApiRootUrl = {
  url: string, lokaalIdRegex: RegExp
} | undefined
export type VectorTileUrl = {
  vectorTileUrl: string; tileMatrixPart: string, extension: string, ogcApiRootUrl: OGCApiRootUrl, xyzTemplate:string

}
const RDPART = '/NetherlandsRDNewQuad'
export const tileurlBGT: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/lv/bgt/ogc/v1_0/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/lv/bgt/ogc/v1",
    lokaalIdRegex: /[GPWL]{1}\d{4}\.[a-f0-9]{32}/g
  }
}
export const tileurlDKK: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/kadastralekaart/ogc/v5-preprod/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/kadaster/kadastralekaart/ogc/v5-preprod",
    lokaalIdRegex: /[GPWL]{1}\d{4}\.[a-f0-9]{32}/g
  }
}

export const tileurlBAG: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/lv/bag/ogc/v1_0/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: undefined
}

export const tileurlBestuur: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0/tiles',
  tileMatrixPart:RDPART ,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
   ogcApiRootUrl: {
    url: "https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0",
    lokaalIdRegex: /^\d{1,16}$/
  }
}

export const tileurlTop10: VectorTileUrl = {
  vectorTileUrl: 'https://api.pdok.nl/brt/top10nl/ogc/v1/tiles',
  tileMatrixPart:RDPART,
  extension: '.pbf',
  xyzTemplate: '/{z}/{y}/{x}',
  ogcApiRootUrl: {
    url: "https://api.pdok.nl/brt/top10nl/ogc/v1",
    lokaalIdRegex: /^\d{1,16}$/
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
