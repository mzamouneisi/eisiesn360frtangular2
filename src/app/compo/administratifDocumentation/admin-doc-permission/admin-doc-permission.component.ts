import { Component } from '@angular/core';
import { CategoryDoc } from 'src/app/model/categoryDoc';
import { CategoryDocService } from 'src/app/service/category-doc.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-admin-doc-permission',
  templateUrl: './admin-doc-permission.component.html',
  styleUrls: ['./admin-doc-permission.component.css']
})
export class AdminDocPermissionComponent extends MereComponent {

  load: boolean = false;
  categoryDocList: CategoryDoc[];

  constructor(
    public utils: UtilsService,
    public dataSharingService: DataSharingService,
    private categoryDocService: CategoryDocService,
    protected utilsIhm: UtilsIhmService,
  ) {
    super(utils, dataSharingService);
  }
  ngOnInit(): void {
    this.getAllCategoryDoc();
  }

  getAllCategoryDoc() {
    this.load = true;

    this.categoryDocService.findAll().subscribe(
      data => {
        this.categoryDocList = data.body.result;
        this.categoryDocList = this.categoryDocList.map(x => ({ ...x, documentList: [] }))
        this.load = false;
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

  updateList(i: number, action: string, event: any) {
    if ('enabled_for_admin' == action) {
      this.categoryDocList[i].enabled_for_admin = event.target.checked;
    }
    if ('enabled_for_consultant' == action) {
      this.categoryDocList[i].enabled_for_consultant = event.target.checked
    }
  }

  updatePermissions() {
    this.load = true;
    console.log(this.categoryDocList);
    this.categoryDocService.updateCategories(this.categoryDocList).subscribe(
      data => {
        this.load = false;
      }, error => {
        this.addErrorFromErrorOfServer('categorySelect', error);
      }
    );
  }

}
