import { Component, inject, OnInit, signal } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import { Genre } from '../models/genre';
import { GenreListResponse } from '../models/apis/genreListResponse';
import { single } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GenreCarouselComponent } from '../components/genre-carousel/genre-carousel.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-genre',
  imports: [MatProgressSpinnerModule, GenreCarouselComponent, MatIconModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css'
})
export class GenreComponent implements OnInit {
  private tmdbService = inject(TmdbService);

  genres = signal<Genre[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() : void {
    this.tmdbService.getGenres().subscribe({
      next : (response : GenreListResponse) => {
        this.genres.set(response.genres);
        this.loading.set(false)
      },
      error : (error) => {
        console.log("Error loading genres", error)
        this.loading.set(false)
      }
    })
  }

}
