import { environment } from '../environments/environment'
import { demoSettings } from './app.component'
import { LocalStorageService } from './local-storage-service'

export enum Visualisatie {
  Custom1Blanko = 'Aanpasbare Vectortile URL (Blanco)',
  Custom1Kleurrijk = 'Aanpasbare Vectortile URL (kleurrijk)',
  Custom1Tegels = 'Aanpasbare Vectortile URL (Kleurrijk tegels zichtbaar)',
  BRTAchtergrondStandaard_Annotated = 'BRT Achtergrond standaard Annotated',
  BRTAchtergrondStandaard = 'BRT Achtergrond standaard (zonder labels)',
  BRTLuchtfoto_Annotation = "BRT Luchtfoto Annotatie",
  BRTStandaardDarkmode_Annotation = "BRT Darkmode Annotatie",
  BRTAchtergrondStandaard_blanco = 'BRT Achtergrond (Blanco)',
  BRTAchtergrondStandaard_kleurrijk = 'BRT Achtergrond (Kleurrijk)',
  BRTAchtergrondStandaard_tegels = 'BRT Achtergrond (Kleurrijk tegels zichtbaar)',
  DKKStandaard = 'Kadastrale kaart Standaard visualisatie',
  DKKKwaliteit = 'Kadastrale kaart Kwaliteits visualisatie',
  BGTachtergrond = 'BGT Achtergrond',

  BGTstandaard = 'BGT Standaard',
  Bagstd = 'BAG standaard',
  BagCompleet = 'BAG compleet',
  Bagblanko = 'BAG (Blanco)',
  Bagkleurrijk = 'BAG (Kleurrijk)',
  BagKleurrijk_tegels = 'BAG (Kleurrijk tegels zichtbaar)',
  Top10nlStandaard = 'TOP10NL',
  Top10nlBlanco = 'TOP10NL Blanco',
  Top10nlTegels = 'TOP10NL (tegels zichtbaar)',
  Top10nlKleurrijk = 'TOP10NL Kleurrijk',
  BGTzerodefaultA_blanco = 'BGT (Blanco)',
  BGTzerodefaultB_tegels = 'BGT (Kleurrijk tegels zichtbaar)',
  BGTzerodefaultC_Bron = 'BGT Bronhouder',
  BGTzerodefaultD_kleur = 'BGT (Kleurrijk)',
  //BGTtactiel = 'BGT Tactiele demo (Braille)',
  BESTUURstd = 'Bestuurlijke gebieden',
  BESTUURWithLabels = 'Bestuurlijke gebieden met annotatie',
  //BESTUURLabelOnly = 'Bestuurlijke gebieden alleen labels',
  BESTUURBlanko = 'Bestuurlijke gebieden (Blanco)',




}
export type Quad = 'netherlandsrdnewquad' | 'europeanetrs89_laeaquad' | 'webmercatorquad'
type SourceType = 'bag' | 'bgt' | 'dkk' | 'bestuurlijkegebieden' | 'top10nl' | 'custom' | 'brt'

export type StyleUrl = {
  source: SourceType
  styleUrl: string | undefined

}

