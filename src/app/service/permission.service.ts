import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GenericResponse} from "../model/response/genericResponse";
import {environment} from "../../environments/environment";
import {Permission} from "../model/permission";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  permissionUrl: string;

  constructor(private http: HttpClient) {
    this.permissionUrl = environment.apiUrl + "/permissions";
  }

  /***
   * used to retrieve all permissions by role
   * @param role
   */
  getPermissionsByRole(role: string): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.permissionUrl + "/byRole/" + role);
  }

  /***
   * used to update permissions
   * @param permissions
   */
  updatePermissions(permissions: Array<Permission>): Observable<GenericResponse> {
    return this.http.put<GenericResponse>(this.permissionUrl + "/", permissions);
  }

  addDefaultPermissionsOnFeaturesToRoles(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.permissionUrl + "/addDefaultPermissionsOnFeaturesToRoles", {});
  }
}
