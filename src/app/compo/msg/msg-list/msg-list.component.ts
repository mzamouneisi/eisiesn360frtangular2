import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Msg } from '../../../model/msg';
import { MsgService } from '../../../service/msg.service';
import { MereComponent } from '../../_utils/mere-component';
import { MsgFormComponent } from '../msg-form/msg-form.component';

@Component({
	selector: 'app-msg-list',
	templateUrl: './msg-list.component.html',
	styleUrls: ['./msg-list.component.css']
})
export class MsgListComponent extends MereComponent {

	title: string = "List Msg"

	myList: Msg[];

	myObj: Msg;
	@ViewChild('myObjEditView', {static:false}) myObjEditView:MsgFormComponent ;

	constructor(private msgService: MsgService, private router: Router
		, public utils: UtilsService
		, protected utilsIhm: UtilsIhmService
		, public dataSharingService: DataSharingService) {
		super(utils, dataSharingService);

		this.colsSearch = ["msg", "type", "typeId", "from", "to", "isReadByTo"]
	}	

	getIdOfCurentObj() {
		return this.myObj != null ? this.myObj.id : -1;
	}
     showForm(myObj: Msg, event:any) {
			this.myObj = myObj;
			if(this.myObjEditView != null) {
					this.myObjEditView.myObj = this.myObj
					this.myObjEditView.isAdd = 'false';
					this.myObjEditView.ngOnInit()
			}
	}	

	ngOnInit() {
		this.findAll();
	}
	
	getTitle() {
		let nbElement = 0
		if(this.myList != null) nbElement = this.myList.length
		let t = this.title + " (" + nbElement + ")"
		return t;
	}	

	findAll() {
		this.beforeCallServer("findAll")
		this.msgService.findAll().subscribe(
			data => {
				this.afterCallServer("findAll", data)
				this.myList = data.body.result;
				this.myList00 = this.myList;
			}, error => {
	            this.addErrorFromErrorOfServer("findAll", error);
			 	////console.log(error);
		 	}
		 );
	}

	setMyList(myList : any[]) {
		this.myList = myList;
	}

	edit(msg: Msg) {
		this.clearInfos();
		this.msgService.setMsg(msg);
		this.router.navigate(['/msg_form']);
	}	

	delete(myObj) {
		let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
			, ()=> {
				mythis.beforeCallServer("delete")
				mythis.msgService.deleteById(myObj.id)
					.subscribe(
						data => {
							mythis.afterCallServer("delete", data)
							if(!mythis.isError()) {
								mythis.findAll();
								mythis.myObj = null;
							}
						}, error => {
							mythis.addErrorFromErrorOfServer("delete", error);
							////console.log(error);
						}
					);
			}
			, null 
			);

	}
}
