import { environment } from '../environments/environment'
import { demoSettings } from './app.component'

export enum Visualisatie {
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

export type StyleUrl = {
  source: 'bag' | 'bgt' | 'bestuurlijkegebieden' | 'top10nl'
  url: string | undefined
}

export function getStyleUrl(vis: Visualisatie): StyleUrl {
  switch (vis) {
    case Visualisatie.BGTachtergrond:
      return { source: 'bgt', url: environment.BGTmapboxachtergrondjsonurl }
    case Visualisatie.Top10nlStandaard:
      return { source: 'top10nl', url: environment.BRTTop10Standaardjsonurl }
    case Visualisatie.BGTstandaard:
      return { source: 'bgt', url: environment.BGTmapboxstandaardjsonurl }
    //case Visualisatie.BGTtactiel:
    //   return { source: 'bgt', url: environment.BGTmapboxtactieljsonurl }
    case Visualisatie.Bagstd:
      return { source: 'bag', url: environment.BAGmapboxbagstd }
    case Visualisatie.BagCompleet:
      return { source: 'bag', url: environment.BAGmapboxbagCompleet }
    case Visualisatie.BESTUURstd:
      return { source: 'bestuurlijkegebieden', url: environment.BESTUURstd }
    case Visualisatie.BESTUURWithLabels:
      return {
        source: 'bestuurlijkegebieden',
        url: environment.BESTUURWithLabels,
      }
    //case Visualisatie.BESTUURLabelOnly:
    //  return {
    //    source: 'bestuurlijkegebieden',
    //   url: environment.BESTUURLabelsOnly,
    //  };
    case Visualisatie.Top10nlKleurrijk:
    case Visualisatie.Top10nlBlanco:
    case Visualisatie.Top10nlTegels:
      return { source: 'top10nl', url: undefined }
    case Visualisatie.BGTzerodefaultA_blanco:
    case Visualisatie.BGTzerodefaultC_Bron:
    case Visualisatie.BGTzerodefaultD_kleur:
    case Visualisatie.BGTzerodefaultB_tegels:
      return { source: 'bgt', url: undefined }
    case Visualisatie.Bagblanko:
    case Visualisatie.Bagkleurrijk:
    case Visualisatie.BagKleurrijk_tegels:
      return { source: 'bag', url: undefined }
    case Visualisatie.BESTUURBlanko:
      return { source: 'bestuurlijkegebieden', url: undefined }

    default:
      return exhaustiveGuard(vis)
  }
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

export function getAllVisualisaties(): Visualisatie[] {
  const array: Visualisatie[] = []
  if (demoSettings.previewFeature)
    for (const value of enumKeys(Visualisatie)) {
      array.push(Visualisatie[value])
    }
  else
    for (const value of enumKeys(Visualisatie)) {
      if (
        [
          'Top10nlBlanco',
          'Top10nlKleurrijk',
          'Top10nlStandaard',
          'Top10nlTegels'
        ].includes(value)
      ) {
        //skip
      } else {
        array.push(Visualisatie[value])
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
