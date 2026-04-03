import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Application } from '../../../core/models/applications.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-application-detail-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    MatIcon,
    MatDivider
  ],
  templateUrl: './application-detail-dialog.html',
  styleUrl: './application-detail-dialog.css',
})
export class ApplicationDetailDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Application) {}
}
