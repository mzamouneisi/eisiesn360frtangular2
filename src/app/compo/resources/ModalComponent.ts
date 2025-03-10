// mymodal.component.ts
import { Component, OnInit, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from 'events';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
 
  @Input() title;
  @Input() content;
  @Input() showCancel:boolean = true;

  //@Output() choix = new EventEmitter();
 
  constructor(public activeModal: NgbActiveModal) {}
 
  ngOnInit() {
  }

  ok() {
    //  //////////console.log("ok")
    //this.choix="ok";
    //this.choix.emit("ok");
    this.activeModal.close('ok')
  }

  cancel() {
    ////////////console.log("cancel")
    //this.choix="cancel";
    //this.choix.emit("cancel");
    this.activeModal.close('cancel')
  }

  dismiss() {
      this.activeModal.dismiss('dismiss')
  }
 
}