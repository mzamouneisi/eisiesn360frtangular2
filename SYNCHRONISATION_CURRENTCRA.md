# Synchronisation de currentCra dans DataSharingService

## Vue d'ensemble
`currentCra` dans `DataSharingService` est maintenant implémenté avec un **BehaviorSubject** pour assurer une synchronisation réactive entre les composants.

## Implémentation

### Dans DataSharingService

```typescript
// BehaviorSubject privé
private currentCraSource = new BehaviorSubject<Cra>(null);

// Observable public exposé
currentCra$ = this.currentCraSource.asObservable();

// Méthode pour obtenir la valeur courante
public getCurrentCra(): Cra {
  return this.currentCraSource.value;
}

// Méthode pour notifier les abonnés
public notifyCraUpdated(cra: Cra): void {
  this.currentCraSource.next(cra);
}

// showCra() émet automatiquement
showCra(cra: Cra) {
  if (!cra) return;
  this.currentCraSource.next(cra);  // ✅ Notification aux abonnés
  this.isAdd = "";
  this.typeCra = cra.type;
  this.router.navigate(["/cra_form"])
}
```

## Comment utiliser dans les composants

### Méthode 1: Accès à la valeur courante
```typescript
// Obtenir la valeur courante sans s'abonner
const cra = this.dataSharingService.getCurrentCra();
```

### Méthode 2: Observer les changements (Recommandé)
```typescript
import { Subscription } from 'rxjs';

export class MyCraComponent implements OnInit, OnDestroy {
  currentCra: Cra;
  private subscription: Subscription;

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit() {
    // S'abonner aux changements de currentCra
    this.subscription = this.dataSharingService.currentCra$.subscribe(
      (cra: Cra) => {
        console.log("currentCra mise à jour:", cra);
        this.currentCra = cra;
        // Faire quelque chose avec le CRA
      }
    );
  }

  ngOnDestroy() {
    // Toujours se désabonner pour éviter les fuites mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

### Méthode 3: Utiliser l'Observable directement en template
```typescript
export class MyCraComponent {
  currentCra$ = this.dataSharingService.currentCra$;

  constructor(private dataSharingService: DataSharingService) {}
}
```

```html
<!-- Dans le template avec async pipe -->
<div *ngIf="(currentCra$ | async) as cra">
  <p>{{ cra.type }}</p>
  <p>{{ cra.consultantId }}</p>
</div>
```

## Points clés

### ✅ Avantages
- **Réactivité**: Tous les composants abonnés reçoivent les mises à jour automatiquement
- **Synchronisation**: Les changements dans un composant sont visibles dans les autres
- **Pas de races conditions**: Plus de problème de timing avec setTimeout
- **Meilleure gestion mémoire**: Utilisation des Observables avec destroy

### ⚠️ Points d'attention
1. **Toujours se désabonner**: Implémenter `OnDestroy` et appeler `unsubscribe()`
2. **Ou utiliser le async pipe**: Dans les templates Angular
3. **Non-null safety**: Toujours vérifier que `cra` n'est pas null

## Fichiers modifiés
- ✅ `src/app/service/data-sharing.service.ts` - Ajout de BehaviorSubject et méthodes
- ✅ `src/app/compo/notification/notification.component.ts` - Utilisation de `getCurrentCra()`
- ✅ `src/app/compo/cra/cra-form/cra-form-cal.component.ts` - Utilisation de `getCurrentCra()`

## Exemple d'utilisation complète

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataSharingService } from '../../../service/data-sharing.service';
import { Cra } from '../../../model/cra';

@Component({
  selector: 'app-my-cra',
  template: `
    <div *ngIf="currentCra">
      <h3>CRA Type: {{ currentCra.type }}</h3>
      <p>Consultant: {{ currentCra.consultantId }}</p>
      <p>Mois: {{ currentCra.month | date: 'MM/yyyy' }}</p>
    </div>
  `
})
export class MyCraComponent implements OnInit, OnDestroy {
  currentCra: Cra;
  private craSubscription: Subscription;

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit() {
    // S'abonner aux changements de CRA
    this.craSubscription = this.dataSharingService.currentCra$.subscribe(
      (cra: Cra) => {
        if (cra) {
          console.log("Nouveau CRA reçu:", cra);
          this.currentCra = cra;
          // Faire une action suite au changement
        }
      }
    );
  }

  ngOnDestroy() {
    // Nettoyage: se désabonner
    if (this.craSubscription) {
      this.craSubscription.unsubscribe();
    }
  }
}
```

## Questions fréquentes

**Q: J'ai besoin de la valeur courante sans m'abonner?**
A: Utilisez `this.dataSharingService.getCurrentCra()` qui retourne la valeur du BehaviorSubject

**Q: Comment je sais quand le CRA a changé?**
A: S'abonnez à `currentCra$` - vous recevrez une notification à chaque changement

**Q: Comment mettre à jour manuellement le CRA?**
A: Appelez `this.dataSharingService.notifyCraUpdated(newCra)` ou mieux encore, appelez `showCra(newCra)`

**Q: Dois-je me désabonner?**
A: **OUI!** Toujours implémenter `OnDestroy` et appeler `unsubscribe()` sur les subscriptions
