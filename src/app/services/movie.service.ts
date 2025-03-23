import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieListDetails } from '../models/movieListDetails';
import { MovieDetails } from '../models/movieDetails';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:5193/api/mymovies';

  constructor(private http: HttpClient) { }

  getMyMovies(): Observable<MovieListDetails[]> {
    return this.http.get<MovieListDetails[]>(this.apiUrl);
  }

  getMovieById(id: number): Observable<MovieListDetails> {
    return this.http.get<MovieListDetails>(`${this.apiUrl}/${id}`);
  }

  addToMyMovies(movie: MovieDetails): Observable<MovieListDetails> {
    return this.http.post<MovieListDetails>(this.apiUrl, movie);
  }

  removeFromMyMovies(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}