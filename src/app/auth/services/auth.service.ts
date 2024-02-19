import {Injectable} from '@angular/core';

import {TokenService} from './token.service'
import {Credentials} from '../credentials';
import {Router} from '@angular/router';
import {Consultant} from 'src/app/model/consultant';
import {ConsultantService} from 'src/app/service/consultant.service';
import {DataSharingService} from "../../service/data-sharing.service";
import {UtilsService} from "../../service/utils.service";
import { DashboardService } from 'src/app/service/dashboard.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectToUrl: string = '';
  authorization: string;
  userConnected : Consultant;

  constructor(private router: Router
    , private tokenService: TokenService
    , private consultantService: ConsultantService
    , private dataSharingService: DataSharingService
    , private dashboardService: DashboardService
    ) {

  }

  public login(credentials: Credentials, caller: any): void {
    this.tokenService.getResponseHeaders(credentials)
      .subscribe(res => {
          //////console.log("login:", credentials, res);
          if(caller) {
            caller.info = "Info : res=" + JSON.stringify(res)
          }

          if (res.status == 200) {
            this.authorization = res.headers.get('authorization');
            // //////////console.log("login: authorization: ", this.authorization);
            this.saveToken(this.authorization);
            this.dataSharingService.isUserLoggedIn.next(true);
            
            this.findConsultantByUsername(credentials.username, caller);

            this.dashboardService.getNotifications();
            
          }else {
            if(caller) {
              caller.error = "ERROR : res=" + JSON.stringify(res)
            }
          }
        }, error => {
          if(caller) {
            caller.error = "ERROR : error=" + JSON.stringify(error)
            //////console.log("error:", credentials, error);
          }
        }
      );
  }

  public logout(): void {
	    localStorage.removeItem(UtilsService.TOKEN_STORAGE_KEY);
	    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER);
	    localStorage.removeItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED);
	    localStorage.removeItem(UtilsService.DEFAULT_LOCALE);
	    this.dataSharingService.isUserLoggedIn.next(false);
	    this.userConnected = null;
	    DataSharingService.userConnected = this.userConnected;
	    this.router.navigate(["login"]);
  }

  findConsultantByUsername(username: string, caller: any) {
	  this.userConnected = null;
    this.consultantService.findConsultantByUsername(username).subscribe(
      data => {
        if (data) {
          this.userConnected = data.body.result;
          if(caller) {
            caller.info = "Info : res=" + JSON.stringify(this.userConnected.fullName)
          }
          DataSharingService.userConnected = this.userConnected;
          this.saveTokenUser(this.userConnected);

          this.dataSharingService.findConsultantByUsername(this.userConnected.adminConsultantUsername,
            (data, user) => {
              this.userConnected.adminConsultant = user;
              DataSharingService.userConnected = this.userConnected;
              this.saveTokenUser(this.userConnected);
            },
            (error) => {
              console.log("findConsultantByUsername: error ", error);
              if(caller) {
                caller.error = "ERROR : error=" + JSON.stringify(error)
              }
            }
            );

          this.router.navigate(['/home']);
        }
      }, error => {
        console.log("findConsultantByUsername: error ", error);
        if(caller) {
          caller.error = "ERROR : error=" + JSON.stringify(error)
        }
      }
    );
  }

  private saveToken(token: string) {
    ////////////console.log("saveToken: token=", token);
    localStorage.setItem(UtilsService.TOKEN_STORAGE_KEY, token);
  }

  public getToken(): string {
    let token: string = localStorage.getItem(UtilsService.TOKEN_STORAGE_KEY);
    ////////////console.log("getToken:", token);
    return token;
  }

  saveTokenUser(user: Consultant) {
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(UtilsService.TOKEN_STORAGE_USER_CONNECTED, "true");
    //////////console.log("saveTokenUser:", JSON.stringify(user));
  }

  public isLoggedIn(): boolean {
    return this.getToken() != null ;
  }
}
