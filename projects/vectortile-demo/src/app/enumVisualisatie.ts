export enum Visualisatie {

  Bagstd = "BAG Visualisatie",
  Bagblanko = "BAG (Blanco) visualisatie",
  Bagkleurrijk = "BAG (Kleurrijk) visualisatie",
  BagKleurrijk_tegels = "BAG (Kleurrijk tegels zichtbaar) Visualisatie",
  BGTachtergrond = "BGT Vectortile Achtergrond Visualisatie",
  BGTstandaard = "BGT Vectortile Standaard Visualisatie",

  BGTzerodefaultA_blanco = "BGT Vectortile (Blanco) Visualisatie",
  //BGTzerodefaultB_tegels = "BGT Vectortile (Kleurrijk tegels zichtbaar) Visualisatie",
  BGTzerodefaultC_Bron = "BGT Vectortile Bronhouder Visualisatie",
  BGTzerodefaultD_kleur = "BGT Vectortile (Kleurrijk) Visualisatie",
  BGTtactiel = "BGT Vectortile Tactiele (Braille) Visualisatie"
}

export type StyleUrl =
  {
    source: "bag" | "bgt" 
    url: string | undefined

  }

export function getStyleUrl(vis: Visualisatie): StyleUrl {
  const BGTmapboxachtergrondjsonurl = 'https://api.pdok.nl/lv/bgt/ogc/v1_0/styles/bgt_achtergrondvisualisatie?f=mapbox';

  const BGTmapboxstandaardjsonurl = 'https://api.pdok.nl/lv/bgt/ogc/v1_0/styles/bgt_standaardvisualisatie?f=mapbox'
  const BGTmapboxtactieljsonurl = 'styles/tactielevisualisatie.json'

  const BAGmapboxbagstd = "styles/bagstd.json"

  //for custom styling local styles are available:  
  //const mapboxachtergrondjsonurl = 'styles/achtergrondvisualisatie.json';
  //const mapboxstandaardjsonurl = 'styles/standaardvisualisatie.json'


  switch (vis) {
    case Visualisatie.BGTachtergrond:
      return ({ source: "bgt", url: BGTmapboxachtergrondjsonurl });

    case Visualisatie.BGTstandaard:
      return ({ source: "bgt", url: BGTmapboxstandaardjsonurl })
    case Visualisatie.BGTtactiel:
      return ({ source: "bgt", url: BGTmapboxtactieljsonurl })
    case Visualisatie.Bagstd:
      return ({ source: "bag", url: BAGmapboxbagstd })
    case Visualisatie.BGTzerodefaultA_blanco:
    case Visualisatie.BGTzerodefaultC_Bron:
    case Visualisatie.BGTzerodefaultD_kleur:
      return ({ source: "bgt", url: undefined });
    case Visualisatie.Bagblanko:
    case Visualisatie.Bagkleurrijk:
    case Visualisatie.BagKleurrijk_tegels:
      return ({ source: "bag", url: undefined });

    default:

      return exhaustiveGuard(vis);

  }

}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export function exhaustiveGuard(_value: never): never {
  throw new Error(`ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}

export class FeatureToggle {

  public static BAGPreview = false;


}



export function getAllVisualisaties(): Visualisatie[] {

  const array: Visualisatie[] = [];
  for (const value of enumKeys(Visualisatie)) {
    if (FeatureToggle.BAGPreview) {
      array.push(Visualisatie[value]);
    } else {
      if (value.includes("BGT")) {
        array.push(Visualisatie[value]);

      }

    }

  }

  return array
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
