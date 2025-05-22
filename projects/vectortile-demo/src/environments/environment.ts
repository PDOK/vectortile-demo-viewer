// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { demoSettings } from '../app/app.component'
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
  production: false,

  //'https://api.pdok.nl/brt/top10nl/ogc/v1-demo/styles'
  BRTTop10Standaardjsonurl: urlQuad( 'https://api.pdok.nl/brt/top10nl/ogc/v1/styles', '/brt_top10nl__', 'f=mapbox'),
  BGTmapboxachtergrondjsonurl: 'styles/bgt_achtergrondvisualisatie.json',
  BGTmapboxstandaardjsonurl: 'styles/bgt_standaardvisualisatie.json',
  BAGmapboxbagstd:    urlQuad('https://api.pdok.nl/lv/bag/ogc/v1_0/styles', '/bag_standaardvisualisatie__', 'f=json'),
  BAGmapboxbagCompleet:  urlQuad( 'https://api.pdok.nl/lv/bag/ogc/v1_0/styles', '/bag_standaardvisualisatie_compleet__', 'f=json'),
  BGTmapboxtactieljsonurl: 'styles/tactielevisualisatie.json',
  BESTUURWithLabels: 'styles/bestuurlijkegebieden_annotated.json',
  BESTUURstd:    'https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0/styles/bestuurlijkegebieden_standaardvisualisatie?f=json',
  DKKstandaard:'styles/brk/dkk_standaardvissualisatie_nederlandsRDNewQuad.json',
  DKKkwaliteit: 'styles/brk/dkk_kwaliteitsvissualisatie_nederlandsRDNewQuad.json',
  BrtAchtergrondStandaard_annotated: 'styles/brt/brt_achtergrondkaart_standaard_annotated_nederlandsrdnewquad.json',
  BrtAchtergrondStandaard: 'styles/brt/brt_achtergrondkaart_standaard_nederlandsrdnewquad.json',
  BrtLuchtfoto_Annotation: 'styles/brt/brt_luchtfoto_annotated_nederlandsrdnewquad.json',
  BrtAchtergrondDarkmode_annotated: 'styles/brt/brt_achtergrondkaart_darkmode_annotated_nederlandsrdnewquad.json',

}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error' // Included with Angular CLI.import { Quad } from '../app/enumVisualisatie'


