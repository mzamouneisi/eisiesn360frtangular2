import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ConsultantService } from 'src/app/service/consultant.service';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
// export class InscriptionComponent extends MereComponent {
export class InscriptionComponent implements OnInit {

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  infos = ""
  errors = ""
  loadingDialogRef: MatDialogRef<any> | null = null;

  constructor(private esnService: EsnService, private router: Router
    , public utils: UtilsService
    , protected utilsIhm: UtilsIhmService
    , public dataSharingService: DataSharingService
    // , public dialogRef: MatDialogRef<ConfirmDialogComponent>
    , private consultantService: ConsultantService
    , private dialog: MatDialog
  ) {

    // super(utils, dataSharingService);

    this.dataSharingService.IsAddEsnAndResp = true;
  }


  ngOnInit(): void {

  }


  onEsnSaved() {
    this.goToRespEsnTab()
  }

  goToRespEsnTab() {
    this.tabGroup.selectedIndex = 1;
  }
  goToEsnTab() {
    this.tabGroup.selectedIndex = 0;
  }

  deleteAllSaved(fctOnEnd: Function) {
    let msg = ""
    if (this.dataSharingService.respEsnSaved && this.dataSharingService.respEsnSaved.id) {
      // del cons
      let respEsnName = this.dataSharingService.respEsnSaved.fullName
      msg = "Go to delete resp esn : " + respEsnName
      this.consultantService.deleteById(this.dataSharingService.respEsnSaved.id, this.dataSharingService.IsAddEsnAndResp).subscribe(
        data => {
          this.dataSharingService.respEsnSaved = null
          msg += "\nWas delete resp esn : " + respEsnName
          // del esn 
          if (this.dataSharingService.esnSaved && this.dataSharingService.esnSaved.id) {
            let esnName = this.dataSharingService.esnSaved.name
            msg += "\n" + "Go to delete esn : " + esnName
            this.esnService.deleteById(this.dataSharingService.esnSaved.id, true).subscribe(
              data => {
                this.dataSharingService.esnSaved = null
                msg += "\nWas delete esn : " + esnName
                this.utilsIhm.infoDialog(msg,
                  () => {
                    if (fctOnEnd) fctOnEnd()
                  }
                )
              },
              error => {
                this.errors = error
                console.log("ERROR delete esnSaved : ", error)
                msg += "\n" + JSON.stringify(error)
                this.utilsIhm.infoDialog(msg,
                  () => {
                    if (fctOnEnd) fctOnEnd()
                  }
                )
              }
            );
          } else {
            this.utilsIhm.infoDialog(msg,
              () => {
                if (fctOnEnd) fctOnEnd()
              }
            )
          }
        },
        error => {
          this.errors = error
          console.log("ERROR delete respEsnSaved : ", error)
          msg += "\n" + JSON.stringify(error)
          this.utilsIhm.infoDialog(msg,
            () => {
              if (fctOnEnd) fctOnEnd()
            }
          )
        }
      );
    } else {
      this.utilsIhm.infoDialog(msg,
        () => {
          if (fctOnEnd) fctOnEnd()
        }
      )
    }

  }

  deleteAllSavedAndClose() {
    this.deleteAllSaved(
      () => {
        let ms = this.errors ? 5000 : 10;

        setTimeout(() => {
          if (!this.errors) {
            this.close();
          }
        }, ms);
      }
    )

  }

  cancel() {

    this.utilsIhm.confirmDialog('Voulez-vous vraiment tout annuler ?',
      () => {
        this.deleteAllSavedAndClose();
        this.close();
      },
      () => {

      }
    )

  }

  close(): void {
    this.dataSharingService.IsAddEsnAndResp = false;
    this.dataSharingService.navigateTo("")
  }

  showLoadingDialog(message: string): void {
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, {
      width: '300px',
      disableClose: true,
      data: { message }
    });
  }

  closeLoadingDialog(): void {
    if (this.loadingDialogRef) {
      this.loadingDialogRef.close();
      this.loadingDialogRef = null;
    }
  }

  onSubmit(): void {
    console.log("Formulaire confirmé");

    let label2 = "sendMail"

    const msgLoading = label2 + " en cours...";
    // DEBUT du msg loading
    this.showLoadingDialog(msgLoading);

    this.dataSharingService.sendMailToValidEmailInscription(
      (data2, to, codeEmailToValidate) => {
        console.log(label2 + " data2, to : ", data2, to)
        // FIN du msg loading
        this.closeLoadingDialog();
        this.utilsIhm.infoDialog("Un email a bien été envoyé à " + to,
          () => {
            setTimeout(() => {
              this.close();
            }, 100);
          }
        )
      },
      (error) => {
        console.log(label2 + " error : ", error)
        // FIN du msg loading
        this.closeLoadingDialog();
        this.utilsIhm.infoDialog(label2 + " Erreur envoie email : " + JSON.stringify(error))
      }
    )


  }
}
