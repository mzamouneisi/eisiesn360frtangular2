import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Esn } from '../../../model/esn';
import { EsnService } from '../../../service/esn.service';
import { MereComponent } from '../../_utils/mere-component';
import { EsnFormComponent } from '../esn-form/esn-form.component';

@Component({
	selector: 'app-esn-list',
	templateUrl: './esn-list.component.html',
	styleUrls: ['./esn-list.component.css']
})
export class EsnListComponent extends MereComponent {

	title: string = this.utils.tr("List") + " " + "Esn"

	myList: Esn[];
	myObj: Esn;
	@ViewChild('myObjEditView', {static:false}) myObjEditView:EsnFormComponent ;

	constructor(private esnService: EsnService, private router: Router
		, public utils: UtilsService
		, protected utilsIhm: UtilsIhmService
		, public dataSharingService: DataSharingService) {
		super(utils, dataSharingService);

		this.colsSearch = ["name", "metier", "address", "webSite", "tel", "email"]
	}

	getIdOfCurentObj() {
		return this.myObj != null ? this.myObj.id : -1;
	}
     showForm(myObj: Esn) {
			this.myObj = myObj;
			this.esnService.setEsn(myObj);
			// this.getListResp(myObj);
			// this.refreshEsn(myObj);
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
		return t
	  }

	findAll() {
		this.beforeCallServer("findAll")
		this.esnService.findAll().subscribe(
			data => {
				this.afterCallServer("findAll", data)
				this.myList = data.body.result;
				this.myList00 = this.myList;
				console.log("findAll Esn : " , this.myList)
			}, error => {
	            this.addErrorFromErrorOfServer("findAll", error);
			 	////console.log(error);
		 	}
		 );
	}

	setMyList(myList : any[]) {
		this.myList = myList;
	}

	edit(esn: Esn) {
		this.clearInfos();
		console.log("esn-list set esn", esn )
		this.esnService.setEsn(esn);
		this.refreshEsn(esn);
		this.router.navigate(['/esn_form']);
	}

	refreshEsn(esn: Esn) {
		this.beforeCallServer("refreshEsn")
		this.esnService.refreshEsn(esn).subscribe(
			data => {
				this.afterCallServer("refreshEsn", data)
				this.myObj = data.body.result;
				console.log("refreshEsn Esn : " , this.myObj)
			}, error => {
	            this.addErrorFromErrorOfServer("refreshEsn", error);
			 	////console.log(error);
		 	}
		 );
	}

	delete(myObj) {
		let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
			, ()=> {
				mythis.beforeCallServer("delete")
				mythis.esnService.deleteById(myObj.id)
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
