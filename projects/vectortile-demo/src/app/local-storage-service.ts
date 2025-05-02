import { Injectable } from '@angular/core'

export type storageKey = "customUrl" | "customUrlExtension" | "customUrlMinZoom" | "customUrlxyzTemplate" | "showDebugLayer"| "showLuchtFotoLayer"  |"customTileMatrixPart"
export type storageItem = {
  key: storageKey,
  value: string | boolean
}


@Injectable({
  providedIn: 'root'
})



export class LocalStorageService {

  constructor() { }

  public set(item: storageItem): void {
     if (typeof (item.value) === 'boolean') {
      if (item.value)
        item.value = "true"
      else {
        item.value = "fales"
      }
    }
    localStorage.setItem(item.key, JSON.stringify(item))
  }

  public getBoolean(key: storageKey): boolean {
    const store = localStorage.getItem(key)
    if (!store) {
      return false
    }

    try {

      const parsed = JSON.parse(store) as unknown as storageItem
      if (parsed.value === 'true')
        return true
      else
        return false

    } catch (error) {
      console.error('Error parsing JSON:', store, error)
      return false
    }
  }

  public get(key: storageKey): string {
    const store = localStorage.getItem(key)
    if (!store) {
      return ''
    }

    try {
      const parsed = JSON.parse(store)
      return parsed.value
    } catch (error) {
      console.error('Error parsing JSON:', store, error)
      return ''
    }
  }



  public Exists(key: storageKey): boolean {
    return localStorage.getItem(key) != null
  }

  public remove(key: storageKey): void {
    localStorage.removeItem(key)
  }

  public removeAll() {
    (['customUrl', 'customUrlExtension', 'customUrlMinZoom', 'customUrlxyzTemplate', 'showDebugLayer', 'showLuchtFotoLayer', 'customTileMatrixPart'] as storageKey[]).forEach(key => this.remove(key))
  }
}
