import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {Consultant} from '../../../model/consultant';
import {ConsultantService} from '../../../service/consultant.service';
import {Router} from '@angular/router';
import {UtilsService} from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { ConsultantFormComponent } from '../consultant-form/consultant-form.component';

@Component({
    selector: 'app-consultant-list',
    templateUrl: './consultant-list.component.html',
    styleUrls: ['./consultant-list.component.css']
})
export class ConsultantListComponent extends MereComponent {

    @ViewChild('myConsultants', {static: false}) myConsultants;

    title: string = "List Consultants"

    myList: Consultant[];
    myObj: Consultant;
    consultants: Consultant[];
    managerSelected: Consultant = null;
    filtre: string;
    roleForm: FormGroup;
    roles: string[];
    roleFilter: string = "";

    constructor(private consultantService: ConsultantService, private router: Router
        , public utils: UtilsService
        , protected utilsIhm: UtilsIhmService
        , protected dataSharingService: DataSharingService) {
        super(utils, dataSharingService);

        filtre: consultantService.AFF_ALL;

        this.roleForm = new FormGroup({
            roleControl: new FormControl()
        });

        this.loadRoles();

    }

    ngOnInit() {
        this.findAll();
    }

    getTitle() {
        let nbElement = 0
        if (this.myList != null) nbElement = this.myList.length
        //let t = this.title + " (" + nbElement + ")"
        let t = this.utils.tr("List") + " " + this.utils.tr("Consultant") + " (" + nbElement + ")"
        return t
    }

    findAll() {
        this.beforeCallServer("findAll")
        this.consultantService.findAll().subscribe(
            data => {
                this.afterCallServer("findAll", data)
                ////console.log(data)
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

    edit(consultant: Consultant) {
        this.clearInfos();
        consultant.username = consultant.email;
        this.consultantService.setConsultant(consultant);
        this.router.navigate(['/consultant_form']);
    }

    delete(consultant: Consultant) {
        let mythis = this;
        this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer le consultant: " + consultant.fullName, mythis
        , ()=> {
            mythis.beforeCallServer("delete")
            mythis.consultantService.deleteById(consultant.id)
                .subscribe(
                    data => {
                        mythis.afterCallServer("delete", data)
                        if (!this.isError()) {
                            mythis.findAll();
                            if (mythis.managerSelected != null && mythis.managerSelected.id == consultant.id)
                                mythis.managerSelected = null;
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

    getIdOfCurentObj() {
        return this.myObj != null ? this.myObj.id : -1;
    }

    @ViewChild('myObjEditView', {static:false}) myObjEditView:ConsultantFormComponent ;
    showForm(myObj: Consultant) {
        this.myObj = myObj;
        if(this.myObjEditView != null) {
                this.myObjEditView.myObj = this.myObj
                this.myObjEditView.isAdd = 'false';
                this.myObjEditView.ngOnInit()
        }        
    }

    /***
     * used to load all consultant for the select admin
     * @param element
     */
    displayConsultantsOfManager(event: any, element: Consultant) {
        this.managerSelected = element;

        if (this.managerSelected.role != "CONSULTANT") {
            this.consultantService.setManagerSelected(this.managerSelected);
            if (this.myConsultants != null) {
                this.myConsultants.managerFilter = element;
                this.myConsultants.findAll();
            }
        } else {
            this.managerSelected = null;
        }
    }

    onSelectRole(index: number) {
        this.roleFilter = this.roles[index];
        this.findAll();
    }

    /***
     * This method aims to load all roles form back end side
     */
    private loadRoles() {
        this.beforeCallServer("loadRoles")
        this.consultantService.getRoles().subscribe(
            data => {
                this.afterCallServer("loadRoles", data)
                if (data == undefined) this.roles = new Array();
                else {
                    this.roles = data.body.result;
                }
            }, error => {
                this.addErrorFromErrorOfServer("loadRoles", error);
            })
    }


}
