/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IInputGroup } from 'app/interface/component.default.interface';
import { FormField } from 'app/interface/form_field.interface';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormfieldControlService {

  constructor() { }

  toFormGroup(inputGroup: IInputGroup[], ordenar: boolean = false): FormGroup {
    const group: any = {};

    inputGroup.forEach(element => {
      if(ordenar){
        element.inputs.sort((a, b) => a.order - b.order); // ordena a exibição
      }
      element.inputs.forEach(input =>{
        let validator: ValidatorFn[] = input.required ? [Validators.required] : [];

        if (input.isSearchable) {
          group[input.searchKey] = new FormControl('');
        }

        switch (input.validator) {
          case "email":
            validator.push(Validators.email);
            break;
          default:
            break;
        }
        if (input.isDateType && input.set_data_atual) {
          const dt_data = new DatePipe('en-US').transform(input.value, 'ddMMyyyy')
          input.value = dt_data;
        }
        if (input.isTimeDate && input.set_data_atual) {
          const dt_data = new DatePipe('en-US').transform(input.value, 'dd/MM/yyyy HH:mm')
          input.value = dt_data;
        }
        if(input.isSetValue){
          input.value = input.set_value;
        }
        if(input.controlType == "textarea"){
          if(input.value){
            input.value = input.value.replace(/<br \/>/g, "").trimStart();
          }
        }
        if(input.isTimeDate && input.value){
          const dt_data = new DatePipe('en-US').transform(input.value, 'dd/MM/yyyy HH:mm')
          input.value = dt_data;
        }
        group[input.key] = validator.length > 0 ? new FormControl({value: input.value || '',disabled: input.disabled}, validator)
          : new FormControl({value: input.value || '',disabled: input.disabled});
      })

    });

    return new FormGroup(group);
  }

  getFormFields(inputs: FormField<string>[]) {

    // const inputs: FormField<string>[] = [

    //   new FormField<string>({
    //     controlType: "textbox",
    //     key: 'name',
    //     label: 'Name',
    //     required: true,
    //     order: 1
    //   }),

    //   new FormField<string>({
    //     controlType: "textbox",
    //     key: 'email',
    //     label: 'Email',
    //     type: 'email',
    //     required: true,
    //     validator: "email",
    //     order: 2
    //   }),

    //   new FormField<string>({
    //     controlType: "dropdown",
    //     key: 'country',
    //     label: 'Country',
    //     options: [
    //       { key: 1, value: 'United States of America' },
    //       { key: 2, value: 'Brazil' },
    //       { key: 3, value: 'Other' }
    //     ],
    //     order: 3
    //   }),

    //   new FormField<string>({
    //     controlType: "checkbox",
    //     key: 'agree',
    //     label: 'I accept terms and services',
    //     type: 'checkbox',
    //     required: true,
    //     order: 4
    //   }),

    //   new FormField<string>({
    //     controlType: "radio",
    //     key: 'sex',
    //     label: 'Sex',
    //     type: 'radio',
    //     options: [
    //       { key: 1, value: 'Male' },
    //       { key: 2, value: 'Female' }
    //     ],
    //     order: 5
    //   }),

    //   new FormField<string>({
    //     controlType: "textarea",
    //     key: 'message',
    //     label: 'Mesage',
    //     type: 'textarea',
    //     order: 6
    //   })
    // ];

    return of(inputs.sort((a, b) => a.order - b.order));
  }

}
