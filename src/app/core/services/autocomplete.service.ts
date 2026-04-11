import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutocompleteFilterService {

    filterStringArray(options: string[], searchTerm: string): string[] {
        const filterValue = searchTerm.toLowerCase();
        return options.filter(option => option.toLowerCase().includes(filterValue));
    }

    createFilter(control: AbstractControl, options: string[]): Observable<string[]> {
        return control.valueChanges.pipe(
            startWith(''),
            map((value: string) => this.filterStringArray(options, value ?? ''))
        );
    }
}