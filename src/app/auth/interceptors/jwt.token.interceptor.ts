import {Injectable} from '@angular/core';

import {AuthService} from '../services/auth.service';
import {HttpHandler, HttpRequest, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {UtilsService} from "../../service/utils.service";
import { DashboardService } from 'src/app/service/dashboard.service';
import { MyError } from 'src/app/resource/MyError';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Injectable({providedIn:'root'})
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService, private router: Router, private utils: UtilsService
    , private dashboradService: DashboardService
    , private utilsIhmService: UtilsIhmService
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //////////console.log("intercept", request, next)
    let interceptedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(interceptedRequest).pipe(catchError(x => this.handleErrors(x)));
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> 
  // {
  //   if(this.auth.isLoggedIn())
  //   {
  //     request = request.clone({ headers: request.headers.set( 'Authorization', 'Bearer '+this.auth.getToken())});
  //   }
  //   else
  //   {
  //     this.router.navigate(['/login']);
  //   }
  //   return next.handle(request).pipe(catchError(x => this.handleErrors(x)));
  // }

  private handleErrors(err: HttpErrorResponse): Observable<any> {
    console.log("**** handleErrors: err: ", err)
    console.log("**** handleErrors: err.status: ", err.status)
    console.log("**** handleErrors: err.error.status: ", err.error.status)

    if (err.status == 401 || err.error.status == 401) {
      this.utilsIhmService.openModal(false,"Vérifiez vos données!","oops! vos données sont erronées",null,null);
      this.auth.redirectToUrl = this.router.url;
      this.utils.showNotification("error", err.error.message)
      this.dashboradService.notifyObserversNotificationsError("Erreur 401", new MyError("Erreur 401", err.error.message));
      this.router.navigate(['/login']);
      return of(err.message);
    }
    this.router.navigate(['/login']);
    return of(err.message);
  }
}
