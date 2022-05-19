export enum Visualisatie {

  achtergrond = "BGT Vectortile Achtergrond Visualisatie",
  standaard = "BGT Vectortile Standaard Visualisatie",
  zerodefaultA = "Vectortile (Blanco) Visualisatie",
  zerodefaultB = "Vectortile (Kleurrijk tegels zichtbaar) Visualisatie",
  zerodefaultC_Bron = "Vectortile BGT Bronhouder Visualisatie",
  zerodefaultD = "Vectortile (Kleurrijk) Visualisatie",
  tactiel = "Vectortile Tactiele Visualisatie"
}



export function getJsonurl(vis: Visualisatie) {
  const mapboxachtergrondjsonurl = 'https://api.pdok.nl/lv/bgt/ogc/v1_1-preprod/styles/achtergrondvisualisatie?f=mapbox';
  const mapboxstandaardjsonurl = 'https://api.pdok.nl/lv/bgt/ogc/v1_1-preprod/styles/standaardvisualisatie?f=mapbox'
  const mapboxtactieljsonurl = 'styles/tactielevisualisatie.json'
  switch (vis) {
    case Visualisatie.achtergrond:
      return (mapboxachtergrondjsonurl);

    case Visualisatie.standaard:
      return (mapboxstandaardjsonurl)
    case Visualisatie.tactiel:
      return (mapboxtactieljsonurl)

    default:
      return ''

  }

}

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
}

export function getAllVisualisaties(): Visualisatie[] {
  var array: Visualisatie[] = [];
  for (const value of enumKeys(Visualisatie)) {
    array.push(Visualisatie[value]);
  }
  return array
}

export function getRandomEnumValue<T>(anEnum: T): T[keyof T] {
  //save enums inside array
  const enumValues = Object.keys(anEnum) as Array<keyof T>;

  //Generate a random index (max is array length)
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  // get the random enum value

  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
  // if you want to have the key than return randomEnumKey
}
