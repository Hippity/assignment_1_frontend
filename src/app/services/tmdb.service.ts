import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieListResponse } from '../models/apis/moveListReponse';
import { GenreListResponse } from '../models/apis/genreListResponse';
import { MovieDetails } from '../models/movieDetails';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiUrl = 'http://localhost:5193/api/tmdb';

  constructor(private http: HttpClient) {}

  getMovieDetails(movie_id: number = 1): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${this.apiUrl}/movie/${movie_id}`
    );
  }

  getPopularMovies(page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(
      `${this.apiUrl}/movies/popular/${page}`
    );
  }

  searchMovies(query: string, page: number = 1): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(`${this.apiUrl}/movies/search/${query}&${page}`);
  }

  getGenres(): Observable<GenreListResponse> {
    return this.http.get<GenreListResponse>(`${this.apiUrl}/genres`);
  }

  getMoviesByGenre(
    genreId: number,
    page: number = 1
  ): Observable<MovieListResponse> {
    return this.http.get<MovieListResponse>(
      `${this.apiUrl}/movies/genre/${genreId}&${page}`
    );
  }
}
