import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileUpload } from 'src/app/model/FileUpload';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { Consultant } from 'src/app/model/consultant';
import { ConsultantDoc } from 'src/app/model/consultantDoc';
import { Document } from 'src/app/model/document';
import { Notification } from 'src/app/model/notification';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { DocumentService } from 'src/app/service/document.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-admin-doc-list',
  templateUrl: './admin-doc-list.component.html',
  styleUrls: ['./admin-doc-list.component.css']
})
export class AdminDocListComponent extends MereComponent {

  categoryDocList: CategoryDoc[];
  allCategoryDocList: CategoryDoc[] = [];
  myCategoryDocList: CategoryDoc[];
  sharedCategoryDocList: CategoryDoc[] = [];
  title: string = "Mes Documents"
  @ViewChild('addingNewDocumentView', { static: true }) addingNewDocumentView: TemplateRef<any>;
  isShowingMyDocuments: boolean = true;
  myDocumentButtonStyle: string = 'btn btn-primary active';
  documentSharedButoonStyle: string = 'btn btn-secondary';
  load: boolean = false;

  //#region SHOWING MODAL START

  dropdownConsultantSettings: IDropdownSettings = {};
  dropdownCategorySettings: IDropdownSettings = {};
  manager: Consultant = null;
  consultantsList: Consultant[];
  myObj: Document = new Document();
  titre: string = "Ajouter un nouveau document"
  selectedItems: Consultant[] = [];
  consultantControl = new FormControl();
  selectConsultants: Consultant[] = [];
  selectedCategoryDoc: CategoryDoc;
  filesList: File[] = [];
  isSelectedConsultant: boolean = false;
  isSelectedFile: boolean = false;
  isAllSelectedConsultant: boolean;
  showAddingCategoryName: boolean;
  adminConsultant: Consultant;
  listSelectedFiles: FileUpload[] = [];

  //#endregion SHOWING MODAL END

  constructor(
    private consultantService: ConsultantService,
    public utils: UtilsService,
    public dataSharingService: DataSharingService,
    private categoryDocService: CategoryDocService,
    private documentService: DocumentService,
    private modal: NgbModal,
    protected utilsIhm: UtilsIhmService,
    private dashboardService: DashboardService
  ) {
    super(utils, dataSharingService);
  }
  ngOnInit(): void {

    //this.getAllCategoryDoc();
    this.showMyDocuments();

    //#region SHOWING MODAL START

    this.manager = DataSharingService.userConnected;
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

    //#endregion SHOWING MODAL END
  }

