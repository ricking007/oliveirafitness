/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  setData(key: string, value: any): Boolean {
    this.storage.setItem(key, JSON.stringify(value));
    return true;
  }

  getData(key: string): any {
    if (this.storage) {
      const item = this.storage.getItem(key);
      return item !== null ? JSON.parse(item) : null;
    }
    return null;
  }

  remove(key: string): boolean {
    if (this.storage) {
      this.storage.removeItem(key);
      return true;
    }
    return false;
  }

  clear(): boolean {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

}
