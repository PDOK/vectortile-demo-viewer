import { Quad } from '../app/enumVisualisatie'

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//const quads = [ 'netherlandsrdnewquad', 'europeanetrs89_laeaquad' , 'webmercatorquad' ]
export const urlQuad = (base: string, constantPath: string, constantQuery: string): {
  [key in Quad]: URL
} => {
  const urls: {
    [key in Quad]: URL
  } = {
    netherlandsrdnewquad: new URL(`${base}/styles${constantPath}netherlandsrdnewquad?${constantQuery}`),
    europeanetrs89_laeaquad: new URL(`${base}/styles${constantPath}europeanetrs89_laeaquad?${constantQuery}`),
    webmercatorquad: new URL(`${base}/styles${constantPath}webmercatorquad?${constantQuery}`)
  }
  return urls
}