export function getStyleUrl(vis: Visualisatie, quad: Quad): StyleUrl {
  const styleMap: { [key in Visualisatie]: { source: SourceType; styleUrl?: string } } = {
    [Visualisatie.BRTAchtergrondStandaard]: { source: 'brt', styleUrl: environment.BrtAchtergrondStandaard },
    [Visualisatie.BRTAchtergrondStandaard_Annotated]: { source: 'brt', styleUrl: environment.BrtAchtergrondStandaard_annotated },
    [Visualisatie.BRTLuchtfoto_Annotation]: { source: 'brt', styleUrl: environment.BrtLuchtfoto_Annotation },
    [Visualisatie.BRTStandaardDarkmode_Annotation]: { source: 'brt', styleUrl: environment.BrtAchtergrondDarkmode_annotated },
    [Visualisatie.BRTAchtergrondStandaard_blanco]: { source: 'brt', styleUrl: undefined },
    [Visualisatie.BRTAchtergrondStandaard_kleurrijk]: { source: 'brt', styleUrl: undefined },
    [Visualisatie.BRTAchtergrondStandaard_tegels]: { source: 'brt', styleUrl: undefined},
    [Visualisatie.DKKStandaard]: { source: 'dkk', styleUrl: environment.DKKstandaard },
    [Visualisatie.DKKKwaliteit]: { source: 'dkk', styleUrl: environment.DKKkwaliteit },
    [Visualisatie.BGTachtergrond]: { source: 'bgt', styleUrl: environment.BGTmapboxachtergrondjsonurl },
    [Visualisatie.Top10nlStandaard]: { source: 'top10nl', styleUrl: environment.BRTTop10Standaardjsonurl[quad].href },
    [Visualisatie.BGTstandaard]: { source: 'bgt', styleUrl: environment.BGTmapboxstandaardjsonurl },
    [Visualisatie.Bagstd]: { source: 'bag', styleUrl: environment.BAGmapboxbagstd[quad].href },
    [Visualisatie.BagCompleet]: { source: 'bag', styleUrl: environment.BAGmapboxbagCompleet[quad].href },
    [Visualisatie.BESTUURstd]: { source: 'bestuurlijkegebieden', styleUrl: environment.BESTUURstd },
    [Visualisatie.BESTUURWithLabels]: { source: 'bestuurlijkegebieden', styleUrl: environment.BESTUURWithLabels },
    [Visualisatie.Top10nlKleurrijk]: { source: 'top10nl', styleUrl: undefined },
    [Visualisatie.Top10nlBlanco]: { source: 'top10nl', styleUrl: undefined },
    [Visualisatie.Top10nlTegels]: { source: 'top10nl', styleUrl: undefined },
    [Visualisatie.BGTzerodefaultA_blanco]: { source: 'bgt', styleUrl: undefined },
    [Visualisatie.BGTzerodefaultC_Bron]: { source: 'bgt', styleUrl: undefined },
    [Visualisatie.BGTzerodefaultD_kleur]: { source: 'bgt', styleUrl: undefined },
    [Visualisatie.BGTzerodefaultB_tegels]: { source: 'bgt', styleUrl: undefined },
    [Visualisatie.Bagblanko]: { source: 'bag', styleUrl: undefined },
    [Visualisatie.Bagkleurrijk]: { source: 'bag', styleUrl: undefined },
    [Visualisatie.BagKleurrijk_tegels]: { source: 'bag', styleUrl: undefined },
    [Visualisatie.BESTUURBlanko]: { source: 'bestuurlijkegebieden', styleUrl: undefined },
    [Visualisatie.Custom1Blanko]: { source: 'custom', styleUrl: undefined },
    [Visualisatie.Custom1Kleurrijk]: { source: 'custom', styleUrl: undefined },
    [Visualisatie.Custom1Tegels]: { source: 'custom', styleUrl: undefined },

  }

  const result = styleMap[vis] as StyleUrl

  return result
}


function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[]
}

export function exhaustiveGuard(_value: never): never {
  throw new Error(
    `ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(
      _value
    )}`
  )
}

export function getAllVisualisaties(): { title: string, visualisatie: Visualisatie }[] {
  const array: { title: string, visualisatie: Visualisatie }[] = []
  const localStorageService = new LocalStorageService()

  for (const value of enumKeys(Visualisatie)) {

    if (value === 'Custom1Blanko' || value === 'Custom1Kleurrijk' || value === 'Custom1Tegels') {


      if (localStorageService.Exists('customUrl')) {
        array.push({ title: Visualisatie[value], visualisatie: Visualisatie[value] })
      }

    }

    else {

    
        array.push({ title: Visualisatie[value], visualisatie: Visualisatie[value] })
      
    }
  }
  return array
}

export function getRandomEnumValue<T extends object>(anEnum: T): T[keyof T] {
  //save enums inside array
  const enumValues = Object.keys(anEnum) as Array<keyof T>

  //Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  // get the random enum value

  const randomEnumKey = enumValues[randomIndex]
  return anEnum[randomEnumKey]
  // if you want to have the key than return randomEnumKey
}
