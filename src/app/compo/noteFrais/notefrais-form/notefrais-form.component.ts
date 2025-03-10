import { Component, Input, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from 'src/app/service/pdfService';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { createWorker } from 'tesseract.js';
import { Activity } from '../../../model/activity';
import { Category } from '../../../model/category';
import { Consultant } from '../../../model/consultant';
import { NoteFrais } from '../../../model/noteFrais';
import { PayementMode } from '../../../model/payementMode';
import { ActivityService } from '../../../service/activity.service';
import { CategoryService } from '../../../service/category.service';
import { DataSharingService } from '../../../service/data-sharing.service';
import { NoteFraisService } from '../../../service/note-frais.service';
import { PayementModeService } from '../../../service/payement-mode.service';
import { UtilsService } from '../../../service/utils.service';
import { SelectComponent } from '../../_reuse/select-consultant/select/select.component';
import { MereComponent } from '../../_utils/mere-component';

@Component({
  selector: 'app-notefrais-form',
  templateUrl: './notefrais-form.component.html',
  styleUrls: ['./notefrais-form.component.css']
})


export class NotefraisFormComponent extends MereComponent {

  titre = 'Note Frais Form';
  btnSaveTitle = 'Add';
  isAdd: string;
  add = false;

  @Input()
  myObj: NoteFrais;
  categories: Category[];
  payementsModes: PayementMode[];
  activities: Activity[];
  selectedFile: string | ArrayBuffer;

  userConnected: Consultant
  load: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router
    , private noteFraisService: NoteFraisService
    , private activityService: ActivityService
    , private categoryService: CategoryService
    , private payementModeService: PayementModeService
    , private pdfService: PdfService
    , public utils: UtilsService
    , private utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService) {
    super(utils, dataSharingService);

    this.userConnected = dataSharingService.userConnected

  }

  ngOnInit() {
    super.ngOnInit()

    this.initByNoteFrais();
    this.getCategories();
    this.getPayementModes();
    this.getActivities();
  }

  initByNoteFrais() {
    // ////console.log('initByNoteFrais')
    if (this.isAdd == null) {
      this.isAdd = this.route.snapshot.queryParamMap.get('isAdd');
    }
    // tslint:disable-next-line:triple-equals
    if (this.isAdd == 'true') {
      this.btnSaveTitle = this.utils.tr("Add");
      this.titre = this.utils.tr("NewFee");
      this.myObj = new NoteFrais();
    } else {
      this.btnSaveTitle = this.utils.tr("Save");
      this.titre = this.utils.tr("Edit") + " " + this.utils.tr("Frais");
      const noteFraisP: NoteFrais = this.noteFraisService.getNoteFrais();
      // ////console.log('clientP='+clientP);

      if (noteFraisP != null) { this.myObj = noteFraisP; } else if (this.myObj == null) { this.myObj = new NoteFrais(); }
    }
  }

  onSubmit() {
    console.log("*** onSubmit : ", this.myObj);
    this.myObj.activity.consultant = this.userConnected;
    this.myObj.consultant = this.userConnected;
    this.myObj.state = 'Waiting';
    this.beforeCallServer("onSubmit");
    this.noteFraisService.save(this.myObj).subscribe(
      data => {
        this.afterCallServer("onSubmit", data)
        if (!this.isError()) { this.gotoNoteFraisList(); }
      },
      error => {
        this.addErrorFromErrorOfServer("onSubmit", error);
      }
    );
  }


  gotoNoteFraisList() {
    this.clearInfos();
    this.router.navigate(['/notefrais_list']);
  }

  onSelectCategory(category: Category) {
    this.myObj.category = category;
  }

  @ViewChild('compoSelectCategory', { static: false }) compoSelectCategory: SelectComponent;
  selectCategory(category: Category) {
    this.compoSelectCategory.selectedObj = category;
  }

  onSelectPayementMode(payementMode: PayementMode) {
    this.myObj.payementMode = payementMode;
  }

  @ViewChild('compoSelectPayementMode', { static: false }) compoSelectPayementMode: SelectComponent;
  selectPayementMode(payementMode: PayementMode) {
    this.compoSelectPayementMode.selectedObj = payementMode;
  }

  onSelectActivity(activity: Activity) {
    this.myObj.activity = activity;
  }

  @ViewChild('compoSelectActivity', { static: false }) compoSelectActivity: SelectComponent;
  selectActivity(activity: Activity) {
    this.compoSelectActivity.selectedObj = activity;
  }

  getCategories() {
    this.beforeCallServer("getCategories");
    this.categoryService.findAll().subscribe(
      data => {
        this.afterCallServer("getCategories", data)
        this.categories = data.body.result;
        if (data == undefined) {
          this.categories = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectCategory(this.myObj.category);
        }
      }, error => {
        this.addErrorFromErrorOfServer("getCategories", error);
      }
    );
  }

  getCategorieIndexById(categoryId: number): number {
    const res = -1;
    // ////console.log(this.categories);
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == categoryId) {
        return i;
      }
    }
    return res;
  }

  getPayementModes() {
    this.beforeCallServer("getPayementModes");
    this.payementModeService.findAll().subscribe(
      data => {
        this.afterCallServer("getPayementModes", data)
        this.payementsModes = data.body.result;
        if (data == undefined) {
          this.payementsModes = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectPayementMode(this.myObj.payementMode);
        }
      }, error => {
        this.addErrorFromErrorOfServer("getPayementModes", error);
      }
    );
  }

  getPayementModeIndexById(payementModeId: number): number {
    const res = -1;
    // ////console.log(this.payementsModes);
    for (let i = 0; i < this.payementsModes.length; i++) {
      if (this.payementsModes[i].id == payementModeId) {
        return i;
      }
    }
    return res;
  }

  getActivities() {
    this.beforeCallServer("getActivities");
    this.activityService.findAllByConsultant(this.userConnected.id).subscribe(
      data => {
        this.afterCallServer("getActivities", data)
        this.activities = data.body.result;
        if (data == undefined) {
          this.activities = new Array();
        }

        if (this.isAdd != 'true') {
          this.selectActivity(this.myObj.activity);
        }
      }, error => {
        this.addErrorFromErrorOfServer("getActivities", error);
      }
    );
  }

  getActivityIndexById(activityId: number): number {
    const res = -1;
    // ////console.log(this.categories);
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].id == activityId) {
        return i;
      }
    }
    return res;
  }

  calculAmount() {
    // if(this.myObj.amount == null || this.myObj.amount == 0) {
    // }

    let ht = this.myObj.pretax_amount
    let tva = this.myObj.vat
    if (!ht) ht = 0
    if (!tva) tva = 0
    // this.myObj.amount = ht * (1 + (tva / 100))
    // this.myObj.amount = this.utils.round(this.myObj.amount);
    this.myObj.amount = this.utils.round(ht + tva )
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.setContentFile(file)
      this.pdfService.uploadPdf(file).subscribe(
        data => {
          this.myObj.textFilePdf = data.body.result
          this.majChamps();
        }, error => {
          console.log("onFileSelect : error ", error)
        }
      )

    }
  }

  majChamps() {
    let text = this.myObj.textFilePdf
    this.myObj.description = text

    const lines = text.split('\n');
    let line0 = lines[0]
    if (line0.includes("mobile.free.fr") ) {
      this.majChampsFreeMobile(lines)
    }
  }

  majChampsFreeMobile(lines: string[]) {

    this.myObj.country = "France"

    let i = 0
    for (let line of lines) {
      if (i == 0) {
        this.myObj.title = line
      } else if (line.includes(" au capital de ") && !this.myObj.brand_name) {
        this.myObj.brand_name = line.split("–")[0]
      } else if (line.includes("Facture n ") && !this.myObj.invoice_number) {
        let tab = line.split(" ")
        let txt = tab[3]
        this.myObj.invoice_number = txt 
        this.myObj.date = this.utils.convertToDate(tab[5] + " " + tab[6] + " " + tab[7])
      } else if (line.includes("facture HT") && !this.myObj.pretax_amount) {
        let tab = line.split(" ")
        let txt = tab[5].toLowerCase().replace("e", "").replace("€", "")
        this.myObj.pretax_amount = Number.parseFloat(txt) 
      } else if (line.includes("TVA ") && !this.myObj.vat) {
        let tab = line.split(" ")
        let txt = tab[2].toLowerCase().replace("e", "").replace("€", "")
        this.myObj.vat = Number.parseFloat(txt) 
      } 
      i++
    }

    this.calculAmount()
  }

  setContentFile(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.myObj.invoice_file = reader.result;
    };
  }

  onFileSelect00(event) {
    if (event.target.files.length > 0) {
      console.log("onFileSelect 1")
      this.extractDataPdf(event);
      console.log("onFileSelect 2")
      const file: File = event.target.files[0];
      const ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      console.log("onFileSelect 3")
      const x = true;
      if (x) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        console.log("onFileSelect 4")
        reader.onload = () => {
          this.myObj.invoice_file = reader.result;
          console.log("onFileSelect 5")
        };
      } else {
        // alert('Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.');
        this.utilsIhm.info("Oops, Format de fichier erroné, seulement fichier Pdf/png/jpg.", null, null);
        // this.selectedFile.nativeElement.value="";
      }
    }
  }

  async extractDataPdf(file: any) {
    console.log("extractDataPdf 1 file: ", file)
    this.load = true;
    let res = file.target.files[0].name;
    const worker = createWorker({
      logger: m => console.log(m),
    });
    await worker.load();
    console.log("extractDataPdf 2  ")
    await worker.loadLanguage('eng', 'fr');
    console.log("extractDataPdf 3  ")
    await worker.initialize('eng');
    console.log("extractDataPdf 4 file.target.files[0] : ", file.target.files[0])
    const { data: { text } } = await worker.recognize(file.target.files[0]);
    console.log("extractDataPdf 5  ")
    const regexExp = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;
    const caracSpec = /[€$£!@#$%^&*()_+\-=\[\]{};:\\|,.<>\/?]/;

    //Extraire le nom d'enseigne du facture
    const lignes = text.split('\n');
    for (let ligne of lignes) {
      if (!caracSpec.test(ligne) && ligne.length > 3 && ligne.split(' ').length - 1 < 3) {
        this.myObj.brand_name = ligne;
        break;
      }
    }

    console.log("extractDataPdf 6  ")

    let montantFinded = false;
    let montantHTFinded = false;
    let tvaFinded = false;

    //Parcourir la facture ligne par ligne
    //Extraction du DATE / MONTANT / MONTANT HT / TVA
    for (let ligne of lignes) {
      let champs = ligne.split(' ');
      //console.log(champs);
      let pos = 0;
      for (let champ of champs) {
        pos++;

        //Detection et organisation du date 
        if (regexExp.test(champ)) {
          if (champ.indexOf('-') != -1) {
            var date = new Date(champ.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
            this.myObj.date = date;
            //console.log(champ, date);
          }
          else if (champ.indexOf('/') != -1) {
            var splitedDate = champ.split('/');
            if (Number(splitedDate[0]) > 12) {
              this.myObj.date = new Date(splitedDate[1] + '/' + splitedDate[0] + '/' + splitedDate[2]);
            }
            else {
              this.myObj.date = new Date(champ)
            }
          }
        }

        //Detection du montant
        if ((champ.toUpperCase().indexOf("MONTANT") != -1 || champ.toUpperCase().indexOf("TOTAL") != -1 || champ.toUpperCase().indexOf("TTC") != -1 ||
          champ.toUpperCase().indexOf("NET") != -1 || champ.toUpperCase().indexOf("NETAPAYER") != -1 || champ.toUpperCase().indexOf("PAYER") != -1 ||
          champ.toUpperCase().indexOf("TOTALTTC") != -1) && champ.toUpperCase().indexOf("SUBTOTAL") == -1 && !montantFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !montantFinded) {
              //console.log("le mot Montant detecté", champs[i]);
              let montant = "";
              if (champs[i].indexOf('£') != -1) {
                montant = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                montant = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                montant = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                montant = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                montant = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                montant = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                montant = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                montant = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                montant = champs[i].replace(',', '.');
              }
              else {
                montant = champs[i];
              }
              if (!isNaN(Number(montant)) && montant != "") {
                //console.log(Number(montant));
                this.myObj.amount = Number(montant);
                montantFinded = true;
              }
            }
          }
        }

        //Detection du PRIX HORS TAXE
        if ((champ.toUpperCase().indexOf("HT") != -1 || champ.toUpperCase().indexOf("H.T") != -1 || champ.toUpperCase().indexOf("HORS") != -1 ||
          champ.toUpperCase().indexOf("HY") != -1 || champ.toUpperCase().indexOf("SUBTOTAL") != -1) && !montantHTFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !montantHTFinded) {
              //console.log("le mot Montant HT detecté", champs[i]);
              let montantHT = "";
              if (champs[i].indexOf('£') != -1) {
                montantHT = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                montantHT = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                montantHT = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                montantHT = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                montantHT = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                montantHT = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                montantHT = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                montantHT = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                montantHT = champs[i].replace(',', '.');
              }
              else {
                montantHT = champs[i];
              }
              if (!isNaN(Number(montantHT)) && montantHT != "") {
                //console.log(Number(montantHT));
                this.myObj.pretax_amount = Number(montantHT);
                montantHTFinded = true;
              }
            }
          }
        }

        //Detection du TVA
        if ((champ.toUpperCase().indexOf("TVA") != -1 || champ.toUpperCase().indexOf("TAX") != -1) && !tvaFinded) {
          for (let i = pos; i < champs.length; i++) {
            //le champ ne contient ni espace ni champs vide
            if (champs[i] != "" && champs[i] != " " && !tvaFinded) {
              //console.log("TVA detecté", champs[i]);
              let tva = "";
              if (champs[i].indexOf('£') != -1) {
                tva = champs[i].replace('£', '');
              }
              else if (champs[i].indexOf('$') != -1) {
                tva = champs[i].replace('$', '');
              }
              else if (champs[i].indexOf('€') != -1) {
                tva = champs[i].replace('€', '');
              }
              else if (champs[i].indexOf(',') == champs[i].length - 1) {
                tva = champs[i].replace(',', '');
              }
              else if (champs[i].indexOf(' ') == champs[i].length - 1) {
                tva = champs[i].replace(' ', '');
              }
              else if (champs[i].indexOf('*') != -1) {
                tva = champs[i].replace('*', '');
              }
              else if (champs[i].indexOf('#') != -1) {
                tva = champs[i].replace('#', '');
              }
              else if (champs[i].indexOf('¢') != -1) {
                tva = champs[i].replace('¢', '');
              }
              else if (champs[i].indexOf(',') != -1) {
                tva = champs[i].replace(',', '.');
              }
              else {
                tva = champs[i];
              }
              if (!isNaN(Number(tva)) && tva != "" && Number(tva) <= 50) {
                //console.log(Number(tva));
                this.myObj.vat = Number(tva);
                tvaFinded = true;
              }
            }
          }
        }

      }
    }
    //console.log(this.myObj);
    this.load = false;
    await worker.terminate();
  }

}
