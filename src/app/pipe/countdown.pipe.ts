import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform {

  transform(value: number, ...args: any): any {
    args[0] = 'mm:ss';
    const isMMSS = args[0] === 'mm:ss';
    if (!value) {
      return isMMSS ? '00:00' : '00:00:00';
    }

    const h = padLeft(Math.floor(value / 3600), 2);
    const m = padLeft(Math.floor(value % 3600 / 60), 2);
    const s = padLeft(Math.floor(value % 60), 2);


    return isMMSS ? `${m}:${s}` : `${h}:${m}:${s}`;
  }

}

function padLeft(str, len): string {
  const s = `${str}`;

  return s.length >= len ? s : padLeft(`0${s}`, len);
}
