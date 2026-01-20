import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) { }

  ngOnInit(): void {
    console.log('ValidateEmailComponent ngOnInit appelé!');
    this.codeEmail = this.route.snapshot.paramMap.get('code') ?? '';

    console.log('Code email reçu :', this.codeEmail);

    if (!this.codeEmail) {
      this.message = 'Code de validation manquant.';
      this.isLoading = false;
      return;
    }

    this.validateEmail();
  }

  validateEmail() {
    let label = 'validateEmail';
    
    console.log(label + ': START - Début de la validation');
    console.log(label + ': codeEmail = ' + this.codeEmail);
    
    this.isLoading = true;
    this.message = 'Validation en cours...';

    const url = `${API_URL}/msg/validateEmail/${this.codeEmail}`;
    console.log(label + ': URL API = ' + url);

    /**
     * TODO activer le consultant ayant ce code et supprimer ce code dans la table consultant 
     */
    this.http.post(url, {}).subscribe({
      next: (resp) => {
        console.log(label + ': HTTP response reçue');
        console.log(label + ': response body = ', resp);
        
        if (resp && resp["body"] && resp["body"].result === true) {
          console.log(label + ': ✅ Validation RÉUSSIE - result = true');
          
          this.isLoading = false;
          this.isSuccess = true;
          this.message = '✅ Validation email réussie';
          
          console.log(label + ': Message affiché: ' + this.message);
          console.log(label + ': Redirection vers /login dans 4 secondes...');
          
          // Redirection après quelques secondes
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
        } else {
          console.log(label + ': ❌ Validation ÉCHOUÉE - result !== true');
          console.log(label + ': resp.body.result = ' + (resp && resp["body"] ? resp["body"].result : 'undefined'));
          
          this.isLoading = false;
          this.isSuccess = false;
          this.message = '❌ La validation de l\'email a échoué.';
          
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
          this.message = '❌ Ce lien de validation est invalide ou expiré.';
          console.error(label + ': Erreur 404 - Lien invalide ou expiré');
        }
        else { 
          this.message = '⚠️ Une erreur est survenue lors de la validation.';
          console.error(label + ': Erreur ' + err.status + ' - Erreur serveur');
        }
        
        console.error(label + ': Message affiché: ' + this.message);
      }
    });
  }
}
