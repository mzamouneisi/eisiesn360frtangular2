import { Component, OnInit, ViewChild } from '@angular/core';
import { Esn } from '../../../model/esn';
import { EsnFormComponent } from '../esn-form/esn-form.component';
import { EsnService } from '../../../service/esn.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

@Component({
	selector: 'app-esn-list',
	templateUrl: './esn-list.component.html',
	styleUrls: ['./esn-list.component.css']
})
export class EsnListComponent extends MereComponent {

	title: string = "List Esn"

	myList: Esn[];
	myObj: Esn;
	@ViewChild('myObjEditView', {static:false}) myObjEditView:EsnFormComponent ;

	constructor(private esnService: EsnService, private router: Router
		, public utils: UtilsService
		, protected utilsIhm: UtilsIhmService
		, protected dataSharingService: DataSharingService) {
		super(utils, dataSharingService);
	}

	getIdOfCurentObj() {
		return this.myObj != null ? this.myObj.id : -1;
	}
     showForm(myObj: Esn) {
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
		return t
	  }

	findAll() {
		this.beforeCallServer("findAll")
		this.esnService.findAll().subscribe(
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

	edit(esn: Esn) {
		this.clearInfos();
		this.esnService.setEsn(esn);
		this.router.navigate(['/esn_form']);
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
