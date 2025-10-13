import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { Category } from '../../../model/category';
import { CategoryService } from '../../../service/category.service';
import { UtilsService } from '../../../service/utils.service';
import { MereComponent } from '../../_utils/mere-component';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends MereComponent {

  title = this.utils.tr("List") + " " + "Categories";

  myList: Category[];
  myObj: Category;
  @ViewChild('categoryDetail', {static: false}) categoryDetail: CategoryFormComponent ;

  constructor(private categoryService: CategoryService, private router: Router
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
    this.categoryService.findAll().subscribe(
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

  showForm(category: Category) {
    this.myObj = category;
    if (this.categoryDetail != null) {
      this.categoryDetail.myObj = this.myObj
      this.categoryDetail.isAdd = 'false';
      this.categoryDetail.ngOnInit();
    }
  }

  edit(category: Category) {
    this.clearInfos();
    this.categoryService.setCategory(category);
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

  delete(myObj) {
    let mythis = this;
		mythis.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne avec id=" + myObj.id, mythis
			, ()=> {
        mythis.beforeCallServer("delete")
        mythis.categoryService.deleteById(myObj.id)
          .subscribe(
            data => {
              mythis.afterCallServer("delete", data)
              if (!this.isError()) {
                mythis.findAll();
                mythis.myObj = null;
              }
            }, error => {
              mythis.addErrorFromErrorOfServer("delete", error);
              // //console.log(error);
            }
          );
			}
			, null 
			);

	}

}
