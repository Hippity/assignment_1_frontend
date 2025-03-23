import { CommonModule } from '@angular/common';
import { Component, effect, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() search = new EventEmitter<string>();

  searchText = signal<string>('');

  @Input() set initialQuery(value: string) {
    this.searchText.set(value);
  }

  @Input() placeholder: string = 'Search for movies...';

  constructor() {}

  onSearchSubmit(): void {
    this.search.emit(this.searchText());
  }

  clearSearch(): void {
    this.searchText.set('');
    this.search.emit('');
  }

}
