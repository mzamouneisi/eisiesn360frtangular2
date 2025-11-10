import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserConnection } from 'src/app/model/UserConnection';
import { ConnectionService } from 'src/app/service/connection.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent extends MereComponent {

  title: string = this.utils.tr("List") + " " + "UserConnection"

  myList: UserConnection[];

  myObj: UserConnection;

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }


  constructor(private connectionService: ConnectionService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    this.colsSearch = ["dateConnection", "login", "ip", "country", "city"]

  }

  ngOnInit() {
    this.findAll();
  }

  getTitle() {
    let nbElement = 0
    if (this.myList != null) nbElement = this.myList.length
    let t = this.title + " (" + nbElement + ")"
    return t
  }

  findAll() {
    this.beforeCallServer("findAll")
    this.connectionService.findAll().subscribe(
      data => {
        this.afterCallServer("findAll", data)
        this.myList = data.body.result;
        this.myList00 = this.myList;
        console.log("*** connections : ", this.myList)
      }, error => {
        this.addErrorFromErrorOfServer("findAll", error);
        ////console.log(error);
      }
    );
  }

  setMyList(myList: any[]) {
    this.myList = myList;
  }


}
