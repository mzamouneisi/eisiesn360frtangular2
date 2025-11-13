import { Injectable } from '@angular/core';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError } from "rxjs/operators";
import { MyError } from 'src/app/resource/MyError';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { UtilsService } from "../../service/utils.service";

@Injectable({providedIn:'root'})
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, private utils: UtilsService
    , private utilsIhmService: UtilsIhmService
    , private dataSharingService: DataSharingService
    ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //////////console.log("intercept", request, next)
    let interceptedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.dataSharingService.getToken()}`
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
      let msgTitle = "Vérifiez vos données!", msgBody = "oops! vos données sont erronées";
      // this.utilsIhmService.openModal(false,msgTitle, msgBody,null,null);
      console.log(msgTitle, msgBody)
      this.dataSharingService.addError(new MyError(msgTitle, msgBody))
      this.dataSharingService.redirectToUrl = this.router.url;
      this.utils.showNotification("error", err.error.message)
      this.dataSharingService.notifyObserversNotificationsError("Erreur 401", new MyError("Erreur 401", err.error.message));
      this.dataSharingService.logout();
      this.router.navigate(['/login']);
      return of(err.message);
    }else {
      this.dataSharingService.addError(new MyError(err.status + ' : ' + err.name, err.message))
    }
    this.router.navigate(['/login']);
    return of(err.message);
  }
}