  getAllCategoryDoc() {
    this.load = true;

    this.categoryDocService.findAll().subscribe(
      data => {
        this.categoryDocList = data.body.result;
        if (!this.manager.admin) {
          this.categoryDocList = this.categoryDocList.filter(c => c.enabled_for_consultant);
        }
        this.load = false;
        this.showMyDocuments();
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  showMyDocuments() {
    this.load = true;
    this.categoryDocService.findAll().subscribe(
      data => {
        this.myCategoryDocList = data.body.result;
        if (!this.manager.admin) {
          this.myCategoryDocList = this.myCategoryDocList.filter(c => c.enabled_for_consultant);
        } else {
          this.myCategoryDocList = this.myCategoryDocList.filter(c => c.enabled_for_admin);
        }
        for (let category of this.myCategoryDocList) {
          let documentList: Document[] = category.documentList;
          documentList = documentList.filter(d => d.created_by.id == this.manager.id && d.stauts == true);
          category.documentList = documentList;
        }
        this.categoryDocList = this.myCategoryDocList;
        this.load = false;
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  //Retrouver la liste des document partagé avec l'utilisateur qui est connecté
  //l'état du document doit etre active (elle n'est pas supprimé)
  //Retrouver la liste des document partagé avec tous le monde
  showDocumentsSharedWithMe() {
    this.load = true;
    this.categoryDocService.findAll().subscribe(
      data => {
        this.sharedCategoryDocList = data.body.result;
        for (let category of this.sharedCategoryDocList) {
          let docList: Document[] = [];
          for (let doc of category.documentList) {
            if (doc.stauts == true) {
              if (doc.for_all_users) {
                docList.push(doc);
              }
              if (doc.consultants_docs != null) {
                if (doc.consultants_docs.find(c => c.consultant.id == this.manager.id)) {
                  docList.push(doc);
                }
              }
            }
          }
          category.documentList = docList;
        }
        this.categoryDocList = this.sharedCategoryDocList;
        this.load = false;
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  showDocumentsOfCategory(category: CategoryDoc) {
    category.showingDocumentList = true;
  }

  hideDocumentsOfCategory(category: CategoryDoc) {
    category.showingDocumentList = false;
  }

  showAddingDocumentModal(categoryDoc: CategoryDoc) {
    if (!this.manager.admin) {
      this.selectConsultants.push(this.manager.adminConsultant);
      this.adminConsultant = this.manager.adminConsultant;
      this.isSelectedConsultant = true;
    }
    this.selectedCategoryDoc = categoryDoc;
    this.myObj.category = categoryDoc;
    if (this.selectedCategoryDoc.management_name == "OTHER_MANAGEMENT") {
      this.showAddingCategoryName = true;
    }
    this.modal.open(this.addingNewDocumentView, { size: 'lg' });
  }

  shangeShowedListDocument() {
    this.isShowingMyDocuments = !this.isShowingMyDocuments;
    if (this.isShowingMyDocuments) {
      this.showMyDocuments();
      this.title = "Mes Documents";
      this.myDocumentButtonStyle = 'btn btn-primary active';
      this.documentSharedButoonStyle = 'btn btn-secondary';
    } else {
      this.showDocumentsSharedWithMe();
      this.title = "Documents Partagés";
      this.myDocumentButtonStyle = 'btn btn-secondary';
      this.documentSharedButoonStyle = 'btn btn-primary active';
    }
  }

  downloadFiles(doc: Document) {
    console.log(doc.documents_files);
    for (let file of doc.documents_files) {
      const linkSource = file.content.toString();
      let typeFile = linkSource.split('/', 2)[0];
      const downloadLink = document.createElement('a');
      let fileName = '';
      if (typeFile == 'data:image') {
        fileName = 'Doc_' + file.name + '.png';
      } else {
        fileName = 'Doc_' + file.name + '.pdf';
      }
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  deleteDocument(document: Document) {
    let documentForUpdate: Document = new Document();
    documentForUpdate.id = document.id;
    documentForUpdate.title = document.title;
    documentForUpdate.category_name = document.category_name;
    documentForUpdate.expired_date = document.expired_date;
    documentForUpdate.for_all_users = document.for_all_users;
    documentForUpdate.created_date = document.created_date;
    documentForUpdate.last_modified_date = document.last_modified_date;
    documentForUpdate.created_by = document.created_by;
    documentForUpdate.category = document.category;
    documentForUpdate.consultants_docs = document.consultants_docs;
    documentForUpdate.documents_files = document.documents_files;
    documentForUpdate.stauts = false;
    console.log(documentForUpdate);
    let mythis = this;

    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + document.id, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.documentService.deleteDocument(documentForUpdate)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
                this.getAllCategoryDoc();
                mythis.myObj = null;
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
            }
          );
      }
      , null
    );
  }

  //#region SHOWING MODAL START

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
    if (this.selectedItems.length == this.consultantsList.length && this.isAllSelectedConsultant) {
      this.myObj.for_all_users = true;
    }
    else {
      for (let item of this.selectConsultants) {
        let consultantDoc: ConsultantDoc = new ConsultantDoc();
        consultantDoc.consultant = item;
        consultantDoc.consultant_id = item.id;
        consultantDoc.created_at = new Date();
        consultantDoc.last_modified_at = new Date();
        this.myObj.consultants_docs.push(consultantDoc);
      }
    }
    this.myObj.documents_files = this.listSelectedFiles;
    this.myObj.created_date = new Date();
    this.myObj.last_modified_date = new Date();
    this.myObj.created_by = this.manager;
    this.myObj.stauts = true;
    console.log(this.myObj);
    this.documentService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        if (!this.isError()) {
          alert("Ajouté avec succés");
          this.sendNotification("Document Partagé", "Un document " + this.myObj.category.name + " à été partager avec vous");
          this.modal.dismissAll(this.addingNewDocumentView);
          if (this.isShowingMyDocuments) {
            this.showMyDocuments();
          } else {
            this.showDocumentsSharedWithMe();
          }
        }
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }

  sendNotification(title, message) {
    console.log("sendNotification this.doc=", this.myObj)

    // let isManager = this.hasRoleManagerValidate();
    let currentUser = DataSharingService.userConnected;

    let notification: Notification = new Notification();

    notification.createdDate = new Date();
    notification.viewed = false;
    notification.title = title;
    notification.message = message;
    notification.currentDocument = this.myObj;
    notification.fromUsername = currentUser.username;

    for (let consultant of this.myObj.consultants_docs) {
      notification.toUsername = consultant.consultant.username;
      this.beforeCallServer("sendNotification")
      this.dashboardService.addNotificationServer(notification).subscribe((data) => {
        this.afterCallServer("sendNotification", data)
        let result = data.body.result;
        this.dashboardService.getNotifications();

      }, error => {
        this.addErrorFromErrorOfServer("sendNotification", error);

      })
    }

  }

  //#endregion SHOWING MODAL END

}
