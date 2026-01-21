import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { SignupDialogComponent } from 'src/app/compo/_dialogs/signup-dialog/signup-dialog.component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Credentials } from '../../credentials';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: Credentials = new Credentials('', '');
  info = "";
  error = "";
  showPassword = false;
  showForgotPasswordForm = false;
  forgotPasswordEmail = "";
  isLoadingResetEmail = false;

  constructor(private dataSharingService: DataSharingService, private router: Router, private dialog: MatDialog) {
  }

  ngOnInit() {

    let lastUserName = this.dataSharingService.getLastUserName()
    console.log("login ngOnInit deb lastUserName : ", lastUserName)
    if (this.dataSharingService.isLoggedIn()) {
      this.dataSharingService.gotoMyProfile()
      //  this.authService.gotoLogin()
    }
    if (!this.credentials.username) this.credentials.username = lastUserName;
    console.log("login ngOnInit fin : credentials : ", this.credentials)

    // this.isLoading = false;  
  }

  /**
   * LOGIN function 
   */
  public login(): void {
    this.dataSharingService.login(this.credentials, this);
  }

  goToSignup() {
    this.dataSharingService.IsAddEsnAndResp = true
    // this.dataSharingService.navigateTo("inscription");
    this.router.navigate(["inscription"]);
  }

  /**
   * Toggle le formulaire "Mot de passe oublié"
   */
  toggleForgotPasswordForm(): void {
    this.showForgotPasswordForm = !this.showForgotPasswordForm;
    if (this.showForgotPasswordForm) {
      // Pré-remplir avec l'email du login s'il existe
      if (!this.forgotPasswordEmail && this.credentials.username) {
        this.forgotPasswordEmail = this.credentials.username;
      }
    }
    this.error = '';
    this.info = '';
  }

  /**
   * Envoie un email de reset du password
   */
  resetPassword(): void {
    const label = 'resetPassword';
    
    if (!this.forgotPasswordEmail) {
      this.error = 'Email requis';
      console.error(label + ': Email manquant');
      return;
    }

    console.log(label + ': START - Email: ' + this.forgotPasswordEmail);
    this.isLoadingResetEmail = true;
    this.error = '';
    this.info = '';

    this.dataSharingService.sendResetPasswordEmail(this.forgotPasswordEmail, {
      next: (response) => {
        console.log(label + ': ✅ Email de reset envoyé avec succès');
        this.isLoadingResetEmail = false;
        this.info = '✅ Un lien de réinitialisation a été envoyé à ' + this.forgotPasswordEmail;
        this.forgotPasswordEmail = '';
        
        // Fermer le formulaire après 3 secondes
        setTimeout(() => {
          this.showForgotPasswordForm = false;
          this.info = '';
        }, 3000);
      },
      error: (error) => {
        console.error(label + ': ❌ Erreur lors de l\'envoi du mail');
        console.error(label + ': Error: ', error);
        this.isLoadingResetEmail = false;
        
        if (error.status === 404) {
          this.error = '❌ Aucun utilisateur trouvé avec cet email.';
        } else {
          this.error = '⚠️ Erreur lors de l\'envoi du mail. Veuillez réessayer.';
        }
      }
    });
  }

  goToSignup00() {
    this.dataSharingService.IsAddEsnAndResp = true
    this.dialog.open(SignupDialogComponent, {
      width: '900px',
      height: '700px',
      disableClose: true
    });
  }

}
