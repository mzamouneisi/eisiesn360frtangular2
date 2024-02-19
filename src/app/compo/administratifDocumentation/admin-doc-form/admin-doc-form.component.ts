import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Consultant } from 'src/app/model/consultant';
import { Document } from 'src/app/model/document';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { ConsultantDoc } from 'src/app/model/consultantDoc';
import { FileUpload } from 'src/app/model/FileUpload';
import { DocumentService } from 'src/app/service/document.service';
import { Notification } from 'src/app/model/notification';
import { DashboardService } from 'src/app/service/dashboard.service';

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
  manager: Consultant = null;
  showAddingCategoryName: boolean;
  adminConsultant: Consultant;
  listSelectedFiles: FileUpload[] = [];

  constructor(
    private consultantService: ConsultantService,
    public utils: UtilsService,
    protected dataSharingService: DataSharingService,
    private utilsIhm: UtilsIhmService,
    private categoryDocService: CategoryDocService,
    private documentService: DocumentService,
    private dashboardService: DashboardService
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit() {
    // le userCoonected est le manager du user manipul�
    this.manager = DataSharingService.userConnected;

    //Si un consultant est connecté il peut partager un document qu'avec son manager
    if (!this.manager.admin) {
      this.selectConsultants.push(this.manager.adminConsultant);
      this.adminConsultant = this.manager.adminConsultant;
      this.isSelectedConsultant = true;
    }
    console.log(this.manager);

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
    console.log(consultant);
    this.selectConsultants.push(this.consultantsList.find(c => c.id == consultant.id));
    this.isSelectedConsultant = true;
  }

  onDeSelectConsultant(consultant: any) {
    this.selectConsultants = this.selectConsultants.filter(c => c.id != consultant.id);
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
        if (!this.manager.admin) {
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
    this.myObj.created_date = new Date();
    this.myObj.last_modified_date = new Date();
    this.myObj.created_by = this.manager;
    this.myObj.stauts = true;
    this.myObj.documents_files = this.listSelectedFiles;
    

    let title = "Document Partagé";
    let message = "Un document " + this.myObj.category.name + " à été partager avec vous";
    let currentUser = DataSharingService.userConnected;
    let notification: Notification = new Notification();
    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.fromUsername = currentUser.username;
    
    if (this.selectedItems.length == this.consultantsList.length && this.isAllSelectedConsultant) {
      this.myObj.for_all_users = true;
    }
    else {
      for (let item of this.selectConsultants) {

        notification.toUsername = item.username;
        this.myObj.notifications.push(notification);

        let consultantDoc: ConsultantDoc = new ConsultantDoc();
        consultantDoc.consultant = item;
        consultantDoc.consultant_id = item.id;
        consultantDoc.created_at = new Date();
        consultantDoc.last_modified_at = new Date();
        this.myObj.consultants_docs.push(consultantDoc);
      }
    }

    this.documentService.save(this.myObj).subscribe(
      data => {
        console.log("dkhal houni");
        this.afterCallServer("onSubmit", data)
        if (!this.isError()) {
          alert("Ajouté avec succés");
        }
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }

  // sendNotification(title, message) {
  //   console.log("sendNotification this.doc=", this.myObj)

  //   // let isManager = this.hasRoleManagerValidate();
  //   let currentUser = DataSharingService.userConnected;

  //   let notification: Notification = new Notification();

  //   notification.createdDate = new Date();
  //   notification.viewed = false;
  //   notification.title = title;
  //   notification.message = message;
  //   notification.currentDocument = this.myObj;
  //   notification.fromUsername = currentUser.username;

  //   for (let consultant of this.myObj.consultants_docs) {
  //     notification.toUsername = consultant.consultant.username;
  //     this.beforeCallServer("sendNotification")
  //     this.dashboardService.addNotificationServer(notification).subscribe((data) => {
  //       this.afterCallServer("sendNotification", data)
  //       let result = data.body.result;
  //       this.dashboardService.getNotifications();

  //     }, error => {
  //       this.addErrorFromErrorOfServer("sendNotification", error);

  //     })
  //   }

  // }

}
