import { Component, OnInit, DestroyRef, inject } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { ApplicationService } from '../../../core/services/application.service';
import { AutocompleteFilterService } from '../../../core/services/autocomplete.service';
import { ApplicationStatus, STATUS_OPTIONS } from '../../../core/models/applications.model';
import { SNACKBAR_DURATION } from '../../../core/constants/app.constants';

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
    MatAutocompleteTrigger,
  ],
  templateUrl: './application-form.html',
  styleUrls: ['./application-form.css']
})
export class ApplicationForm implements OnInit {
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;
  isEditMode = false;
  applicationId?: number;
  pageTitle = 'Új jelentkezés';

  statusOptions = STATUS_OPTIONS;
  filteredCompanies!: Observable<string[]>;
  filteredPositions!: Observable<string[]>;

  constructor(
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private autocompleteFilter: AutocompleteFilterService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupAutocomplete();

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
      companyName: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      status: new FormControl(ApplicationStatus.Sent, Validators.required),
      appliedAt: new FormControl(new Date(), Validators.required),
      interviewAt: new FormControl(null),
      jobUrl: new FormControl('', Validators.pattern('https?://.+')),
      notes: new FormControl(''),
    });
  }

  private setupAutocomplete(): void {
    this.filteredCompanies = this.autocompleteFilter.createFilter(
      this.form.get('companyName')!,
      this.applicationService.getCompanies()
    );
    this.filteredPositions = this.autocompleteFilter.createFilter(
      this.form.get('position')!,
      this.applicationService.getPositions()
    );
  }

  private loadApplication(id: number): void {
    this.applicationService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (app) => this.form.patchValue({
          ...app,
          appliedAt: new Date(app.appliedAt),
          interviewAt: app.interviewAt ? new Date(app.interviewAt) : null,
        }),
        error: () => this.showError('Hiba a betöltéskor.')
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { jobUrl, appliedAt, interviewAt, ...rest } = this.form.value;
    const payload = {
      ...rest,
      appliedAt: appliedAt.toISOString(),
      interviewAt: interviewAt ? interviewAt.toISOString() : null,
      jobUrl: jobUrl?.trim() || null,
    };

    const request$ = this.isEditMode && this.applicationId
      ? this.applicationService.update(this.applicationId, payload)
      : this.applicationService.create(payload);

    request$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/applications']),
        error: () => this.showError(this.isEditMode ? 'Hiba frissítéskor.' : 'Hiba mentéskor.')
      });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Bezár', { duration: SNACKBAR_DURATION });
  }
}
