import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {

  @Input() objectName : string = "Element" ;   //name of objects class
  @Input() ObjectPropName! : string ; //name of the property visible in list select
  @Input() myList : any = [] ;
  @Input() initObj: any;  //on create select 
  @Input() objCaller!: any; 
  @Input() onChangeCaller!: string; 
  @Input() disbaleit: any;  //on create select
  @Input() selectId: string;
  selectedObjId: number = 0;       //when change selection
  selectedObj: any = null;       //when change selection

  constructor() { }

  ngOnInit(): void {
    if(this.ObjectPropName) {
      this.selectedObjId = this.initObj ? this.initObj.id : 0;
      // this.onChange(this.selectedObjId);
      // this.selectedObj = this.getObjFromId(this.selectedObjId);
      // this.setObjInCaller(this.selectedObj);
      // //////////console.log("****ngOnInit ", this.initObj, this.selectedObjId, this.selectedObj);
      // this.selectedObj = this.initObj;
    }
    else {
      this.selectedObjId = this.initObj;
    }
  }

  getObjDisplay(obj:any){
    if(this.ObjectPropName) {
      return obj ? obj[this.ObjectPropName] : "";
    }
    else {
      return obj;
    }
  }

  getObjValue(obj:any){
    if(this.ObjectPropName) {
      return obj ? obj.id : -1;
    }
    else {
      return obj;
    }
  }

   onChange00(event:any){

    this.selectedObjId=event;
    this.selectedObj = this.ObjectPropName ? null : event;
    if(this.ObjectPropName && this.myList) {
      this.selectedObj = this.getObjFromId(event);
    }
  } 

  onChange(event:any){

    this.onChange00(event)

    // //////////console.log("******* onChange: ", event, this.selectedObj, this.myList);
    this.setObjInCaller(this.selectedObj);
  }

  setObjInCaller(objSel: any){
    if(objSel) {
      if(this.objCaller && this.onChangeCaller) this.objCaller[ this.onChangeCaller] (objSel);
    }
  }

  getObjFromId(id: number) {
    let objSel = this.ObjectPropName ? null : id;
    if(this.ObjectPropName && this.myList) {
      for(let obj of this.myList) {
        if(obj.id == id) {objSel = obj; break;}
      }
    }
    return objSel;
  }



}
