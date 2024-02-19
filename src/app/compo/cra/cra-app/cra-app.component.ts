import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-cra-app',
  templateUrl: './cra-app.component.html',
  styleUrls: ['./cra-app.component.css']
})
export class CraAppComponent implements OnInit {

	title: string = "Cras"

  constructor() { }

  ngOnInit() {
  }

}
