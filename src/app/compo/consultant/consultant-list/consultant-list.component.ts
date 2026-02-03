import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Consultant } from '../../../model/consultant';
import { ConsultantService } from '../../../service/consultant.service';
import { MereComponent } from '../../_utils/mere-component';
import { ConsultantFormComponent } from '../consultant-form/consultant-form.component';

@Component({
    selector: 'app-consultant-list',
    templateUrl: './consultant-list.component.html',
    styleUrls: ['./consultant-list.component.css']
})
export class ConsultantListComponent extends MereComponent {

    @ViewChild('myConsultants', { static: false }) myConsultants;

    title: string = "List Consultants"

    myList: Consultant[];
    myObj: Consultant;
    consultants: Consultant[];
    managerSelected: Consultant = null;
    filtre: string;
    roleForm: FormGroup;
    roles: string[];
    roleFilter: string = "";
    isMyConsultantsView: boolean = false;

    constructor(private consultantService: ConsultantService
        , private esnService: EsnService
        , private router: Router
        , private route: ActivatedRoute
        , public utils: UtilsService
        , protected utilsIhm: UtilsIhmService
        , public dataSharingService: DataSharingService) {
        super(utils, dataSharingService);

        filtre: consultantService.AFF_ALL;

        this.roleForm = new FormGroup({
            roleControl: new FormControl()
        });

        this.loadRoles();

        this.colsSearch = ["fullName", "username", "tel", "esn", "role", "level"]

    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            this.isMyConsultantsView = params.get('myConsultants') === 'true';
            this.findAll();
        });
    }

    getTitle() {
        let nbElement = 0
        if (this.myList != null) nbElement = this.myList.length
        //let t = this.title + " (" + nbElement + ")"
        let t = this.utils.tr("List") + " " + this.utils.tr("Consultant") + " (" + nbElement + ")"
        if (this.isMyConsultantsView) {
            t = this.utils.tr("Mes Consultants") + " (" + nbElement + ")";
        }
        return t
    }

    findAll() {
        this.beforeCallServer("findAll")
        if (this.isMyConsultantsView && this.dataSharingService.userConnected) {
            const user = this.dataSharingService.userConnected;
            const esnId = user?.esn?.id || user?.esnId;
            this.consultantService.findAllByEsn(esnId).subscribe(
                data => {
                    this.afterCallServer("findAll", data)
                    console.log("data : ", data)
                    // Filter consultants where adminConsultantId = userConnected.id, include manager himself
                    const allConsultants = data.body.result || [];
                    this.myList = allConsultants.filter(c => c.adminConsultantId === user.id || c.id === user.id);
                    console.log("myList : ", this.myList)
                    this.myList00 = this.myList;

                    // this.dataSharingService.addEsnInConsultantList(this.myList )
                    this.esnService.majEsnOnConsultants(this.myList, ()=>{} , (error)=>{
                        this.addErrorTxt(JSON.stringify(error))
                    })

                }, error => {
                    this.addErrorFromErrorOfServer("findAll", error);
                    ////console.log(error);
                }
            );
            return;
        }

        this.consultantService.findAll().subscribe(
            data => {
                this.afterCallServer("findAll", data)
                console.log("data : ", data)
                this.myList = data.body.result;
                console.log("myList : ", this.myList)
                this.myList00 = this.myList;

                // this.dataSharingService.addEsnInConsultantList(this.myList )
                this.esnService.majEsnOnConsultants(this.myList, ()=>{} , (error)=>{
                    this.addErrorTxt(JSON.stringify(error))
                })

            }, error => {
                this.addErrorFromErrorOfServer("findAll", error);
                ////console.log(error);
            }
        );
    }

    setMyList(myList: any[]) {
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
            , () => {
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

    @ViewChild('myObjEditView', { static: false }) myObjEditView: ConsultantFormComponent;
    showFormPure(myObj: Consultant) {
        this.consultantService.setConsultant(myObj)

        this.myObj = myObj;
        // console.log("role", myObj.role)
        if (this.myObjEditView != null) {

            this.myObjEditView.myObj = myObj
            this.myObjEditView.isAdd = 'false';
            this.myObjEditView.ngOnInit()

            this.myObjEditView.selectRole(myObj.role)
            this.myObjEditView.selectEsn(myObj.esn)

        }
    }

    showForm(myObj: Consultant) {
        if (myObj.role != "ADMIN" && !myObj.esn) {
            this.esnService.majEsnOnConsultant(myObj, () => {
                this.showFormPure(myObj);
            }, (error) => {
                this.addErrorTxt(JSON.stringify(error))
            }
            )
        } else {
            this.showFormPure(myObj);
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
