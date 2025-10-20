import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const API_URL = 'https://antennes.onrender.com/antennes/api/users'; // ⚠️ adapte selon ton backend

@Component({
  selector: 'app-valid-email',
  templateUrl: './valid-email.component.html',
  styleUrls: ['./valid-email.component.css']
})
export class ValidEmailComponent implements OnInit {

  codeEmail = '';
  message = '';
  isLoading = true;
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.codeEmail = this.route.snapshot.paramMap.get('code') ?? '';

    if (!this.codeEmail) {
      this.message = 'Code de validation manquant.';
      this.isLoading = false;
      return;
    }

    this.validateEmail();
  }

  validateEmail() {
    this.isLoading = true;
    this.message = 'Validation en cours...';

    let API_URL = environment.divUrl

    /**
     * TODO activer le consultant ayant ce code et supprimer ce code dans la table consultant 
     */
    this.http.post(`${API_URL}/msg/validateEmail/${this.codeEmail}`, {}).subscribe({
      next: (resp) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = '✅ Votre adresse email a été validée avec succès !';
        // Optionnel : redirection après quelques secondes
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        console.error('Erreur validation :', err);
        this.isLoading = false;
        this.isSuccess = false;
        if (err.status === 404)
          this.message = '❌ Ce lien de validation est invalide ou expiré.';
        else
          this.message = '⚠️ Une erreur est survenue lors de la validation.';
      }
    });
  }
}
