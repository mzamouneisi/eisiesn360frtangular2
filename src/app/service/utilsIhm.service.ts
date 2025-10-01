import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MyCalendarComponent } from '../compo/my-calendar/my-calendar.component';
import { ModalComponent } from '../compo/resources/ModalComponent';


@Injectable({
  providedIn: 'root'
})
export class UtilsIhmService {
  modalChoice: any;

  constructor(private modalService: NgbModal) {
  }

  public confirm(content: string, callBackFctResult: any, callBackFctReason: any) {
    this.openModal(true, "Confirmation", content, callBackFctResult, callBackFctReason);
  }

  public confirmYesNo(msg: string, myThis: Object, yesFct: Function, noFct: Function) {
    return this.confirm(msg
      , function (result: any) {
        if (result == "ok") { if (yesFct) yesFct.call(myThis) }
        else { if (noFct) noFct.call(myThis) }
      }
      , function (annulation: any) {
        if (noFct) noFct.call(myThis)
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
