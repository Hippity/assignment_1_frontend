import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDetails } from '../models/movieDetails';
import { TmdbService } from '../services/tmdb.service';
import { MovieService } from '../services/movie.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Cast } from '../models/cast';
import { Crew } from '../models/crew';

@Component({
  selector: 'app-movie-details',
  imports: [MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  private tmdbService = inject(TmdbService);
  private movieService = inject(MovieService);
  private snackBar = inject(MatSnackBar);

  movie = signal<MovieDetails | null>(null);
  cast = signal<Cast[]>([]);
  crew = signal<Crew[]>([]);
  creditsLoading = signal<boolean>(true);
  loading = signal<boolean>(true);
  isInMyMovies = signal<boolean>(false);
  addingToMyMovies = signal<boolean>(false);

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.loadMovieDetails(idParam ? +idParam : -1);
  }

  loadMovieDetails(movieId: number): void {
    this.tmdbService.getMovieDetails(movieId).subscribe({
      next: (response: MovieDetails) => {
        this.movie.set(response);
        this.loading.set(false);
        this.loadMovieCredits(movieId);
        this.checkIfInMyMovies(movieId);
      },
      error: (error) => {
        console.log('No movie details', error);
        this.loading.set(false);
      },
    });
  }

  loadMovieCredits(movieId: number): void {
    this.creditsLoading.set(true);
    this.tmdbService.getMovieCredits(movieId).subscribe({
      next: (response) => {
        this.cast.set(response.cast.slice(0, 5));
        this.crew.set(response.crew.slice(0, 5));
        this.creditsLoading.set(false);
      },
      error: (error) => {
        console.log('Error loading credits', error);
        this.creditsLoading.set(false);
      }
    });
  }

  checkIfInMyMovies(movieId: number): void {
    this.movieService.getMovieById(movieId).subscribe({
      next: (movie) => {
        this.isInMyMovies.set(true);
      },
      error: () => {
        this.isInMyMovies.set(false);
      }
    });
  }

  toggleMyMovies(): void {
    if (!this.movie()) return;

    this.addingToMyMovies.set(true);

    if (this.isInMyMovies()) {
      this.movieService.removeFromMyMovies(this.movie()!.id).subscribe({
        next: () => {
          this.isInMyMovies.set(false);
          this.addingToMyMovies.set(false);
          this.snackBar.open('Removed from my movies', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error removing from my movies', error);
          this.addingToMyMovies.set(false);
          this.snackBar.open('Failed to remove from my movies', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.movieService.addToMyMovies(this.movie()!).subscribe({
        next: () => {
          this.isInMyMovies.set(true);
          this.addingToMyMovies.set(false);
          this.snackBar.open('Added to my movies', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error adding to my movies', error);
          this.addingToMyMovies.set(false);
          this.snackBar.open('Failed to add to my movies', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getBackdropUrl(): string {
    return this.movie()?.backdrop_path
      ? `https://image.tmdb.org/t/p/original${this.movie()?.backdrop_path}`
      : '/Unkown.jpg';
  }

  getPosterUrl(): string {
    return this.movie()?.poster_path
      ? `https://image.tmdb.org/t/p/w500${this.movie()?.poster_path}`
      : '/Unkown.jpg';
  }

  getProfileUrl(path: string): string {
    return path
      ? `https://image.tmdb.org/t/p/w185${path}`
      : '/Unkown.jpg';
  }

  getGenres(): string {
    return (
      this.movie()
        ?.genres?.map((genre) => genre.name)
        .join(', ') || ''
    );
  }

  votePercentage = computed(() => {
    const movie = this.movie();
    return movie ? Math.round(movie.vote_average * 10) : 0;
  });

  progressValue = computed(() => this.votePercentage());

  releaseDate = computed(() => {
    const movie = this.movie();
    if (!movie?.release_date) return 'Unknown';

    return new Date(movie.release_date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  });

  runTime = computed(() => {
    if (!this.movie()?.runtime) return '';

    const hours = Math.floor(this.movie()!.runtime / 60);
    const minutes = this.movie()!.runtime % 60;
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  });
}