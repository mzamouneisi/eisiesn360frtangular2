import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doc-category-app',
  templateUrl: './doc-category-app.component.html',
  styleUrls: ['./doc-category-app.component.css']
})
export class DocCategoryAppComponent implements OnInit {

  title: string = "Category"

  constructor() { }

  ngOnInit() {
  }
}
