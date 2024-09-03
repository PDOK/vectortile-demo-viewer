import { Injectable } from '@angular/core'

export type storageKey = "customUrl"| "customUrlExtension"| "customUrlMinZoom"
export type storageItem = {
  key: storageKey,
  value: string
}


@Injectable({
  providedIn: 'root'
})



export class LocalStorageService {

  constructor() { }

  public set(item: storageItem): void {
    localStorage.setItem(item.key, item.value)
  }

  public get(key: storageKey): string | null {
    return localStorage.getItem(key)
  }
  public Exists(key: storageKey): boolean {
    return localStorage.getItem(key) != null
  }

  public remove(key: storageKey): void {
    localStorage.removeItem(key)
  }
}
