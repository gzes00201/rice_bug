import { Injectable } from '@angular/core';
import { ICookieService } from '../model/ICookieService';

@Injectable({
  providedIn: 'root'
})
export class CookieService implements ICookieService {
  constructor() {}

  set(key: string, value: string, expires?: Date): void {
    let cookieValue = `${key}=${value}`;

    if (expires) {
      cookieValue += `;expire=${expires.toUTCString()}`;
    }
    document.cookie = cookieValue;
  }

  get(key: string): string {
    const decodedCookie: string = decodeURIComponent(document.cookie);
    const pairs: string[] = decodedCookie.split(/;\s*/);

    const prefix = `${key}=`;
    for (const pair of pairs) {
      if (pair.indexOf(prefix) === 0) {
        return pair.substring(prefix.length);
      }
    }
    return '';
  }

  delete(key: string) {
    document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
