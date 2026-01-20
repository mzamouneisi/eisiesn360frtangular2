import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  template: `
    <div class="loading-dialog">
      <mat-spinner diameter="50"></mat-spinner>
      <p>{{ data.message }}</p>
    </div>
  `,
  styles: [`
    .loading-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 20px;
    }
    
    p {
      margin: 0;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  `]
})
export class LoadingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
