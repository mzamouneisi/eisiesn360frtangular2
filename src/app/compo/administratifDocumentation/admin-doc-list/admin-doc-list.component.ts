import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileUpload } from 'src/app/model/FileUpload';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { Consultant } from 'src/app/model/consultant';
import { Document } from 'src/app/model/document';
import { Notification } from 'src/app/model/notification';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { ConsultantService } from 'src/app/service/consultant.service';
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
  @ViewChild('shareDocumentView', { static: true }) shareDocumentView: TemplateRef<any>;
  isShowingMyDocuments: boolean = true;
  myDocumentButtonStyle: string = 'btn btn-primary active';
  documentSharedButoonStyle: string = 'btn btn-secondary';
  load: boolean = false;
  isManager: boolean;

  //#region SHOWING MODAL START

  dropdownConsultantSettings: IDropdownSettings = {};
  dropdownCategorySettings: IDropdownSettings = {};
  manager: Consultant = null;
  consultantsList: Consultant[];
  myObj: Document = new Document();
  titre: string = "Ajouter un nouveau document"
  consultantControl = new FormControl();
  selectedConsultants: Consultant[] = [];
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
    protected utilsIhm: UtilsIhmService
  ) {
    super(utils, dataSharingService);
  }
  ngOnInit(): void {

    this.dataSharingService.majManagerOfUserCurent();
    //this.getAllCategoryDoc();
    this.showMyDocuments();

    //#region SHOWING MODAL START

    this.userConnected = this.dataSharingService.userConnected;
    this.isManager = this.userConnected.role == "MANAGER" ? true : false;
    // TODO 
    setTimeout(
      () => {
        this.manager = this.userConnected.adminConsultant ? this.userConnected.adminConsultant : this.userConnected
        console.log("dans setTimeout : manager : ", this.manager)
      }
      , 3000
    )
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

    setTimeout(
      () => {
        this.getAllConsultant();
      }
      , 5000
    )
    

    //#endregion SHOWING MODAL END
  }

  getFilesName(doc : Document): string {
    let s = ""
    if (doc.files != null) {
      for (let f of doc.files) {
        if (s == "") s = f.name
        else s = s + ", " + f.name
      }
    }
    // console.log("*****************Document : s=", s)
    return s;
  }

  getAllCategoryDoc() {
    this.load = true;

    this.categoryDocService.findAll().subscribe(
      data => {
        this.categoryDocList = data.body.result;
        if (!this.isManager) {
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
        console.log("showMyDocuments : data ", data)
        this.myCategoryDocList = data.body.result;
        // if (!this.isManager) {
        //   this.myCategoryDocList = this.myCategoryDocList.filter(c => c.enabled_for_consultant);
        // } else {
        //   this.myCategoryDocList = this.myCategoryDocList.filter(c => c.enabled_for_admin);
        // }
        this.categoryDocList = this.myCategoryDocList;
        this.load = false;

        for (let cat of this.myCategoryDocList) {
          this.showDocumentsOfCategory(cat)
        }

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
        console.log("showDocumentsSharedWithMe : data ", data)
        this.categoryDocList = data.body.result;
        this.load = false;

        for (let cat of this.categoryDocList) {
          this.showDocumentsOfCategory(cat)
        }

      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  showDocumentsOfCategory(category: CategoryDoc) {
    console.log("*** showDocumentsOfCategory deb : category : ", category)
    category.showingDocumentList = true;
    this.load = true;
    this.documentService.findAllByCategory(category.id).subscribe(
      data => {
        console.log("*** showDocumentsOfCategory data : ", data)
        category.documentList = data?.body?.result;

        if (category.documentList) {
          if (this.isShowingMyDocuments) {
            category.documentList = category.documentList.filter(d => d.consultant.id == this.userConnected.id && d.valid);
          }
          else {
            category.documentList = category.documentList.filter(d => d.listConsultantIds.includes(this.userConnected.id) && d.valid);
          }
        }
        this.load = false;
      }, error => {
        this.addErrorFromErrorOfServer('load document', error);
      }
    );
  }

  hideDocumentsOfCategory(category: CategoryDoc) {
    category.showingDocumentList = false;
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
    // un doc peut avoir plusieurs files 

    console.log("downloadFiles doc : ", doc)
    console.log("files : ", doc.files);

    for (let file of doc.files) {
      console.log("file : ", file)
      const linkSource = file.content.toString();
      let typeFile = linkSource.split('/', 2)[0];
      console.log("typeFile : ", typeFile)
      let fileName = file.name;
      console.log("fileName : ", fileName)
      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  deleteDocument(document: Document) {

    console.log("deleteDocument document : ", document);

    let mythis = this;

    this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + document.id, mythis
      , () => {
        mythis.beforeCallServer("delete");
        mythis.documentService.deleteDocument(document)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
                this.showMyDocuments();
                document = null;
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

    this.userConnected = this.dataSharingService.userConnected
    this.esnCurrent = this.userConnected?.esn 
    this.dataSharingService.esnCurrent = this.esnCurrent
    this.dataSharingService.idEsnCurrent = this.esnCurrent?.id 
    this.idEsnCurrent = this.dataSharingService.idEsnCurrent

    console.log("---- getAllConsultant userConnected : ", this.userConnected)
    console.log("---- getAllConsultant idEsnCurrent : ", this.idEsnCurrent)
    this.consultantService.findAllByEsn(this.idEsnCurrent).subscribe(
      data => {
        this.consultantsList = data.body.result;
        console.log("---- getAllConsultant consultantsList : ", this.consultantsList)
      }, error => {
        this.addErrorFromErrorOfServer('consultantSelect', error);
      }
    );

  }

  onSelectConsultant(consultant: any) {
    console.log(consultant);
    this.selectedConsultants.push(this.consultantsList.find(c => c.id == consultant.id));
    this.isSelectedConsultant = true;
  }

  onDeSelectConsultant(consultant: any) {
    this.selectedConsultants = this.selectedConsultants.filter(c => c.id != consultant.id);
    if (this.selectedConsultants.length == 0) {
      this.isSelectedConsultant = false;
    }
  }

  onSelectAllConsultant(items: any) {
    this.selectedConsultants = items;
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
        this.isSelectedFile = true;
        // this.myObj.
      } else {
        // alert('Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.');
        this.utilsIhm.info("Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.", null, null);
        // this.selectedFile.nativeElement.value="";
      }
    }
  }

  now = new Date();
  isExpired(document : Document) : boolean {
    let ok = false ;
    let ed = document.expired_date 
    ed = this.utils.getDate(ed)
    // console.log("*** ed : ", ed )
    if(ed == null ) {
      // console.log("--- 1")
      ok = false  
    }else {
      // console.log("--- 2")
      let now = new Date();
      if(ed.getTime() <= now.getTime()) {
        // console.log("--- 3")
        ok = true 
      }
    }
    return ok  
  }

  classDateExpired(document: Document): string {
    // console.log('Document:', document, 'Expired:', this.isExpired(document));
    return this.isExpired(document) ? 'strike' : '';
  }   

  removeFile(fileDoc: FileUpload) {
    this.listSelectedFiles = this.listSelectedFiles.filter(fl => fl != fileDoc);
    if (this.filesList.length == 0) {
      this.isSelectedFile = false;
    }
  }

  showAddingDocumentModal(categoryDoc: CategoryDoc) {
    if (!this.manager.admin) {
      this.selectedConsultants.push(this.dataSharingService.adminConsultant[this.manager.id]);
      this.adminConsultant = this.dataSharingService.adminConsultant[this.manager.id];
      if (!this.adminConsultant) this.adminConsultant = this.manager.adminConsultant
      console.log("showAddingDocumentModal adminConsultant : ", this.adminConsultant)
      if (!this.adminConsultant && this.manager.role == "RESPONSIBLE_ESN") this.adminConsultant = this.manager
      this.isSelectedConsultant = true;
    }
    this.selectedCategoryDoc = categoryDoc;
    this.myObj.category = categoryDoc;
    if (this.selectedCategoryDoc.management_name == "OTHER_MANAGEMENT") {
      this.showAddingCategoryName = true;
    }
    this.modal.open(this.addingNewDocumentView, { size: 'lg' });
  }

  showShareDocumentModal() {
    this.myObj.category = this.selectedCategoryDoc;
    if (this.selectedCategoryDoc.management_name == "OTHER_MANAGEMENT") {
      this.showAddingCategoryName = true;
    }
    this.modal.open(this.shareDocumentView, { size: 'lg' });
  }

  shareDoc(category : CategoryDoc, document : Document) {
    this.myObj = document;
    this.selectedCategoryDoc = category

    this.selectedConsultants = this.myObj.listConsultant

    this.showShareDocumentModal()
  }

  onShareDocument() {
    if (this.selectedConsultants.length == this.consultantsList.length && this.isAllSelectedConsultant) {
      this.myObj.for_all_users = true;
    }
    else {
      for (let item of this.selectedConsultants) {
        // let consultantDoc: SharedDoc = new SharedDoc();
        // consultantDoc.consultant = item;
        // this.myObj.consultants_docs.push(consultantDoc);
      }
    }
    this.myObj.listConsultant = this.selectedConsultants
    // pour eviter les boucles infinies json 
    this.myObj.categoryId = this.myObj.category.id
    this.myObj.category = null 

    console.log(this.myObj);
    this.documentService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        if (!this.isError()) {
          this.addInfo("Partagé avec succés");
          this.sendNotification("Document Partagé", "Un document " + this.selectedCategoryDoc.name + " à été partager avec vous");
          this.modal.dismissAll(this.shareDocumentView);
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

  onSubmit() {
    if (this.selectedConsultants.length == this.consultantsList.length && this.isAllSelectedConsultant) {
      this.myObj.for_all_users = true;
    }
    else {
      for (let item of this.selectedConsultants) {
        // let consultantDoc: SharedDoc = new SharedDoc();
        // consultantDoc.consultant = item;
        // this.myObj.consultants_docs.push(consultantDoc);
      }
    }
    this.myObj.listConsultant = this.selectedConsultants
    this.myObj.files = this.listSelectedFiles;
    this.myObj.createdDate = new Date();
    this.myObj.lastModifiedDate = new Date();
    this.myObj.consultant = this.manager;
    this.myObj.valid = true;
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

  //#endregion SHOWING MODAL END

}
