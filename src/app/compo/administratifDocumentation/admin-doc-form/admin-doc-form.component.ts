import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileUpload } from 'src/app/model/FileUpload';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { Consultant } from 'src/app/model/consultant';
import { Document } from 'src/app/model/document';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { ConsultantService } from 'src/app/service/consultant.service';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-admin-doc-form',
  templateUrl: './admin-doc-form.component.html',
  styleUrls: ['./admin-doc-form.component.css']
})
export class AdminDocFormComponent extends MereComponent {

  dropdownConsultantSettings: IDropdownSettings = {};
  dropdownCategorySettings: IDropdownSettings = {};

  consultantsList: Consultant[] = [];
  myObj: Document = new Document();
  titre: string = "Ajouter un nouveau document"
  selectedItems: Consultant[] = [];
  consultantControl = new FormControl();
  selectConsultants: Consultant[] = [];
  categoryDocList: CategoryDoc[];
  selectedCategoryDoc: CategoryDoc;
  filesList: File[] = [];
  isSelectedConsultant: boolean = false;
  isSelectedFile: boolean = false;
  isAllSelectedConsultant: boolean;
  connectedUser: Consultant = null;
  showAddingCategoryName: boolean;
  adminConsultant: Consultant;
  listSelectedFiles: FileUpload[] = [];
  isSuperior: boolean = false;

  constructor(
    private consultantService: ConsultantService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService,
    private utilsIhm: UtilsIhmService,
    private categoryDocService: CategoryDocService,
    private documentService: DocumentService,

  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    // le userCoonected est le manager du user manipul�
    this.connectedUser = this.dataSharingService.userConnected;
    this.isSuperior = this.connectedUser.role !== "CONSULTANT";

    //Si un consultant est connecté il peut partager un document qu'avec son manager
    if (!this.isSuperior) {
      this.selectConsultants.push(this.dataSharingService.adminConsultant[this.connectedUser.id]);
      this.adminConsultant = this.dataSharingService.adminConsultant[this.connectedUser.id];
      this.isSelectedConsultant = true;
    }
    console.log(this.connectedUser);

    this.dropdownConsultantSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownCategorySettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.getAllConsultant();
    this.getAllCategoryDoc();
  }

  getAllConsultant() {
    this.consultantService.findAll().subscribe(
      data => {
        this.consultantsList = data.body.result;
      }, error => {
        this.addErrorFromErrorOfServer('consultantSelect', error);
      }
    );
  }

  onSelectConsultant(consultant: any) {
    this.selectConsultants.push(this.consultantsList.find(c => c.id == consultant.id));
    this.myObj.listConsultantIds.push(consultant.id);
    this.isSelectedConsultant = true;
  }

  onDeSelectConsultant(consultant: any) {
    this.selectConsultants = this.selectConsultants.filter(c => c.id != consultant.id);
    this.myObj.listConsultantIds = this.myObj.listConsultantIds.filter(c => c != consultant.id);
    if (this.selectConsultants.length == 0) {
      this.isSelectedConsultant = false;
    }
  }

  onSelectAllConsultant(items: any) {
    this.selectedItems = items;
    this.isSelectedConsultant = true;
    this.isAllSelectedConsultant = true;
  }

  getAllCategoryDoc() {
    this.categoryDocService.findAll().subscribe(
      data => {
        this.categoryDocList = data.body.result;
        if (!this.isSuperior) {
          this.categoryDocList = this.categoryDocList.filter(c => c.enabled_for_consultant)
        } else {
          this.categoryDocList = this.categoryDocList.filter(c => c.enabled_for_admin);
        }
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  onSelectCategoryDoc(categoryDoc: CategoryDoc) {
    if (categoryDoc.management_name == "OTHER_MANAGEMENT") {
      this.showAddingCategoryName = true;
    } else {
      this.showAddingCategoryName = false;
    }
    this.myObj.category = categoryDoc;
    //this.myObj.categoryId = categoryDoc.id;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      let fileDoc: FileUpload = new FileUpload();
      fileDoc.dateUpload = new Date();
      const file: File = event.target.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      fileDoc.name = file.name;
      fileDoc.size = file.size;
      const x = true;
      if (x) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          fileDoc.content = reader.result;
        };
        this.listSelectedFiles.push(fileDoc);
      } else {
        // alert('Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.');
        this.utilsIhm.info("Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.", null, null);
        // this.selectedFile.nativeElement.value="";
      }
    }
  }

  removeFile(fileDoc: FileUpload) {
    this.listSelectedFiles = this.listSelectedFiles.filter(fl => fl != fileDoc);
    if (this.filesList.length == 0) {
      this.isSelectedFile = false;
    }
  }

  onSubmit() {
    this.myObj.createdDate = new Date();
    this.myObj.lastModifiedDate = new Date();
    this.myObj.consultant = this.connectedUser;
    this.myObj.files = this.listSelectedFiles

    console.log("onSubmit myObj.files 1 : ", this.myObj.files)

    if (this.myObj.files != null ) {
      for (let f of this.myObj.files) {
        console.log("onSubmit f 1 : ", f)
        f.documentId = this.myObj.id;
        console.log("onSubmit f 2 : ", f)
      }
    }

    console.log("onSubmit myObj.files 2 : ", this.myObj.files)

    if (this.selectedItems.length == this.consultantsList.length && this.isAllSelectedConsultant) {
      console.log("onSubmit set listConsultant vide ")
      this.myObj.for_all_users = true;
      this.myObj.listConsultantIds = [];
      this.myObj.listConsultant = [];
    }

    console.log(this.myObj);

    this.documentService.save(this.myObj).subscribe(
      data => {
        // console.log(JSON.stringify(this.myObj));

        this.afterCallServer("onSubmit", data)
        if (!this.isError()) {
          this.navigateTo('admindoc_list')
        }
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }
}
