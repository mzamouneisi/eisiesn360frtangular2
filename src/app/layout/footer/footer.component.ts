import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today = new Date();
	dateCommit = "Last Commit : 2025-10-13 18:27:19"
  dateFooter = "";

  constructor() { }

  ngOnInit() {
    this.dateFooter = this.dateCommit || formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'fr-FR');
  }

}
