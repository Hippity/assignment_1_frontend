import { Component, computed, Input, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MovieDetails } from '../../models/movieDetails';
import { MovieListDetails } from '../../models/movieListDetails';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  imports: [MatCardModule, MatProgressSpinnerModule,MatIconModule,RouterModule,CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css'
})
export class MovieCardComponent {

  movie = input.required<MovieListDetails>();

 
  releaseDate = computed(() => {
    const movie = this.movie();
    if (!movie.release_date) return 'Unknown';

    return new Date(movie.release_date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  });

  getPosterUrl(): string {
    return this.movie()?.poster_path
      ? `https://image.tmdb.org/t/p/w500${this.movie()?.poster_path}`
      : '/Unkown.jpg';
  }


  votePercentage = computed(() => {
    const movie = this.movie();
    return movie ? Math.round(movie.vote_average * 10) : 0;
  });

  progressValue = computed(() => this.votePercentage());

  movieId = computed(() => this.movie()?.id || 0);
}