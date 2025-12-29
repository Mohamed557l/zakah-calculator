import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeLabel',
})
export class TypeLabelPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
