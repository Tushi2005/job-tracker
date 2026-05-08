import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { inject, DestroyRef } from '@angular/core';

import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus, STATUS_OPTIONS } from '../../../core/models/applications.model';
import { ApplicationDetailDialog } from '../application-detail-dialog/application-detail-dialog';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { SNACKBAR_DURATION } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatSelect,
    MatOption,
    MatToolbar,
  ],
  templateUrl: './applications-list.html',
  styleUrls: ['./applications-list.css']
})
export class ApplicationsList implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  displayedColumns = ['companyName', 'position', 'status', 'appliedAt', 'actions'];
  dataSource = new MatTableDataSource<Application>();
  statusOptions = STATUS_OPTIONS;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadApplications(): void {
    this.applicationService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.dataSource.data = data,
        error: () => this.showError('Nem sikerült betölteni a jelentkezéseket.')
      });
  }

  patchStatus(id: number, newStatus: ApplicationStatus): void {
    this.applicationService.patch(id, { status: newStatus })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.dataSource.data = this.dataSource.data.map(app =>
            app.id === id ? { ...app, status: updated.status } : app
          );
        },
        error: () => this.showError('Státusz frissítése sikertelen.')
      });
  }

  deleteApplication(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'Biztosan törölni szeretnéd ezt a jelentkezést?' }
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.applicationService.delete(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => this.loadApplications(),
            error: () => this.showError('Törlés sikertelen.')
          });
      });
  }

  openDetailDialog(application: Application): void {
    const isMobile = window.innerWidth < 600;
    this.dialog.open(ApplicationDetailDialog, {
      data: application,
      width: isMobile ? '95vw' : '500px',
      maxWidth: '95vw',
      maxHeight: '90vh',
    });
  }

  logOut(): void {
    this.authService.logout();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Bezár', { duration: SNACKBAR_DURATION });
  }
}
