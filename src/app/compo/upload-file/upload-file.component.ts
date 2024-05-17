import { Component, Input, ViewChild } from '@angular/core';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { FileUpload } from '../../model/FileUpload';
import { MereComponent } from '../_utils/mere-component';
/**
 * HOW TO USE UploadFileComponent as child component:
voir doc/compo-upload-file.txt
 */

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})

export class UploadFileComponent extends MereComponent {

	@Input()
	public files: FileUpload[];	
	
	@Input()
	public title: string;

	@Input()
	public sizeMax: number;
	
	private idUniq : number = 0 ;
	
	@ViewChild('input', {static: false}) input: any;
	
	constructor(protected utilsIhm: UtilsIhmService
		, public utils: UtilsService
		, public dataSharingService: DataSharingService) {	
			super(utils, dataSharingService);

		}
	
	ngOnInit() {
		
		this.idUniq = new Date().getTime() + this.getRandomInt(1, 100);
		////////////console.log("idUniq=", this.idUniq);
		
		if(this.sizeMax == null || this.sizeMax <= 0) {
			this.sizeMax = 10*1024*1024; //10Mo
		}
		
		if(this.title == null) {
			this.title = "Charger Fichier: ";
		}	
	}
	
	selectFile($event): void {
	        this.readThis($event.target);
	}

	
	readThis(inputValue: any): void {
		this.beforeCallServer("readThis"); 
		var f : FileUpload = new FileUpload();
	    var file = inputValue.files[0];
	    var myReader: FileReader = new FileReader();
	    var fileType = inputValue.parentElement.id;
	    myReader.onloadend = (e) => {
			this.afterCallServer("readThis", e)
	        this.getFiles();
	        f.size = file.size;
	        if(f.size <= this.sizeMax){
	        	this.addFile(f);
		        f.dateUpload = new Date();
		        f.dateFile = file.lastModifiedDate;
		        f.name = file.name;
		        f.type = file.type;
		        f.content = myReader.result;	      
		        setTimeout( () => { this.view(this.getFiles().length-1); }, 500 );
	        }else {
				let title = "Error Upload File: readThis(inputValue)"
	        	let msg = "Max size = " + this.sizeMax + ". This file has : " + f.size;
				this.addErrorTitleMsg(title, msg)
	        }
	    }, error => {
			this.addErrorFromErrorOfServer("readThis", error);
		}
	
	    myReader.readAsDataURL(file);
	}
	
	delete(i) {
		var f = this.getFiles()[i];

		this.utilsIhm.confirmYesNo("Voulez vous vraiment supprimer la ligne du fichier: " + f.name, this
		, ()=> {
			this.delFile(i);
		}
		, null 
		);

	}
	
	view(i) {
		var f = this.getFiles()[i];
		var type = f.type;
		////////////console.log("view", i, f.type, "myObj.id="+ this.myObj.id)
		
		if(type.startsWith("image/")){
			var img = document.getElementById(this.getImgId(i));
			if(img)  img["src"] = f.content;
		}
	}
	
	selectImg(i) {
		var f = this.getFiles()[i];
		var type = f.type;
		////////////console.log("selectImg", i, f.type)
		
		if(type.startsWith("image/")){
		  var img = document.getElementById(this.getImgId(i));
		  if(img["currentSrc"] == "") img["src"] = f.content;		  
		  else img["src"] = "";		
		}else {
			this.download(f)
		}
	}	
	
	showAllImg() {
		if(this.getFiles())
		for(var i = 0; i<this.getFiles().length; i++) {
			var f = this.getFiles()[i];
			var type = f.type;
			if(type.startsWith("image/")){
				this.selectImg(i);
			}
		}
	}	
	

	/**
	 * Creates an anchor element `<a></a>` with
	 * the base64 pdf source and a filename with the
	 * HTML5 `download` attribute then clicks on it.
	 * @param  {string} pdf 
	 * @return {void}     
	 */
	download(f: FileUpload) {
	    const linkSource = f.content;
	    const link = document.createElement("a");
	    const fileName = f.name;

	    link.href = linkSource.toString();
	    link.download = fileName;
	    link.click();
	}
	
	  getRandomInt(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
	  }  
	  
		getImgId(i) {
			return 'img_' + i + this.idUniq;
		}
		getFiles() {
			//return this.myObj.files;
			if(this.files == null) this.files = new Array();
			return this.files;
		}
		setFiles(files) {
			//return this.myObj.files;
			this.files = files;
		}
		addFile(f) {
			//return this.myObj.files;
			this.getFiles();
			this.files.push(f);
		}
		delFile(i) {
			this.files.splice(i, 1);
		}	  
	
}
