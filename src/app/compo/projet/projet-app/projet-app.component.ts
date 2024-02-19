import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-projet-app',
  templateUrl: './projet-app.component.html',
  styleUrls: ['./projet-app.component.css']
})
export class ProjetAppComponent implements OnInit {

	title: string = "Projets"

  constructor() { }

  ngOnInit() {
  }

}
