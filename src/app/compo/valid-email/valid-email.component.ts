import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantService } from 'src/app/service/consultant.service';
import { PasswordValidatorService } from 'src/app/service/password-validator.service';
import { environment } from 'src/environments/environment';

const API_URL = environment.divUrl;

@Component({
  selector: 'app-valid-email',
  templateUrl: './valid-email.component.html',
  styleUrls: ['./valid-email.component.css']
})
export class ValidateEmailComponent implements OnInit {

  codeEmail = '';
  message = '';
  isLoading = true;
  isSuccess = false;
  validationType: 'inscription' | 'resetPassword' = 'inscription';
  
  // Pour resetPassword et validation
  consultant: Consultant = null;
  showPasswordForm = false;
  email = '';
  newPassword = '';
  confirmPassword = '';
  passwordErrors: string[] = [];
  isSubmittingPassword = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router,
    private passwordValidator: PasswordValidatorService,
    private consultantService: ConsultantService
  ) { }

  ngOnInit(): void {
    console.log('ValidateEmailComponent ngOnInit appelé!');
    
    // Déterminer le type de validation basé sur la route
    const url = this.router.url;
    console.log('URL actuelle:', url);
    
    if (url.includes('resetPassword')) {
      this.validationType = 'resetPassword';
      console.log('Type de validation: resetPassword');
    } else {
      this.validationType = 'inscription';
      console.log('Type de validation: INSCRIPTION');
    }

    this.codeEmail = this.route.snapshot.paramMap.get('code') ?? '';

    console.log('Code reçu:', this.codeEmail);

    if (!this.codeEmail) {
      this.message = 'Code de validation manquant.';
      this.isLoading = false;
      return;
    }

    this.validate();
  }

  validate() {
    const label = this.validationType === 'resetPassword' 
      ? 'resetPasswordValidation' 
      : 'emailInscriptionValidation';
    
    console.log(label + ': START - Début de la validation');
    console.log(label + ': code = ' + this.codeEmail);
    console.log(label + ': type = ' + this.validationType);
    
    this.isLoading = true;
    this.message = 'Validation en cours...';

    // Choisir l'endpoint en fonction du type de validation
    const endpoint = this.validationType === 'resetPassword'
      ? '/msg/resetPassword'
      : '/msg/validateEmail';

    const url = `${API_URL}${endpoint}/${this.codeEmail}`;
    console.log(label + ': URL API = ' + url);

    this.http.post(url, {}).subscribe({
      next: (resp) => {
        console.log(label + ': HTTP response reçue');
        console.log(label + ': response body = ', resp);
        
        const consultant = resp && resp["body"] && resp["body"].result ? resp["body"].result : null;
        
        console.log(label + ': consultant = ', consultant);
        
        if (consultant) {
          console.log(label + ': ✅ Validation RÉUSSIE - consultant trouvé');
          
          this.isLoading = false;
          this.isSuccess = true;
          this.consultant = consultant;
          
          if (this.validationType === 'resetPassword') {
            console.log(label + ': Email du consultant: ' + consultant.email);
            
            // Récupérer l'email du consultant
            this.email = consultant.email || '';
            console.log(label + ': Email affiché: ' + this.email);
            
            this.message = '✅ Code valide. Veuillez saisir votre nouveau mot de passe.';
            console.log(label + ': Affichage du formulaire de reset password');
            this.showPasswordForm = true;
          } else {
            this.message = '✅ Validation email réussie. Redirection en cours...';
            console.log(label + ': Redirection vers /login dans 4 secondes...');
            
            // Redirection après quelques secondes pour inscription
            setTimeout(
              () => {
                console.log(label + ': URL courant avant redirection: ' + this.router.url);
                
                if (this.router.url !== '/login') {
                  console.log(label + ': Navigation vers /login');
                  this.router.navigate(['/login']);
                } else {
                  console.log(label + ': Déjà sur /login, pas de redirection');
                }
              }
              , 4000);
          }
          
          console.log(label + ': Message affiché: ' + this.message);
        } else {
          console.log(label + ': ❌ Validation ÉCHOUÉE - consultant = null');
          
          this.isLoading = false;
          this.isSuccess = false;
          
          if (this.validationType === 'resetPassword') {
            this.message = '❌ La réinitialisation du mot de passe a échoué.';
          } else {
            this.message = '❌ La validation de l\'email a échoué.';
          }
          
          console.log(label + ': Message affiché: ' + this.message);
        }
      },
      error: (err) => {
        console.error(label + ': ❌ ERREUR HTTP');
        console.error(label + ': err.status = ' + err.status);
        console.error(label + ': err.statusText = ' + err.statusText);
        console.error(label + ': err.message = ' + err.message);
        console.error(label + ': Full error = ', err);
        
        this.isLoading = false;
        this.isSuccess = false;
        
        if (err.status === 404) {
          if (this.validationType === 'resetPassword') {
            this.message = '❌ Ce lien de réinitialisation est invalide ou expiré.';
            console.error(label + ': Erreur 404 - Lien invalide ou expiré');
          } else {
            this.message = '❌ Ce lien de validation est invalide ou expiré.';
            console.error(label + ': Erreur 404 - Lien invalide ou expiré');
          }
        }
        else { 
          this.message = '⚠️ Une erreur est survenue lors de la validation.';
          console.error(label + ': Erreur ' + err.status + ' - Erreur serveur');
        }
        
        console.error(label + ': Message affiché: ' + this.message);
      }
    });
  }

  /**
   * Valide le nouveau password pour resetPassword
   */
  validateNewPassword(): void {
    const result = this.passwordValidator.validate(this.newPassword);
    this.passwordErrors = result.errors;
  }

  /**
   * Soumet le nouveau password au backend
   */
  submitNewPassword(): void {
    const label = 'submitNewPassword';
    
    console.log(label + ': START - Soumission du nouveau password');
    console.log(label + ': consultant = ', this.consultant);
    console.log(label + ': code = ' + this.codeEmail);

    // Vérifier que le consultant est défini (récupéré lors de la validation)
    if (!this.consultant) {
      this.message = '❌ Consultant non trouvé. Veuillez réessayer le lien de réinitialisation.';
      console.error(label + ': Consultant manquant');
      return;
    }

    // Vérifier que les passwords matchent
    if (this.newPassword !== this.confirmPassword) {
      this.message = '❌ Les mots de passe ne correspondent pas.';
      console.error(label + ': Les passwords ne correspondent pas');
      return;
    }

    // Vérifier qu'il n'y a pas d'erreurs de validation
    if (this.passwordErrors && this.passwordErrors.length > 0) {
      this.message = '❌ Le mot de passe ne respecte pas les critères requis.';
      console.error(label + ': Erreurs de validation: ', this.passwordErrors);
      return;
    }

    this.isSubmittingPassword = true;
    this.message = 'Mise à jour en cours...';

    console.log(label + ': Mise à jour du consultant');
    console.log(label + ': ID: ' + this.consultant.id);

    // Mettre à jour le consultant avec le nouveau password et le code de reset
    this.consultant.password = this.newPassword;
    this.consultant.codeEmailToValidate = this.codeEmail;

    console.log(label + ': password défini');
    console.log(label + ': codeEmailToValidate = ' + this.consultant.codeEmailToValidate);
    console.log(label + ': Appel consultantService.savePost...');

    // Sauvegarder le consultant
    this.consultantService.savePost(this.consultant, true).subscribe({
      next: (saveResp) => {
        console.log(label + ': ✅ Password mis à jour avec succès');
        console.log(label + ': Response: ', saveResp);

        this.isSubmittingPassword = false;
        this.isSuccess = true;
        this.message = '✅ Mot de passe mis à jour avec succès! Redirection vers la connexion...';
        this.showPasswordForm = false;

        setTimeout(() => {
          console.log(label + ': Navigation vers /login');
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (saveErr) => {
        console.error(label + ': ❌ Erreur lors de la sauvegarde du consultant');
        console.error(label + ': err.status = ' + saveErr.status);
        console.error(label + ': Full error = ', saveErr);

        this.isSubmittingPassword = false;

        if (saveErr.status === 404) {
          this.message = '❌ Ce consultant n\'existe plus.';
        } else if (saveErr.status === 400) {
          this.message = '❌ Les données envoyées sont invalides.';
        } else {
          this.message = '⚠️ Une erreur est survenue lors de la mise à jour du mot de passe.';
        }

        console.error(label + ': Message affiché: ' + this.message);
      }
    });
  }
}
