import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSelect, MatOption } from '@angular/material/select';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models/applications.model';
import { MatTableDataSource } from '@angular/material/table';
import { STATUS_OPTIONS } from '../../../core/models/applications.model';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDetailDialog } from '../application-detail-dialog/application-detail-dialog';
import { MatToolbar } from '@angular/material/toolbar';

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
    MatToolbar
  ],
  templateUrl: './applications-list.html',
  styleUrls: ['./applications-list.css']
})
export class ApplicationsList implements OnInit, AfterViewInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['companyName', 'position', 'status', 'appliedAt', 'actions'];
  dataSource = new MatTableDataSource<Application>(this.applications);
  statusOptions = STATUS_OPTIONS;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: (data) => {
        this.applications = data;
        this.dataSource.data = this.applications;
      },
      error: (err) => console.error('Hiba a betöltéskor', err)
    });
  }

  deleteApplication(id: number): void {
    if (confirm('Biztosan törölni szeretnéd?')) {
      this.applicationService.delete(id).subscribe({
        next: () => this.loadApplications(),
        error: (err) => console.error('Törlési hiba', err)
      });
    }
  }

  getStatusLabel(status: ApplicationStatus): string {
    return status;
  }

  patchStatus(id: number, newStatus: ApplicationStatus): void {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    const payload = { status: newStatus };
    this.applicationService.patch(id, payload).subscribe({
      next: () => {
        app.status = newStatus;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  openDetailDialog(application: Application): void {
    const isMobile = window.innerWidth < 600;
    this.dialog.open(ApplicationDetailDialog, {
      data: application,
      width: isMobile ? '95vw' : '500px',
      maxWidth: isMobile ? '95vw' : '90vw',
      maxHeight: '90vh',
    });
  }
}