import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today = new Date();
	dateCommit = "Last Commit : 2025-07-11 15:24:41"
  dateFooter = "";

  constructor() { }

  ngOnInit() {
    this.dateFooter = this.dateCommit || formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'fr-FR');
  }

}
