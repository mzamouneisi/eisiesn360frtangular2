import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity } from '../model/activity';
import { Consultant } from '../model/consultant';
import { Cra } from '../model/cra';
import { Msg } from '../model/msg';
import { MsgHisto } from '../model/msgHisto';
import { GenericResponse } from "../model/response/genericResponse";
import { DataSharingService } from './data-sharing.service';

@Injectable({ providedIn: 'root' })
export class ConsultantService {

  // filtres d'affichage
  public AFF_ALL: string = "ALL";
  public AFF_CONSULTANT: string = "CONSULTANT";
  public AFF_MANAGER: string = "MANAGER";
  public AFF_BOSS: string = "RESPONSIBLE_ESN";

  public LIST_FILTRES_AFF: string[] = [this.AFF_ALL, this.AFF_CONSULTANT, this.AFF_MANAGER, this.AFF_BOSS];

  private consultantUrl: string;
  private consultantUrlPub: string;
  private consultant: Consultant;
  private managerSelected: Consultant = null;

  constructor(private http: HttpClient, private datasharingService: DataSharingService) {
    this.consultantUrl = environment.apiUrl + '/consultant';
    this.consultantUrlPub = environment.divUrl + '/consultant';
  }

  public setManagerSelected(m: Consultant) {
    this.managerSelected = m;
  }

  public getManagerSelected(): Consultant {
    return this.managerSelected;
  }

  public setConsultant(consultant: Consultant) {
    this.consultant = consultant;
  }

  public getConsultant(): Consultant {
    return this.consultant;
  }

