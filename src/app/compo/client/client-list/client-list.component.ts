import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Client } from '../../../model/client';
import { ClientService } from '../../../service/client.service';
import { MereComponent } from '../../_utils/mere-component';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
	selector: 'app-client-list',
	templateUrl: './client-list.component.html',
	styleUrls: ['./client-list.component.css']
})
export class ClientListComponent extends MereComponent {

	title: string = this.utils.tr("List") + " " + "Client"

	myList: Client[];

	myObj: Client;
	@ViewChild('myObjEditView', { static: false }) myObjEditView: ClientFormComponent;

	getIdOfCurentObj() {
		return this.myObj != null ? this.myObj.id : -1;
	}
	showForm(myObj: Client) {
		this.myObj = myObj;
		if (this.myObjEditView != null) {
			this.myObjEditView.myObj = this.myObj
			this.myObjEditView.isAdd = 'false';
			this.myObjEditView.ngOnInit()
		}
	}

	constructor(private clientService: ClientService, private router: Router
		, public utils: UtilsService
		, protected utilsIhm: UtilsIhmService
		, public dataSharingService: DataSharingService) {
		super(utils, dataSharingService);

		this.colsSearch = ["name ", "metier", "address", "webSite", "nameResp", "telResp", "emailResp"]

	}

	ngOnInit() {
		this.findAll();
	}

	getTitle() {
		let nbElement = 0
		if (this.myList != null) nbElement = this.myList.length
		let t = this.title + " (" + nbElement + ")"
		return t
	}

	findAll() {
		this.beforeCallServer("findAll")
		this.clientService.findAll(this.getEsnId()).subscribe(
			data => {
				this.afterCallServer("findAll", data)
				this.myList = data.body.result;
				this.myList00 = this.myList;
				////console.log(this.myList)
			}, error => {
				this.addErrorFromErrorOfServer("findAll", error);
				////console.log(error);
			}
		);
	}

	setMyList(myList: any[]) {
		this.myList = myList;
	}

	edit(client: Client) {
		this.clearInfos();
		this.clientService.setClient(client);
		this.router.navigate(['/client_form']);
	}

	delete(myObj) {
		let mythis = this;
		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
			, () => {
				mythis.beforeCallServer("delete")
				mythis.clientService.deleteById(myObj.id)
					.subscribe(
						data => {
							mythis.afterCallServer("delete", data)
							if (!mythis.isError()) {
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
