import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationService } from '../../../core/services/application.service';
import { Application, ApplicationStatus } from '../../../core/models/applications.model';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './applications-list.html',
  styleUrls: ['./applications-list.css']
})
export class ApplicationsList implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['companyName', 'position', 'status', 'appliedAt', 'actions'];

  constructor(private applicationService: ApplicationService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: (data) => {
        this.applications = data;
        this.cdr.detectChanges();
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

  // A státusz szöveges megjelenítéséhez (ha kell)
  getStatusLabel(status: ApplicationStatus): string {
    return status;
  }
}