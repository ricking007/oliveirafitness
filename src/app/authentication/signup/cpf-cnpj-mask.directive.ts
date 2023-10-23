import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfCnpjMask]'
})
export class CpfCnpjMaskDirective {
  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      // Aplicar a máscara de CPF
      input.value = this.applyCpfMask(value);
    } else {
      // Aplicar a máscara de CNPJ
      input.value = this.applyCnpjMask(value);
    }

    // Atualizar o valor no controle do formulário
    this.control.control?.setValue(input.value);
  }

  applyCpfMask(value: string): string {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  applyCnpjMask(value: string): string {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
