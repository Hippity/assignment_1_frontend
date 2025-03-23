import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TmdbService } from '../services/tmdb.service';
import { MovieListResponse } from '../models/apis/moveListReponse';
import { MovieListDetails } from '../models/movieListDetails';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchComponent } from '../components/search/search.component';

@Component({
  selector: 'app-popular',
  imports: [MovieCardComponent, MatIconModule, MatProgressSpinnerModule, MatPaginatorModule, SearchComponent],
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.css'
})
export class PopularComponent implements OnInit {
  private tmdbService = inject(TmdbService);
  
  movies = signal<MovieListDetails[]>([]);
  loading = signal<boolean>(true);
  searchQuery = signal<string>('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(0);
  totalResults = signal<number>(0);
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadPopularMovies();
  }
  
  loadPopularMovies(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    
    this.tmdbService.getPopularMovies(page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies.set(response.results);
        this.currentPage.set(response.page);
        this.totalPages.set(response.total_pages);
        this.totalResults.set(response.total_results);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading popular movies', error);
        this.loading.set(false);
      }
    });
  }
  
  searchMovies(query: string, page: number = 1): void {
    if (!query.trim()) {
      this.loadPopularMovies();
      return;
    }
    
    this.loading.set(true);
    this.currentPage.set(page);
    
    this.tmdbService.searchMovies(query, page).subscribe({
      next: (response: MovieListResponse) => {
        this.movies.set(response.results);
        this.currentPage.set(response.page);
        this.totalPages.set(response.total_pages);
        this.totalResults.set(response.total_results);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error searching movies', error);
        this.loading.set(false);
      }
    });
  }
  
  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on new search
    
    if (query.trim()) {
      this.searchMovies(query);
    } else {
      this.loadPopularMovies();
    }
  }
  
  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    
    if (this.searchQuery().trim()) {
      this.searchMovies(this.searchQuery(), page);
    } else {
      this.loadPopularMovies(page);
    }
  }
}