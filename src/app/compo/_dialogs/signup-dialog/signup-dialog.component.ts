import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { ConfirmDialogComponent } from '../confirm-dialog.component';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent {

  @ViewChild('tabGroup') tabGroup!: MatTabGroup;

  infos = ""
  errors = ""

  constructor(
    public dialogRef: MatDialogRef<SignupDialogComponent>, public dataSharingService: DataSharingService
    , private consultantService: ConsultantService
    , private esnService: EsnService
    , private utilsIhm: UtilsIhmService
    , private dialog: MatDialog
  ) {
    this.dataSharingService.IsAddEsnAndResp = true;
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

  deleteAllSaved() {
    if (this.dataSharingService.respEsnSaved && this.dataSharingService.respEsnSaved.id) {
      // del cons
      this.consultantService.deleteById(this.dataSharingService.respEsnSaved.id, this.dataSharingService.IsAddEsnAndResp).subscribe(
        data => {
          this.dataSharingService.respEsnSaved = null
        },
        error => {
          this.errors = error
          console.log("ERROR delete respEsnSaved : ", error)
        }
      );
    }

    // del esn 
    if (this.dataSharingService.esnSaved && this.dataSharingService.esnSaved.id) {
      // del cons
      this.esnService.deleteById(this.dataSharingService.esnSaved.id, this.dataSharingService.IsAddEsnAndResp).subscribe(
        data => {
          this.dataSharingService.esnSaved = null
        },
        error => {
          this.errors = error
          console.log("ERROR delete esnSaved : ", error)
        }
      );
    }
  }

  deleteAllSavedAndClose() {
    this.deleteAllSaved()

    let ms = this.errors ? 5000 : 10;

    setTimeout(() => {
      if (!this.errors) {
        this.close();
      }
    }, ms);
  }

  cancel() {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmation',
        message: 'Voulez-vous vraiment tout annuler ?',
        disableClose: true,
        autoFocus: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // L’utilisateur a cliqué "Yes"
        console.log('Confirmed');
        this.deleteAllSavedAndClose();
      } else {
        // L’utilisateur a cliqué "No"
        console.log('Cancelled');
      }
    });

  }

  close(): void {
    this.dialogRef.close();
    this.dataSharingService.IsAddEsnAndResp = false;
  }

  onSubmit(): void {
    console.log("Formulaire confirmé");
    this.close();
  }
}
