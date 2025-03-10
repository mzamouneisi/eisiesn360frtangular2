import { Component, ViewChild } from '@angular/core';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { Permission } from "../../model/permission";
import { ConsultantService } from "../../service/consultant.service";
import { PermissionService } from "../../service/permission.service";
import { UtilsService } from "../../service/utils.service";
import { SelectComponent } from '../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../_utils/mere-component';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css']
})
export class PermissionComponent extends MereComponent {

  myList: Array<Permission>;
  roles: string[];
  roleFilter: string = "";

  constructor(private permissionService: PermissionService, private consultantService: ConsultantService
    , public utils: UtilsService
    , public dataSharingService: DataSharingService
    ) {
      super(utils, dataSharingService);

      this.colsSearch = ["featureId"]

  }

  ngOnInit() {
    this.loadRoles();
  }

  ind(i:number) {
    return (this.currentPage - 1) * this.itemsPerPage + i 
  }

  /***
   * used to update item page element selected
   * @param i
   */
  updateList(i: number, action: string, event: any) {
    var checked = event.target.checked 
    console.log("updateList : i, action, checked, this.myList, event : ", i, action, checked, this.myList, event)

    if ('all' == action) {
      this.myList[i].view = checked;
      this.myList[i].add = checked
      this.myList[i].update = checked
      this.myList[i].delete = checked
    }
    if ('isView' == action) {
      this.myList[i].view = checked;
    }
    if ('isAdd' == action) {
      this.myList[i].add = checked

    }
    if ('isUpdate' == action) {
      this.myList[i].update = checked
    }
    if ('isDelete' == action) {
      this.myList[i].delete = checked
    }
    if (checked && this.myList[i].view == false) {
      this.myList[i].view = true;
    }
  }

    /***
   * Used to update permissions (only the current page selected)
   */
     updatePermissions() {
      //console.log(this.myList)
      this.beforeCallServer("updatePermissions")
      this.permissionService.updatePermissions(this.myList).subscribe(
        (data) => {
          this.afterCallServer("updatePermissions", data)
          
        }, error => {
          this.addErrorFromErrorOfServer("updatePermissions", error);
          
        }
      )
    }

  /***
   *
   * This method aims to load all roles form back end side
   */
  private loadRoles() {
    this.beforeCallServer("loadRoles");
    this.consultantService.getRoles().subscribe(
      data => {
        this.afterCallServer("loadRoles", data)
        if (data == undefined) this.roles = new Array();
        else {
          this.roles = data.body.result;
        }
      }, error => {
        this.addErrorFromErrorOfServer("loadRoles", error);
      })
  }
  
  onSelectRole(role: string) {
    this.roleFilter = role;
    this.findAll();
  }

  @ViewChild('compoSelectRole', {static:false}) compoSelectRole:SelectComponent ;
  selectRole(role:string){
      this.compoSelectRole.selectedObj = role;
  }  

  /***
   * used to retrieve all permissions by role from server side
   */
  findAll() {
    let label = "findAll";
    if (this.roleFilter != undefined && this.roleFilter != "") {
      this.beforeCallServer(label)
      this.permissionService.getPermissionsByRole(this.roleFilter)
        .subscribe((data) => {
          this.afterCallServer(label, data)
          this.myList = data.body.result;
          this.myList00 = this.myList;
          //console.log(this.myList)
        }, (error => {
          this.addErrorFromErrorOfServer(label, error);
        }));
    } else {
      this.myList = new Array<Permission>();
      this.myList00 = this.myList;
    }

  }

  setMyList(myList : any[]) {
    this.myList = myList;
  }

  /***
   * used to checked|unchecked all actions
   */
  checkedAll() {
    this.myList.forEach((value, index) => {
      this.myList[index].view = !this.myList[index].view;
      this.myList[index].add = !this.myList[index].add;
      this.myList[index].update = !this.myList[index].update;
      this.myList[index].delete = !this.myList[index].delete;
    })
  }

}
