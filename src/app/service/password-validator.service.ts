import { Injectable } from '@angular/core';

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  constructor() { }

  /**
   * Valide un password selon les critères:
   * - Au moins 8 caractères
   * - Au moins 1 majuscule
   * - Au moins 1 caractère ponctuel
   */
  validate(password: string): PasswordValidationResult {
    const errors: string[] = [];

    if (!password) {
      return { isValid: true, errors: [] };
    }

    // Au moins 8 caractères
    if (password.length < 8) {
      errors.push('Au moins 8 caractères requis');
    }

    // Au moins 1 majuscule
    if (!/[A-Z]/.test(password)) {
      errors.push('Au moins 1 majuscule requise');
    }

    // Au moins 1 caractère ponctuel
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Au moins 1 caractère ponctuel requis (! @ # $ % ^ & * etc.)');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}
