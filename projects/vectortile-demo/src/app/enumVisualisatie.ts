import { environment } from '../environments/environment';

export enum Visualisatie {
  BGTachtergrond = 'BGT Achtergrond',
  BGTstandaard = 'BGT Standaard',
  Bagstd = 'BAG standaard',
  BagCompleet = 'BAG compleet',
  Bagblanko = 'BAG (Blanco)',
  Bagkleurrijk = 'BAG (Kleurrijk)',
  BagKleurrijk_tegels = 'BAG (Kleurrijk tegels zichtbaar)',

  BGTzerodefaultA_blanco = 'BGT (Blanco)',
  BGTzerodefaultB_tegels = 'BGT (Kleurrijk tegels zichtbaar)',
  BGTzerodefaultC_Bron = 'BGT Bronhouder',
  BGTzerodefaultD_kleur = 'BGT (Kleurrijk)',
  BGTtactiel = 'BGT Tactiele demo (Braille)',
}

export type StyleUrl = {
  source: 'bag' | 'bgt';
  url: string | undefined;
};

export function getStyleUrl(vis: Visualisatie): StyleUrl {
  switch (vis) {
    case Visualisatie.BGTachtergrond:
      return { source: 'bgt', url: environment.BGTmapboxachtergrondjsonurl };

    case Visualisatie.BGTstandaard:
      return { source: 'bgt', url: environment.BGTmapboxstandaardjsonurl };
    case Visualisatie.BGTtactiel:
      return { source: 'bgt', url: environment.BGTmapboxtactieljsonurl };
    case Visualisatie.Bagstd:
      return { source: 'bag', url: environment.BAGmapboxbagstd };
    case Visualisatie.BagCompleet:
      return { source: 'bag', url: environment.BAGmapboxbagCompleet };
    case Visualisatie.BGTzerodefaultA_blanco:
    case Visualisatie.BGTzerodefaultC_Bron:
    case Visualisatie.BGTzerodefaultD_kleur:
    case Visualisatie.BGTzerodefaultB_tegels:
      return { source: 'bgt', url: undefined };
    case Visualisatie.Bagblanko:
    case Visualisatie.Bagkleurrijk:
    case Visualisatie.BagKleurrijk_tegels:
      return { source: 'bag', url: undefined };

    default:
      return exhaustiveGuard(vis);
  }
}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function exhaustiveGuard(_value: never): never {
  throw new Error(
    `ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(
      _value
    )}`
  );
}

export class FeatureToggle {
  public static BestuurPreview = true;
}

export function getAllVisualisaties(): Visualisatie[] {
  const array: Visualisatie[] = [];
  for (const value of enumKeys(Visualisatie)) {
    array.push(Visualisatie[value]);
  }
  return array;
}

export function getRandomEnumValue<T extends object>(anEnum: T): T[keyof T] {
  //save enums inside array
  const enumValues = Object.keys(anEnum) as Array<keyof T>;

  //Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // get the random enum value

  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
  // if you want to have the key than return randomEnumKey
}
