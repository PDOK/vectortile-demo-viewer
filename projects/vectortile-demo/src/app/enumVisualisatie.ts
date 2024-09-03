import { environment } from '../environments/environment'
import { LocalStorageService } from './local-storage-service'

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
  Custom1Blanko = 'Aanpasbare Vectortile URL'
}

export type StyleUrl = {
  source: 'bag' | 'bgt' | 'bestuurlijkegebieden' | 'top10nl' | 'custom'
  styleUrl: string | undefined
}

export function getStyleUrl(vis: Visualisatie): StyleUrl {
  switch (vis) {
    case Visualisatie.BGTachtergrond:
      return { source: 'bgt', styleUrl: environment.BGTmapboxachtergrondjsonurl }
    case Visualisatie.Top10nlStandaard:
      return { source: 'top10nl', styleUrl: environment.BRTTop10Standaardjsonurl }
    case Visualisatie.BGTstandaard:
      return { source: 'bgt', styleUrl: environment.BGTmapboxstandaardjsonurl }
    //case Visualisatie.BGTtactiel:
    //   return { source: 'bgt', url: environment.BGTmapboxtactieljsonurl }
    case Visualisatie.Bagstd:
      return { source: 'bag', styleUrl: environment.BAGmapboxbagstd }
    case Visualisatie.BagCompleet:
      return { source: 'bag', styleUrl: environment.BAGmapboxbagCompleet }
    case Visualisatie.BESTUURstd:
      return { source: 'bestuurlijkegebieden', styleUrl: environment.BESTUURstd }
    case Visualisatie.BESTUURWithLabels:
      return {
        source: 'bestuurlijkegebieden',
        styleUrl: environment.BESTUURWithLabels,
      }
    //case Visualisatie.BESTUURLabelOnly:
    //  return {
    //    source: 'bestuurlijkegebieden',
    //   url: environment.BESTUURLabelsOnly,
    //  };
    case Visualisatie.Top10nlKleurrijk:
    case Visualisatie.Top10nlBlanco:
    case Visualisatie.Top10nlTegels:
      return { source: 'top10nl', styleUrl: undefined }
    case Visualisatie.BGTzerodefaultA_blanco:
    case Visualisatie.BGTzerodefaultC_Bron:
    case Visualisatie.BGTzerodefaultD_kleur:
    case Visualisatie.BGTzerodefaultB_tegels:
      return { source: 'bgt', styleUrl: undefined }
    case Visualisatie.Bagblanko:
    case Visualisatie.Bagkleurrijk:
    case Visualisatie.BagKleurrijk_tegels:
      return { source: 'bag', styleUrl: undefined }
    case Visualisatie.BESTUURBlanko:
      return { source: 'bestuurlijkegebieden', styleUrl: undefined }
    case Visualisatie.Custom1Blanko:
      return { source: 'custom', styleUrl: undefined }


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

export function getAllVisualisaties(): { title: string, visualisatie: Visualisatie }[] {
  const array: { title: string, visualisatie: Visualisatie }[] = []
  const localStorageService = new LocalStorageService()

  for (const value of enumKeys(Visualisatie)) {

    if (value == 'Custom1Blanko') {
      if (localStorageService.Exists('customUrl')) {
        const url = localStorageService.get('customUrl')
        if (url) {
          array.push({ title: url, visualisatie: Visualisatie[value] })
        }
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
