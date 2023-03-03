import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function repeatPasswordValidator(
  password: AbstractControl,
  twinPassword: AbstractControl
): ValidatorFn {
  return (): ValidationErrors | null => {
    if (!password || !twinPassword) return null;
    if (password.value !== twinPassword.value) {
      password.setErrors({ matching: true });
      twinPassword.setErrors({ matching: true });
    } else if (!password.value || !twinPassword.value) {
      password.setErrors({ required: true });
      twinPassword.setErrors({ required: true });
    } else {
      password.setErrors(null);
      twinPassword.setErrors(null);
    }
    return null;
  };
}
