import {Component, OnInit} from '@angular/core';
import {Consultant} from 'src/app/model/consultant';
import {DataSharingService} from "../../service/data-sharing.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    ) {
  }

  ngOnInit() {

  }

  getUserFullName() {
    let userConnected = DataSharingService.userConnected;
    if (userConnected != null) {
      return userConnected.fullName;
    }
    return "";
  }

}
