import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { MovieListDetails } from '../models/movieListDetails';
import { MovieCardComponent } from '../components/movie-card/movie-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-my-movies',
  imports: [MovieCardComponent, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './my-movies.component.html',
  styleUrl: './my-movies.component.css'
})
export class MyMoviesComponent implements OnInit {

  private movieService = inject(MovieService);
  
  movies = signal<MovieListDetails[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadMyMovies();
  }
  
  loadMyMovies(): void {
    this.loading.set(true);
    
    this.movieService.getMyMovies().subscribe({
      next: (movies: MovieListDetails[]) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading my movies', error);
        this.loading.set(false);
      }
    });
  }

}
