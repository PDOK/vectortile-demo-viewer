// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { urlQuad } from './urlQuad'
import { Quad } from "../app/enumVisualisatie"










export const environment = {
  production: true,

  BRTTop10Standaardjsonurl: urlQuad( 'https://api.pdok.nl/brt/top10nl/ogc/v1', '/brt_top10nl__', 'f=mapbox'),
  BrkWKPBStandaardjsonurl: 'styles/brk/wkpb/wkpb_standaardvisualisatie_nederlandsRDNewQuad.json',
  BGTmapboxachtergrondjsonurl: 'styles/bgt_achtergrondvisualisatie.json',
  BGTmapboxstandaardjsonurl: 'styles/bgt_standaardvisualisatie.json',
  BAGmapboxbagstd:    urlQuad('https://api.pdok.nl/kadaster/bag/ogc/v2', '/bag_standaardvisualisatie__', 'f=json'),
  BAGmapboxbagCompleet:  urlQuad( 'https://api.pdok.nl/kadaster/bag/ogc/v2', '/bag_standaardvisualisatie_compleet__', 'f=json'),
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
