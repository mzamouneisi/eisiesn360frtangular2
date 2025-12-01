import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MereComponent } from 'src/app/compo/_utils/mere-component';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
@Component({
  selector: 'app-doc-category-form',
  templateUrl: './doc-category-form.component.html',
  styleUrls: ['./doc-category-form.component.css']
})
export class DocCategoryFormComponent extends MereComponent {

  title = 'Category Form';
  titleList = this.utils.tr("List") + " " + "Categories";
  btnSaveTitle = 'Add';
  isAdd: string;

  myObj: CategoryDoc = new CategoryDoc();

  // @ViewChild('nameHtml', {static: false}) nameHtml: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryDocService: CategoryDocService
              , public utils: UtilsService
              , public dataSharingService: DataSharingService) {
                super(utils, dataSharingService);
              }

  ngOnInit() {
    //this.initByCategory();
    //this.setFocusName();
  }

  // setFocusName(): void {
  //   if (this.nameHtml && this.nameHtml.nativeElement) {
  //     //console.log('focus');
  //     this.nameHtml.nativeElement.focus();
  //   }
  // }

  // initByCategory() {

  //   if (this.isAdd == null) {
  //     this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
  //   }
  //   if (this.isAdd == 'true') {
  //     this.btnSaveTitle = 'Add';
  //     this.title = 'Nouvelle Categorie de Document';
  //     this.myObj = new CategoryDoc();
  //   } else {
  //     this.btnSaveTitle = 'Save';
  //     this.title = 'Edit Category';
  //     const categoryP: CategoryDoc = this.categoryDocService.getDocCategorie();

  //     if (categoryP != null) { this.myObj = categoryP; } else if (this.myObj == null) { this.myObj = new CategoryDoc(); }
  //   }
  // }

  onSubmit() {
    //console.log('onSubmit: myObj=', this.myObj);
    this.beforeCallServer("onSubmit");
    this.categoryDocService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (!this.isError()) { this.gotoCategoriesList(); }
      },
      error => {
        //console.log('error:', error);
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }

  gotoCategoriesList() {
    this.clearInfos();
    this.router.navigate(['/categoryDoc_list']);
  }


}
