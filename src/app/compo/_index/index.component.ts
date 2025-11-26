import { Component, OnInit } from '@angular/core';
import { DataSharingService } from "../../service/data-sharing.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private dataSharingService : DataSharingService
    ) {
  }

  ngOnInit() {
  }

  getUserFullName() {
    let userConnected = this.dataSharingService.userConnected
    if (userConnected != null) {
      return userConnected.fullName;
    }
    return "";
  }

}
