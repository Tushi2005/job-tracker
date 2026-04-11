import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ApplicationService } from '../../../core/services/application.service';
import { ApplicationStatus, STATUS_OPTIONS } from '../../../core/models/applications.model';
import { Observable, startWith, map } from 'rxjs';
import { AutocompleteFilterService } from '../../../core/services/autocomplete.service';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatAutocomplete,
    MatAutocompleteTrigger
  ],
  templateUrl: './application-form.html',
  styleUrls: ['./application-form.css']
})
export class ApplicationForm implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  applicationId?: number;
  pageTitle = 'Új jelentkezés';

  statusOptions = STATUS_OPTIONS;

  filteredCompanies!: Observable<string[]>
  filteredPositions!: Observable<string[]>;

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private autocompleteFilter: AutocompleteFilterService
  ) { }

  ngOnInit(): void {
    this.initForm();
    
    this.filteredCompanies = this.autocompleteFilter.createFilter(
      this.form.get('companyName')!,
      this.applicationService.getCompanies()
    );

    this.filteredPositions = this.autocompleteFilter.createFilter(
      this.form.get('position')!,
      this.applicationService.getPositions()
    )

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.applicationId = +id;
      this.pageTitle = 'Jelentkezés szerkesztése';
      this.loadApplication(this.applicationId);
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      companyName: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      status: new FormControl(ApplicationStatus.Sent, [Validators.required]),
      appliedAt: new FormControl(new Date(), [Validators.required]),
      interviewAt: new FormControl(null),
      jobUrl: new FormControl('', [Validators.pattern('https?://.+')]),
      notes: new FormControl('')
    });
  }

  private loadApplication(id: number): void {
    this.applicationService.getById(id).subscribe({
      next: (app) => {
        this.form.patchValue({
          companyName: app.companyName,
          position: app.position,
          status: app.status,
          appliedAt: new Date(app.appliedAt),
          interviewAt: app.interviewAt ? new Date(app.interviewAt) : null,
          jobUrl: app.jobUrl,
          notes: app.notes
        });
      },
      error: (err) => console.error('Hiba a betöltéskor', err)
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value;

    const jobUrlValue = data.jobUrl && data.jobUrl.trim() !== '' ? data.jobUrl : null;
    const payload = {
      companyName: data.companyName,
      position: data.position,
      status: data.status,           // itt az enum értéke (pl. "Sent")
      appliedAt: data.appliedAt.toISOString(),
      interviewAt: data.interviewAt ? data.interviewAt.toISOString() : null,
      jobUrl: jobUrlValue,
      notes: data.notes
    };

    if (this.isEditMode && this.applicationId) {
      this.applicationService.update(this.applicationId, payload).subscribe({
        next: () => this.router.navigate(['/applications']),
        error: (err) => console.error('Hiba a frissítéskor', err)
      });
    } else {
      this.applicationService.create(payload).subscribe({
        next: () => this.router.navigate(['/applications']),
        error: (err) => console.error('Hiba a mentéskor', err)
      });
    }


  }
}