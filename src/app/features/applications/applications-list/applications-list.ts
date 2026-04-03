import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationService } from '../../../core/services/application.service';
import { Application } from '../../../core/models/applications.model';

@Component({
  selector: 'app-applications-list',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './applications-list.html',
  styleUrl: './applications-list.css',
})
export class ApplicationsList {
    applications: Application[] = [];
  displayedColumns: string[] = ['companyName', 'position', 'status', 'appliedAt', 'actions'];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.applicationService.getAll().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (err) => {
        console.error('Hiba a jelentkezések betöltésekor', err);
      }
    });
  }

  deleteApplication(id: number): void {
    if (confirm('Biztosan törölni szeretnéd ezt a jelentkezést?')) {
      this.applicationService.delete(id).subscribe({
        next: () => {
          this.loadApplications(); // frissítjük a listát
        },
        error: (err) => {
          console.error('Törlési hiba', err);
        }
      });
    }
  }
}