  public findAllOfAdminUsername(adminUsername: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.consultantUrl + "findByAdminUsername", adminUsername);
  }

  /***
   * used to retrieve all consultant for server side
   */
  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl);
  }

  public findAllByEsn(idEsn: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/esn/" + idEsn);
  }

  public findAllChildConsultants(resp: Consultant): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + '/childs/' + resp.id);
  }

  /***
   * used to retrieve all admin consultant for server side
   */
  public findAdminConsultant(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/admin");
  }

  /***
   * used to retrieve all NOT admin consultant for server side
   */
  public findNotAdminConsultant(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/notadmin");
  }

  /***
   * used to retrieve all consultant for server side filtred by their admin
   */
  public findConsultant(admin: Consultant): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + '/filteredByAdmin/' + admin.id);
  }

  /***
   * used to retrieve all roles from the server side
   */
  public getRoles(isPub: boolean = false): Observable<GenericResponse> {
    let url = isPub ? this.consultantUrlPub : this.consultantUrl
    return this.http.get<GenericResponse>(url + "/roles");
  }

  /***
   * used to retrieve  consultant by id
   * @param id
   */
  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/" + id);
  }

  public getEsnOfConsId(idCons: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.consultantUrl + "/esnOfConsId/" + idCons);
  }

  findConsultantByUsername(username: string, isPub: boolean = false): Observable<GenericResponse> {
    console.log("findConsultantByUsername username:", username)
    let url = isPub ? this.consultantUrlPub : this.consultantUrl
    return this.http.post<GenericResponse>(url + "/findByUsername", username);
  }

  getConsultantAndHisInfos(username: string): Observable<GenericResponse> {
    console.log("getConsultantAndHisInfos username:", username)
    return this.http.post<GenericResponse>(this.consultantUrl + "/getConsultantAndHisInfos", username);
  }

  /***
   * used to persist consultant
   * @param consultant
   */
  public save(consultant: Consultant, isPub: boolean = false): Observable<GenericResponse> {
    ////console.log('save id=' + consultant.id + '.');
    let url = isPub ? this.consultantUrlPub : this.consultantUrl
    if (consultant.id > 0) {
      ////console.log('put update');
      return this.http.put<GenericResponse>(url + "/", consultant);
    } else {
      ////console.log('post add');
      return this.savePost(consultant, isPub);
    }
  }

  saveCodeEmailToValidate(consultant: Consultant, codeEmailToValidate: string) {
    if (consultant && codeEmailToValidate) {
      consultant.codeEmailToValidate = codeEmailToValidate;
      return this.savePost(consultant, true);
    }
    throw new Error('consultant or codeEmailToValidate is null');
  }

  /**
   * Sauvegarde le code de réinitialisation du password pour un email
   */
  saveCodeResetPassword(email: string, codeResetPassword: string, fctOnSuccess: Function, fctOnError: Function): void {
    const label = "saveCodeResetPassword";
    const url = `${this.consultantUrlPub}/resetPassword`;

    console.log(label + ": Sauvegarde du code pour email: " + email);

    this.findConsultantByUsername(email, true).subscribe(
      data => {
        console.log(label + ": Consultant trouvé: ", data);
        const consultant: Consultant = data.body.result;
        if (consultant) {
          consultant.codeEmailToValidate = codeResetPassword;
          this.savePost(consultant, true).subscribe(
            saveData => {
              let msg = "Code de réinitialisation sauvegardé avec succès pour l'email: " + email;
              console.log(label + ": " + msg);
              if (fctOnSuccess) fctOnSuccess(saveData, msg);
            },
            error => {
              let msg = "Erreur lors de la sauvegarde du code de réinitialisation pour l'email: " + email;
              console.log(label + ": " + msg, error);
              if (fctOnError) fctOnError(error, msg);
            }
          );
        } else {
          let msg = "Aucun consultant trouvé pour l'email: " + email;
          console.log(label + ": " + msg);
          if (fctOnError) fctOnError(null, msg);
        }
      },
      error => {
        let msg = "Erreur lors de la recherche du consultant: " + email;
        console.log(label + ": " + msg, error);
        if (fctOnError) fctOnError(error, msg);
      }
    );
  }

  /***
   * used to persist consultant with ending password
   * @param consultant
   */
  public savePost(consultant: Consultant, isPub: boolean = false): Observable<GenericResponse> {
    console.log('savePost consultant=', consultant);
    let url = isPub ? this.consultantUrlPub : this.consultantUrl
    console.log('savePost url=', url);
    return this.http.post<GenericResponse>(url + "/", consultant);
  }

  /***
   * used to remove consultant by id
   * @param id
   */
  public deleteById(id: number, isPub: boolean = false): Observable<GenericResponse> {
    let url = isPub ? this.consultantUrlPub : this.consultantUrl
    return this.http.delete<GenericResponse>(url + "/" + id);
  }

  /***
   * used to remove all consultant
   */
  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.consultantUrl);
  }

  /////////////////////////////

  mapConsul = new Map<number, Consultant>();
  majAdminConsultant(consultant: Consultant, fct: Function = null) {
    ////////////////
    if (consultant == null) return;
    if (consultant.adminConsultant != null) {
      consultant.adminConsultantId = consultant.adminConsultant.id
      return;
    }
    if (consultant.role == "ADMIN") {
      consultant.adminConsultant = null
      consultant.adminConsultantId = null
      return;
    }

    if (consultant.role == "RESPONSIBLE_ESN") {
      consultant.adminConsultant = null
      consultant.adminConsultantId = null
      return;
    }

    let id = consultant.adminConsultantId
    let label = "find admin consultant by id=" + id;
    let obj = consultant.adminConsultant

    console.log("setAdminConsultant DEB consultant, idAdmin, admin : ", consultant, id, obj)

    if (consultant && id != null && !obj) {

      if (this.mapConsul != null) {
        let ca = this.mapConsul[id]
        if (ca != null) {
          consultant.adminConsultant = ca
          console.log("setAdminConsultant trouve dans map ca : ", ca);
          if (fct) fct()
          return
        }
      }

      this.findById(id).subscribe(
        data => {
          console.log(label, data)
          consultant.adminConsultant = data.body.result;
          consultant.adminConsultantId = consultant.adminConsultant?.id
          // if(consultant.adminConsultant == null) {
          //   consultant.adminConsultant = consultant
          // }
          if (this.mapConsul != null) {
            let ca = this.mapConsul[id]
            this.mapConsul[id] = consultant.adminConsultant
          }
          console.log("setAdminConsultant trouve dans server ca : ", consultant.adminConsultant);

          if (fct) fct()
        },
        error => {
          consultant.adminConsultant = null
          console.log("setAdminConsultant ERROR label consultant, err", label, consultant, error)
        }
      );
    }
    /////////////////
  }

  majActivity(myObj: Activity) {
    ////////////////
    let id = myObj.consultantId
    let label = "find consultant by id=" + id;
    let obj = myObj.consultant

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          console.log(label, data)
          myObj.consultant = data.body.result;
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    /////////////////
  }

  majCra(myObj: Cra) {
    ////////////////
    console.log("*** majCra DEB : myObj Cra : ", myObj)
    let id = myObj.consultantId
    let label = "find consultant by id=" + id;
    let obj = myObj.consultant
    let admin = obj?.adminConsultant
    let managerCra = myObj.manager

    if (myObj && id && (!obj || !admin || !managerCra)) {
      this.findById(id).subscribe(
        data => {
          console.log("*** majCra : label, data : ", label, data)
          myObj.consultant = data.body.result;
          console.log("*** majCra : myObj : ", myObj)
          this.majAdminConsultant(myObj.consultant, () => {
            myObj.manager = myObj.consultant.adminConsultant
            this.majActivityInCra(myObj)
            console.log("*** majCra END : myObj : Cra : ", myObj)
          });
        },
        error => {
          console.log("majCra ERROR label myObj, err", label, myObj, error)
        }
      );

    }
    /////////////////
  }

  majActivityInCra(cra: Cra) {
    // this.datasharingService.majActivityInCra(cra)
    if (cra != null) {
      for (let craDay of cra.craDays) {
        if (craDay != null) {
          for (let craDayActivities of craDay.craDayActivities) {
            // craDayActivities.craDay = craDay
            this.datasharingService.majActivityInCraDayActivity(craDayActivities);
          }
        }
      }
    }
  }

  majMsgConsultants(myObj: Msg, consultantName: string) {
    ////////////////
    let consultantId = consultantName + "Id"
    let id = myObj[consultantId]
    let label = "find consultant by id=" + id;
    let obj = myObj[consultantName]

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          console.log(label, data)
          myObj[consultantName] = data.body.result;
        },
        error => {
          console.log("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    /////////////////
  }

  majMsg(myObj: Msg) {
    ////////////////
    this.majMsgConsultants(myObj, "from")
    this.majMsgConsultants(myObj, "to")
    /////////////////
  }

  majMsgHisto(myObj: MsgHisto) {
    this.majMsgConsultants(myObj, "from")
    this.majMsgConsultants(myObj, "to")
  }

}
