import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {ConsultantService} from "../../../service/consultant.service";
import {Consultant} from "../../../model/consultant";
import {UtilsService} from 'src/app/service/utils.service';
import {UtilsIhmService} from 'src/app/service/utilsIhm.service';
import { MereComponent } from '../../_utils/mere-component';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { SelectComponent } from './select/select.component';

@Component({
  selector: 'app-select-consultant',
  templateUrl: './select-consultant.component.html',
  styleUrls: ['./select-consultant.component.css']
})
export class SelectConsultantComponent extends MereComponent {
	
	myList: Consultant[];
	elementSelected: Consultant;

	@Input() title: string = "Consultant:";

	//methode output a declencher
	@Output() onSelectElement = new EventEmitter<any>();

	@ViewChild('compoSelectConsultant', {static:false}) compoSelectConsultant:SelectComponent ;

  constructor(private consultantService: ConsultantService
    , public utils: UtilsService
    , protected dataSharingService: DataSharingService
          , private utilsIhm: UtilsIhmService	
          ) { 
			super(utils, dataSharingService);
		  }

  ngOnInit() {	  
		  this.beforeCallServer(this.title)
	    this.consultantService.findAll().subscribe(
    	      data => {
				  this.afterCallServer(this.title, data)
    	        this.myList = data.body.result;
    	      }, error => {
    	        this.addErrorFromErrorOfServer(this.title, error);
    	      }
    	    );	 	  
  }

  setMyList(myList : any[]) {
	this.myList = myList;
}
  
  getElementLabel(element: Consultant) {
	  let s = "";
	  if(element != null) s = element.firstName + " " + element.lastName;
	  return s;
  }
  
  
  	onSelectConsultant(c: Consultant) {
		this.elementSelected = c;
	    
		this.onSelectElement.emit();
	    
	}  
  
}
