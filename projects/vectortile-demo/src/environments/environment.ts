// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BRKTop10Standaardjsonurl: 'styles/brk/brk_top10nl.json',


  BGTmapboxachtergrondjsonurl: 'styles/bgt_achtergrondvisualisatie.json',
  BGTmapboxstandaardjsonurl: 'styles/bgt_standaardvisualisatie.json',
  BAGmapboxbagstd:
    'https://api.pdok.nl/lv/bag/ogc/v1_0/styles/bag_standaardvisualisatie?f=json',
  BAGmapboxbagCompleet:
    'https://api.pdok.nl/lv/bag/ogc/v1_0/styles/bag_standaardvisualisatie_compleet?f=json',

  BGTmapboxtactieljsonurl: 'styles/tactielevisualisatie.json',

  BESTUURWithLabels: 'styles/bestuurlijkegebieden_annotated.json',
  //BESTUURLabelsOnly: 'styles/bs_test.json',
  BESTUURstd:
    'https://api.pdok.nl/kadaster/bestuurlijkegebieden/ogc/v1_0/styles/bestuurlijkegebieden_standaardvisualisatie?f=json',

  OGCApi: "https://api.pdok.nl/lv/bgt/ogc/v1_0-demo"
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/plugins/zone-error' // Included with Angular CLI.
