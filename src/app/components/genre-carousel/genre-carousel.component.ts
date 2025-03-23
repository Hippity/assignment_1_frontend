import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MovieListDetails } from '../../models/movieListDetails';
import { TmdbService } from '../../services/tmdb.service';
import { Genre } from '../../models/genre';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieListResponse } from '../../models/apis/moveListReponse';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-genre-carousel',
  imports: [MovieCardComponent, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './genre-carousel.component.html',
  styleUrl: './genre-carousel.component.css'
})
export class GenreCarouselComponent implements OnInit {
  private tmdbService = inject(TmdbService);

  genre = input.required<Genre>()

  movies = signal<MovieListDetails[]>([]);
  loading = signal<boolean>(true);
  currentIndex = signal(0);


  ngOnInit(): void {
    this.loadGenreMovies();
  }

  loadGenreMovies(): void {
    this.tmdbService.getMoviesByGenre(this.genre().id).subscribe({
      next: (response: MovieListResponse) => {
        this.movies.set(response.results);
        this.loading.set(false)

      },
      error: (error) => {
        console.log("Error loading genres", error)
        this.loading.set(false)
      }
    }
    )
  }

  nextSlide(): void {
    const totalMovies = this.movies().length;
    if (totalMovies === 0) return;
    
    const newIndex = this.currentIndex() + 1;
    this.currentIndex.set(newIndex >= totalMovies - this.visibleMovies() ? 0 : newIndex);
  }

  prevSlide(): void {
    const totalMovies = this.movies().length;
    if (totalMovies === 0) return;
    
    const newIndex = this.currentIndex() - 1;
    this.currentIndex.set(newIndex < 0 ? Math.max(0, totalMovies - this.visibleMovies()) : newIndex);
  }

  visibleMovies(): number {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 3;
    return 5;
  }

}
