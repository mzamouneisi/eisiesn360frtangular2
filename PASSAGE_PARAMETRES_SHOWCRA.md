# Passage des paramètres dans la méthode showCra

## Vue d'ensemble
La méthode `showCra` a été modifiée pour passer le CRA en paramètre au composant `cra-form-cal` via la route, tout en conservant la synchronisation via le BehaviorSubject du service.

## Implémentation

### Dans DataSharingService - showCra()

```typescript
showCra(cra: Cra) {
  console.log("showCra deb", cra)
  if (!cra) {
    console.log("showCra cra NULL !", cra)
    return
  }

  // Mise à jour du BehaviorSubject pour les autres composants
  this.currentCraSource.next(cra);
  this.isAdd = "";
  this.typeCra = cra.type;

  // Navigation avec passage du CRA en paramètre
  this.router.navigate(["/cra_form"], { 
    queryParams: { id: cra.id },           // ✅ ID du CRA en queryParam
    state: { cra: cra }                     // ✅ CRA complet en state
  })
  console.log("showCra fin", cra)
}
```

## Paramètres passés

### 1. QueryParams
- **id** : L'ID du CRA (numero)
- Accessible via : `this.route.snapshot.queryParamMap.get('id')`
- **Utilité** : Permet une URL lisible et peut être bookmarkée

```
/cra_form?id=123
```

### 2. State
- **cra** : L'objet CRA complet
- Accessible via : `this.router.getCurrentNavigation()?.extras?.state?.cra`
- **Utilité** : Transmet directement l'objet sans avoir à le recharger depuis le serveur

## Comment le composant cra-form-cal les récupère

### Dans initParams()

```typescript
if (this.currentCra == null) {
  if (this.isAdd != "true") {
    // 1️⃣ Essayer de récupérer le CRA depuis le state de la route
    const navigationExtras = this.router.getCurrentNavigation()?.extras;
    if (navigationExtras?.state?.cra) {
      this.currentCra = navigationExtras.state.cra;  // ✅ Plus rapide
      console.log("CRA récupéré du state de la route");
    } else {
      // 2️⃣ Sinon, récupérer depuis le service (fallback)
      this.currentCra = this.dataSharingService.getCurrentCra();
      console.log("CRA récupéré du service");
    }
  }
}
```

## Flux de récupération du CRA

```
┌────────────────────────────────────────────────┐
│ showCra(cra) appelé dans un composant          │
│ (par ex: CraListComponent, NotificationComponent)│
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│ DataSharingService.showCra() exécuté           │
│  1. Émet cra via currentCraSource.next(cra)   │
│  2. Navigue vers /cra_form avec paramètres     │
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│ Route activation avec paramètres               │
│  - queryParams: { id: cra.id }                 │
│  - state: { cra: cra }                         │
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│ CraFormCalComponent.ngOnInit() exécuté         │
│  → appelle initParams()                         │
└─────────────┬──────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────┐
│ initParams() recherche le CRA                  │
│  1. Cherche dans state (getInstantaneously)   │
│  2. Fallback sur le service si nécessaire      │
└────────────────────────────────────────────────┘
```

## Avantages de cette implémentation

### ✅ Résilience
- Le CRA est disponible immédiatement via state
- Fallback sur le service si state est vide
- Pas d'attente de chargement asynchrone

### ✅ Compatibilité
- Les bookmarks avec l'ID fonctionnent (`/cra_form?id=123`)
- Les anciens appels via le service continuent de fonctionner
- Les nouvelles données via state sont prioritaires

### ✅ Performance
- Le CRA n'a pas besoin d'être recharché depuis le serveur
- L'URL reste lisible et shareable

### ✅ Synchronisation
- Tous les autres composants reçoivent le CRA via `currentCra$`
- Les observateurs sont notifiés automatiquement

## Exemples d'utilisation

### De CraListComponent
```typescript
showCra(cra: Cra, event: any) {
  console.log("showCra craList ", cra)
  this.clearInfos()
  // Le CRA est passé en paramètre à showCra
  this.dataSharingService.showCra(cra);  // ✅ Passe le CRA
}
```

### De NotificationComponent
```typescript
showCra(notification: Notification) {
  console.log("showCra Notification", notification)
  this.dataSharingService.showCra(notification.cra);  // ✅ Passe le CRA de la notification
}
```

### Dans un Observer (autres composants)
```typescript
export class MyComponent implements OnInit, OnDestroy {
  cra: Cra;
  private subscription: Subscription;

  constructor(private dataSharingService: DataSharingService) {}

  ngOnInit() {
    // S'abonner aux changements de CRA
    this.subscription = this.dataSharingService.currentCra$.subscribe(
      (cra: Cra) => {
        console.log("Nouveau CRA reçu dans le composant:", cra);
        this.cra = cra;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
```

## Paramètres de navigation

### URL résultante
```
/cra_form?id=42
```

### State (invisible dans l'URL)
```typescript
{
  cra: {
    id: 42,
    type: "CRA",
    month: "2026-01",
    consultantId: 5,
    consultant: { ... },
    craDays: [ ... ],
    ...
  }
}
```

## Points clés

### ✅ À retenir
1. **showCra()** passe maintenant le CRA via `state`
2. **initParams()** cherche d'abord dans state, puis fallback sur le service
3. **currentCra$** notifie tous les abonnés automatiquement
4. **L'URL reste lisible** grâce aux queryParams

### ⚠️ Points d'attention
1. Le state de navigation est perdu lors d'une actualisation de page (F5)
   - Mais le service a toujours le CRA via `currentCra$`
2. Les bookmarks ne contiennent que l'ID, pas les données complètes
   - C'est normal et désiré pour la sécurité
3. L'ID du CRA est visible dans l'URL
   - C'est intentionnel pour permettre les URLs parlantes

## Migration depuis l'ancienne approche

### Avant
```typescript
this.dataSharingService.showCra(cra);  // ✅ Marche toujours
// Le CRA était seulement dans le service
```

### Après
```typescript
this.dataSharingService.showCra(cra);  // ✅ Marche toujours, plus les paramètres
// Le CRA est maintenant aussi en paramètre de route
```

**Aucun changement requis dans les appels existants!** La modification est entièrement rétro-compatible.

## Débogage

### Logs utiles
```typescript
// Dans showCra()
console.log("showCra deb", cra)      // Avant navigation
console.log("showCra fin", cra)      // Après navigation

// Dans initParams()
console.log("DBG: initParams: currentCra = null")  // Cherche le CRA
console.log("DBG: initParams: CRA récupéré du state")  // Trouvé dans state
console.log("DBG: initParams: dataSharingService.currentCra")  // Trouvé dans service
```

### Vérifier les paramètres
```typescript
// Dans cra-form-cal.component.ts
ngOnInit() {
  // Voir l'URL
  console.log("URL actuelle:", this.router.url);
  
  // Voir les query params
  console.log("ID du CRA:", this.route.snapshot.queryParamMap.get('id'));
  
  // Voir le state
  const nav = this.router.getCurrentNavigation();
  console.log("State:", nav?.extras?.state);
}
```

## Cas d'usage

### ✅ Fonctionne bien quand:
- Navigation directe via showCra() depuis un autre composant
- Passage rapide entre listes et détails
- Besoin de synchronisation entre plusieurs vues

### ⚠️ Limitations:
- Actualisation de la page (F5) perd le state
  - Solution: Le service garde toujours le CRA
- Si l'ID change sans naviguer
  - Solution: Appeler showCra() à nouveau
