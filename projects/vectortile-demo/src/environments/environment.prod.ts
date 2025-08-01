// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Quad } from '../app/enumVisualisatie'



const urlQuad = (base: string, constantPath: string, constantQuery: string): { [key in Quad]: URL } => {
  const urls: { [key in Quad]: URL }
  = {netherlandsrdnewquad: new URL(`${base}${constantPath}netherlandsrdnewquad?${constantQuery}`),
  europeanetrs89_laeaquad: new URL(`${base}${constantPath}europeanetrs89_laeaquad?${constantQuery}`),
  webmercatorquad: new URL(`${base}${constantPath}webmercatorquad?${constantQuery}`)}
  return urls;
};

//const quads = [ 'netherlandsrdnewquad', 'europeanetrs89_laeaquad' , 'webmercatorquad' ]


export const environment = {
  production: true,

  BRTTop10Standaardjsonurl: urlQuad( 'https://api.pdok.nl/brt/top10nl/ogc/v1/styles', '/brt_top10nl__', 'f=mapbox'),
  BrkWKPBStandaardjsonurl: 'styles/brk/wkpb_standaardvisualisatie_nederlandsRDNewQuad.json',
  BGTmapboxachtergrondjsonurl: 'styles/bgt_achtergrondvisualisatie.json',
  BGTmapboxstandaardjsonurl: 'styles/bgt_standaardvisualisatie.json',
  BAGmapboxbagstd:    urlQuad('https://api.pdok.nl/lv/bag/ogc/v1/styles', '/bag_standaardvisualisatie__', 'f=json'),
  BAGmapboxbagCompleet:  urlQuad( 'https://api.pdok.nl/lv/bag/ogc/v1/styles', '/bag_standaardvisualisatie_compleet__', 'f=json'),
  BGTmapboxtactieljsonurl: 'styles/tactielevisualisatie.json',
  BESTUURWithLabels: 'styles/bestuurlijkegebieden_annotated.json',
  BESTUURstd:    'https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1/styles/bestuurlijkegebieden_standaardvisualisatie?f=json',
  DKKstandaard:'https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/styles/standaardvisualisatie__netherlandsrdnewquad',
  DKKkwaliteit:'https://api.pdok.nl/kadaster/brk-kadastrale-kaart/ogc/v1/styles/kwaliteitsvisualisatie__netherlandsrdnewquad',
  BrtAchtergrondStandaard_annotated: 'styles/brt/brt_achtergrondkaart_standaard_annotated_nederlandsrdnewquad.json',
  BrtAchtergrondStandaard: 'styles/brt/brt_achtergrondkaart_standaard_nederlandsrdnewquad.json',
  BrtLuchtfoto_Annotation: 'styles/brt/brt_luchtfoto_annotated_nederlandsrdnewquad.json',
  BrtAchtergrondDarkmode_annotated: 'styles/brt/brt_achtergrondkaart_darkmode_annotated_nederlandsrdnewquad.json',
}
