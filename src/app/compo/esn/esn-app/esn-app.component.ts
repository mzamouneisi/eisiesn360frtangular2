import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-esn-app',
  templateUrl: './esn-app.component.html',
  styleUrls: ['./esn-app.component.css']
})
export class EsnAppComponent implements OnInit {

	title: string = "Esns"

  constructor() { }

  ngOnInit() {
  }

}
