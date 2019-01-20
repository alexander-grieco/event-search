
import {Validator, ValidatorFn, AbstractControl} from '@angular/forms';
import {Directive} from '@angular/core';
// import {ValidatorFn} from 


export function noSpacesValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };
  }


