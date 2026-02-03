import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Consultant } from "../../../model/consultant";
import { ConsultantService } from "../../../service/consultant.service";
import { MereComponent } from '../../_utils/mere-component';
import { SelectComponent } from './select/select.component';

@Component({
	selector: 'app-select-consultant',
	templateUrl: './select-consultant.component.html',
	styleUrls: ['./select-consultant.component.css']
})
export class SelectConsultantComponent extends MereComponent {

	myList: Consultant[];
	elementSelected: Consultant;

	@Input() title: string = "Consultant:";
	@Output() onSelectElement = new EventEmitter<any>();

	@ViewChild('compoSelectConsultant', { static: false }) compoSelectConsultant: SelectComponent;

	constructor(
		private consultantService: ConsultantService,
		public utils: UtilsService,
		public dataSharingService: DataSharingService,
		private utilsIhm: UtilsIhmService
	) {
		super(utils, dataSharingService);
	}

	ngOnInit() {
		this.loadConsultants();
	}

	private loadConsultants(): void {
		this.beforeCallServer(this.title);
		const role = this.dataSharingService.userConnected?.role;
		const userId = this.dataSharingService.userConnected?.id;
		const esnId = this.getEsnId();

		switch (role) {
			case 'MANAGER':
				this.loadManagerConsultants(esnId, userId);
				break;
			case 'RESPONSIBLE_ESN':
				this.loadEsnConsultants(esnId);
				break;
			default:
				this.loadAllConsultants();
		}
	}

	private loadManagerConsultants(esnId: number, userId: number): void {
		this.consultantService.findAllByEsn(esnId).subscribe(
			data => {
				this.afterCallServer(this.title, data);
				const allConsultants = data.body.result || [];
				this.myList = [null, ...allConsultants.filter(c => c.adminConsultantId === userId || c.id === userId)];
			},
			error => this.addErrorFromErrorOfServer(this.title, error)
		);
	}

	private loadEsnConsultants(esnId: number): void {
		this.consultantService.findAllByEsn(esnId).subscribe(
			data => {
				this.afterCallServer(this.title, data);
				this.myList = [null, ...(data.body.result || [])];
			},
			error => this.addErrorFromErrorOfServer(this.title, error)
		);
	}

	private loadAllConsultants(): void {
		this.consultantService.findAll().subscribe(
			data => {
				this.afterCallServer(this.title, data);
				this.myList = [null, ...(data.body.result || [])];
			},
			error => this.addErrorFromErrorOfServer(this.title, error)
		);
	}

	setMyList(myList: Consultant[]): void {
		this.myList = myList;
	}

	getElementLabel(element: Consultant): string {
		return element ? `${element.firstName} ${element.lastName}` : "-- Tous les consultants --";
	}

	onSelectConsultant(consultant: Consultant): void {
		this.elementSelected = consultant;
		this.onSelectElement.emit();
	}

}
