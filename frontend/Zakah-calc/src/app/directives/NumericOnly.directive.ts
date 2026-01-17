import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[numericOnly]',
  standalone: true
})
export class NumericOnlyDirective {

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (['e', 'E', '+', '-'].includes(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.value !== '' && isNaN(Number(input.value))) {
      input.value = '';
    }

    if (Number(input.value) < 0) {
      input.value = '0';
    }
  }
}
