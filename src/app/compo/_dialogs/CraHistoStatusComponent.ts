import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CraStatusHisto } from 'src/app/model/cra-status-histo.model';

@Component({
  selector: 'app-cra-histo-status',
  template: `
    <h2 class="center" mat-dialog-title>Historique des status du cra courant</h2>
       <div class="scroll-vertical">
       <table class="table table-bordered table-striped">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Type</th>
                    <th scope="col">User Connected</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let element of myList" >
                    <td>{{ element.dateStatus | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ element.status }}</td>
                    <td>{{ element.typeCra }}</td>
                    <td>{{ element.userConnected?.username }}</td>
                </tr>
            </tbody>
        </table>
        </div>
        <mat-dialog-actions align="center">
          <button mat-button (click)="onOkClick()">OK</button>
        </mat-dialog-actions>
  `,
  styles: [`
    .scroll-vertical {
      height: 300px;             /* hauteur fixe */
      overflow-y: auto;          /* active le scroll vertical */
      overflow-x: auto;        /* hidden : désactive le scroll horizontal */
      border: 1px solid #ccc;    /* optionnel : pour visualiser la zone */
      padding: 10px;             /* marge interne */
      border-radius: 8px;        /* coins arrondis */
    }

  `]
})
export class CraHistoStatusComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CraHistoStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("constr : CraHistoStatusComponent chargé : ", this.data.myList);
    this.myList = this.data.myList
  }

  public myList: CraStatusHisto[]

  ngOnInit() {
    console.log("ngOnit CraHistoStatusComponent chargé : ", this.data.myList);
  }

  onOkClick(): void {
    console.log("onOkClick ")
    this.dialogRef.close();
  }

}
