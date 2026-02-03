// confirm-dialog.component.ts
import { AfterViewInit, Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onNoClick()">No</button>
      <button #yesButton mat-raised-button color="primary" type="button" (click)="onYesClick()">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent implements AfterViewInit {
  @ViewChild('yesButton', { read: ElementRef }) yesButton: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; autoFocus?: boolean }
  ) {}

  ngAfterViewInit(): void {
    // Wait for dialog to be fully rendered before trying to focus
    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        const shouldAutofocus = this.data?.autoFocus ?? false;
        if (shouldAutofocus && this.yesButton && this.yesButton.nativeElement) {
          this.yesButton.nativeElement.focus();
        }
      }, 50);
    });
  }

  @HostListener('keydown.enter')
  onEnter(): void {
    this.onYesClick();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
