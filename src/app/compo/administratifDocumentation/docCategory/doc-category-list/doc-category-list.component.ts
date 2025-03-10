import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MereComponent } from 'src/app/compo/_utils/mere-component';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { DocCategoryFormComponent } from '../doc-category-form/doc-category-form.component';

@Component({
  selector: 'app-doc-category-list',
  templateUrl: './doc-category-list.component.html',
  styleUrls: ['./doc-category-list.component.css']
})
export class DocCategoryListComponent extends MereComponent {

  title = this.utils.tr("List") + " " + "Categories";

  myList: CategoryDoc[];
  myObj: CategoryDoc;
  @ViewChild('categoryDetail', {static: false}) categoryDetail: DocCategoryFormComponent ;

  constructor(private categoryDocService: CategoryDocService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    this.colsSearch = ["name"]
  }

  ngOnInit() {
    this.findAll();
  }

  findAll() {
    this.beforeCallServer("findAll")
    this.categoryDocService.findAll().subscribe(
      data => {
        this.afterCallServer("findAll", data)
        this.myList = data.body.result;
        this.myList00 = this.myList;
      }, error => {
        this.addErrorFromErrorOfServer("findAll", error);
        //console.log(error);
      }
    );
  }

  setMyList(myList : any[]) {
		this.myList = myList;
	}

  update(category: CategoryDoc) {
    this.categoryDocService.updateCategory(category).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)

        if (this.isError()) { alert("Error")}
      },
      error => {
        //console.log('error:', error);
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }

  edit(category: CategoryDoc) {
    this.clearInfos();
    this.categoryDocService.setDocCategory(category);
    this.router.navigate(['/category_form']);
  }

  getTitle() {
    let nbElement = 0;
    if (this.myList != null) nbElement = this.myList.length;
    let t = this.title + " (" + nbElement + ")";
    return t;
  }

  getIdOfCurentObj() {
    return this.myObj != null ? this.myObj.id : -1;
  }

  // delete(myObj) {
  //   let mythis = this;
	// 	mythis.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
	// 		, ()=> {
  //       mythis.beforeCallServer("delete")
  //       mythis.categoryService.deleteById(myObj.id)
  //         .subscribe(
  //           data => {
  //             mythis.afterCallServer("delete", data)
  //             if (!this.isError()) {
  //               mythis.findAll();
  //               mythis.myObj = null;
  //             }
  //           }, error => {
  //             mythis.addErrorFromErrorOfServer("delete", error);
  //             // //console.log(error);
  //           }
  //         );
	// 		}
	// 		, null
	// 		);

	// }

}
