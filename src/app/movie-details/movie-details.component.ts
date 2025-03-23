import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieDetails } from '../models/movieDetails';
import { TmdbService } from '../services/tmdb.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-movie-details',
  imports: [MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent implements OnInit {
  private tmdbService = inject(TmdbService);

  movie = signal<MovieDetails | null>(null);
  loading = signal<boolean>(true);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.loadMovieDetails(idParam ? +idParam : -1);
  }

  loadMovieDetails(movieId: number): void {
    this.tmdbService.getMovieDetails(movieId).subscribe({
      next: (response: MovieDetails) => {
        this.movie.set(response);
        this.loading.set(false);
      },
      error: (error) => {
        console.log('No movie details', error);
        this.loading.set(false);
      },
    });
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
