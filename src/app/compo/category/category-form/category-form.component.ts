import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../../model/category';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../service/utils.service';
import {CategoryService} from '../../../service/category.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends MereComponent {
  title = 'Category Form';
  btnSaveTitle = 'Add';
  isAdd: string;

  @Input()
  myObj: Category;

  @ViewChild('nameHtml', {static: false}) nameHtml: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService
              , public utils: UtilsService
              , protected dataSharingService: DataSharingService) { 
                super(utils, dataSharingService);
              }

  ngOnInit() {
    this.initByCategory();
    this.setFocusName();
  }

  setFocusName(): void {
    if (this.nameHtml && this.nameHtml.nativeElement) {
      //console.log('focus');
      this.nameHtml.nativeElement.focus();
    }
  }

  initByCategory() {

    // //console.log('initByCategory')

    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    if (this.isAdd == 'true') {
      this.btnSaveTitle = 'Add';
      this.title = 'Nouvelle Categorie de Note de Frais';
      this.myObj = new Category();
    } else {
      this.btnSaveTitle = 'Save';
      this.title = 'Edit Category';
      const categoryP: Category = this.categoryService.getCategorie();

      if (categoryP != null) { this.myObj = categoryP; } else if (this.myObj == null) { this.myObj = new Category(); }
    }
  }

  onSubmit() {
    //console.log('onSubmit: myObj=', this.myObj);
    this.beforeCallServer("onSubmit");
    this.categoryService.save(this.myObj).subscribe(
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
    this.router.navigate(['/category_list']);
  }

}
