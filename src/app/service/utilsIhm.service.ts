import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from '../compo/_dialogs/confirm-dialog.component';
import { InfoDialogComponent } from '../compo/_dialogs/info-dialog.component';
import { MyCalendarComponent } from '../compo/my-calendar/my-calendar.component';
import { ModalComponent } from '../compo/resources/ModalComponent';


@Injectable({
  providedIn: 'root'
})
export class UtilsIhmService {
  modalChoice: any;

  constructor(private modalService: NgbModal, private dialog: MatDialog) {
  }

  public confirm(content: string, callBackFctResult: any, callBackFctReason: any) {
    this.openModal(true, "Confirmation", content, callBackFctResult, callBackFctReason);
  }

  public confirmYesNo(msg: string, myThis: Object, yesFct: Function, noFct: Function) {
    return this.confirm(msg
      , function (result: any) {
        if (result == "ok") { if (yesFct) yesFct(myThis) }
        else { if (noFct) noFct(myThis) }
      }
      , function (annulation: any) {
        if (noFct) noFct(myThis)
      }
    );
  }

  public scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public info(content: string, callBackFctResult: any = null, callBackFctReason: any = null) {
    console.log("msg info content=", content)
    this.openModal(false, "Infos", content, callBackFctResult, callBackFctReason);
  }

  public confirmDialog(msg: string, fctYes: Function, fctNo: Function) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        title: 'Confirmation',
        message: msg,
        disableClose: true ,
        autoFocus: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // L’utilisateur a cliqué "Yes"
        console.log('Confirmed');
        if (fctYes) fctYes()
      } else {
        // L’utilisateur a cliqué "No"
        console.log('Cancelled');
        if (fctNo) fctNo()
      }
    });
  }

  infoDialog(msg: string,  fctYes : Function = null ) {
    if (msg) {
      const dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '350px',
        data: {
          title: 'Info',
          message: msg,
          disableClose: true,
          autoFocus: false
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // L’utilisateur a cliqué "Yes"
          console.log('Confirmed');
          if (fctYes) fctYes()
        } 
      });
    }

  }

  openCalendarModal(callBackFctResult: any = null) {

    const modalRef = this.modalService.open(MyCalendarComponent);
    modalRef.componentInstance.changeRef.markForCheck();
    // return modalRef.result;
    modalRef.result.then(callBackFctResult).catch((res) => { console.log(res) });

  }

  openModal(showCancel: boolean, title: string, content: string, callBackFctResult: any, callBackFctReason: any) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.showCancel = showCancel;

    modalRef.result.then(callBackFctResult, callBackFctReason).catch((res) => { console.log(res) });
  }

  downloadFile(file_name: string, attr_href_File_Saved_Path: string) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', attr_href_File_Saved_Path);
    link.setAttribute('download', file_name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
