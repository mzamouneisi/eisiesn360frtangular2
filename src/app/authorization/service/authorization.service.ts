import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Permission } from "../../model/permission";
import { AuthGroup, Feature } from "../authorization.types";

@Injectable({
  providedIn: 'root'
})
export class
AuthorizationService {

  constructor(private authService: DataSharingService) {

  }

  /***
   * used to check the user has permission to execute the current feature with action x => (VIEW|ADD|UPDATE|DELETE)
   * @param featureName
   * @param action
   */
  hasPermission(featureName: Feature, authGroup: AuthGroup) {
    let decode_token: any = jwt_decode(this.authService.getToken());
    // console.log("hasPermission deb decode_token : ", decode_token)
    let roleName: string = decode_token.authorities[0];
    let permissions: [Permission] = decode_token.permissions;
    let permission = permissions.find(p => p.featureId != null && (p.featureId.featureName == featureName && p.featureId.role == roleName));
    if (permission != null && permission != undefined) {
      if ("VIEW" == authGroup) return permission.view;
      if ("CREATE" == authGroup) return permission.add;
      if ("UPDATE" == authGroup) return permission.update;
      if ("DELETE" == authGroup) return permission.delete;
    }
    //////////console.log("hasPermission end false")
    return false;
  }
}
