import { Component } from '@angular/core';
import { FileUpload } from 'src/app/model/FileUpload';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantFileUpload } from 'src/app/model/consultant_FileUpload';
import { Document } from 'src/app/model/document';
import { Notification } from 'src/app/model/notification';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-admin-doc-multiple',
  templateUrl: './admin-doc-multiple.component.html',
  styleUrls: ['./admin-doc-multiple.component.css']
})
export class AdminDocMultipleComponent extends MereComponent {

  showAddingCategoryName: boolean;
  consultantsList: Consultant[];
  myObj: Document = new Document();
  titre: string = "Ajouter des documents multiples"
  categoryDocList: CategoryDoc[];
  selectedCategoryDoc: CategoryDoc;
  consultantSelected: Consultant;
  fileSelected: File;
  documentConsultantList: any[] = [];
  consultantFileUpload: ConsultantFileUpload;
  consultantFileUploadList: ConsultantFileUpload[] = [];
  isErrorInSelect: boolean = true;
  manager: Consultant;
  isErrorInForm: boolean;

  constructor(
    private consultantService: ConsultantService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService,
    private categoryDocService: CategoryDocService,
    private documentService: DocumentService,
  ) {
    super(utils, dataSharingService);
  }

  ngOnInit(): void {
    this.manager = this.dataSharingService.userConnected;
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

  getAllCategoryDoc() {
    this.categoryDocService.findAll().subscribe(
      data => {
        this.categoryDocList = data.body.result;
        this.categoryDocList = this.categoryDocList.filter(c => c.enabled_for_admin);
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

  onSelectConsultant(consultant: Consultant) {
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.fileSelected = event.target.files[0];
    }
  }

  addNewCosultantDoc() {
    if (this.fileSelected && this.consultantSelected) {

      this.consultantFileUpload = new ConsultantFileUpload();

      let fileDoc: FileUpload = new FileUpload();
      fileDoc.dateUpload = new Date();
      fileDoc.name = this.fileSelected.name;
      fileDoc.size = this.fileSelected.size;
      const reader = new FileReader();
      reader.readAsDataURL(this.fileSelected);
      reader.onload = () => {
        fileDoc.content = reader.result;
      };

      // let consultantDoc: SharedDoc = new SharedDoc();
      // consultantDoc.consultant = this.consultantSelected;

      // this.consultantFileUpload.consultant = consultantDoc;
      this.consultantFileUpload.fileUpload = fileDoc;
      this.consultantFileUploadList.push(this.consultantFileUpload);

      this.fileSelected = null;
      this.consultantSelected = null;
    }
    else {
      this.isErrorInSelect = true;
    }
    console.log(this.consultantFileUploadList);
  }

  deleteElement(element: ConsultantFileUpload) {
    this.consultantFileUploadList = this.consultantFileUploadList.filter(cf => cf != element);
  }

  onSubmit() {
    if (this.consultantFileUploadList.length != 0) {
      for (let consultantFileUpload of this.consultantFileUploadList) {
        let document: Document = new Document();
        document.created_date = new Date();
        document.last_modified_date = new Date();
        // document.created_by = this.manager;
        document.category_name = this.myObj.category_name;
        document.title = this.myObj.title;
        document.category = this.myObj.category
        document.expired_date = this.myObj.expired_date;
        document.valid = true;

        // document.consultants_docs.push(consultantFileUpload.consultant);
        // document.files.push(consultantFileUpload.fileUpload);
        console.log("document Ajouté", document);
        this.documentService.save(document).subscribe(
          data => {
            this.afterCallServer("onSubmit", data)
            if (!this.isError()) {
              alert("Ajouté avec succés");
              this.sendNotification("Document Partagé", "Un document " + this.myObj.category.name + " à été partager avec vous");
              //this.gotoNoteFraisList();
            }
          },
          error => {
            this.addErrorFromErrorOfServer("onSubmit", error);
          }
        );
      }
    }
    else {
      this.isErrorInForm = true;
    }

  }

  sendNotification(title, message) {
    console.log("sendNotification this.doc=", this.myObj)

    // let isManager = this.hasRoleManagerValidate();
    let currentUser = this.dataSharingService.userConnected;

    let notification: Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.currentDocument = this.myObj;
    notification.fromUser = currentUser;

    // for (let consultant of this.myObj.consultants_docs) {
    //   notification.toUser = consultant.consultant;
    //   this.beforeCallServer("sendNotification")
    //   this.dashboardService.addNotificationServer(notification).subscribe((data) => {
    //     this.afterCallServer("sendNotification", data)
    //     let result = data.body.result;
    //     this.dashboardService.getNotifications();

    //   }, error => {
    //     this.addErrorFromErrorOfServer("sendNotification", error);

    //   })
    // }

  }


}
