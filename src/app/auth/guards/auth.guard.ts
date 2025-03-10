import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataSharingService } from 'src/app/service/data-sharing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: DataSharingService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let url: string = state.url;
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    //////////console.log("checkLogin url", url)
    if(this.authService.isLoggedIn()) {
      //////////console.log("checkLogin OK")
      return true;
    }
    //////////console.log("checkLogin KO")
    this.authService.redirectToUrl = url;
    this.router.navigate(['/login']);
    return false;
  }
}
