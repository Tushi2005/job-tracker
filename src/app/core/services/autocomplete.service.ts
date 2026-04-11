import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, startWith, map, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteFilterService {

    filterStringArray(options: string[], searchTerm: string): string[] {
        const filterValue = searchTerm.toLowerCase();
        return options.filter(option => option.toLowerCase().includes(filterValue));
    }

    createFilter(control: AbstractControl, options$: Observable<string[]>): Observable<string[]> {
        return options$.pipe(
            switchMap(options =>
                control.valueChanges.pipe(
                    startWith(''),
                    map((value: string) => this.filterStringArray(options, value ?? ''))
                )
            )
        );
    }
}