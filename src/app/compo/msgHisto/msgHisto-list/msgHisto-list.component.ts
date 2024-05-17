import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MsgHisto } from '../../../model/msgHisto';
import { MsgHistoService } from '../../../service/msgHisto.service';
import { MereComponent } from '../../_utils/mere-component';
import { MsgHistoFormComponent } from '../msgHisto-form/msgHisto-form.component';

@Component({
	selector: 'app-msgHisto-list',
	templateUrl: './msgHisto-list.component.html',
	styleUrls: ['./msgHisto-list.component.css']
})
export class MsgHistoListComponent extends MereComponent {

	title: string = "List MsgHisto"

	myList: MsgHisto[];

	myObj: MsgHisto;
	@ViewChild('myObjEditView', {static:false}) myObjEditView:MsgHistoFormComponent ;

	constructor(private msgHistoService: MsgHistoService, private router: Router
		, public utils: UtilsService
		, protected utilsIhm: UtilsIhmService
		, public dataSharingService: DataSharingService) {
		super(utils, dataSharingService);

		this.colsSearch = ["msg", "type", "typeId", "from", "to", "isReadByTo"]
	}

	getIdOfCurentObj() {
		return this.myObj != null ? this.myObj.id : -1;
	}
     showForm(myObj: MsgHisto, event:any) {
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
		this.msgHistoService.findAll().subscribe(
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

	edit(msgHisto: MsgHisto) {
		this.clearInfos();
		this.msgHistoService.setMsgHisto(msgHisto);
		this.router.navigate(['/msgHisto_form']);
	}	

	delete(myObj) {
		let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
		, ()=> {
			mythis.beforeCallServer("delete")
			mythis.msgHistoService.deleteById(myObj.id)
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
