// app.routes.ts
import { Routes } from '@angular/router';
import { PopularComponent } from './popular/popular.component';
import { GenreComponent } from './genre/genre.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { MyMoviesComponent } from './my-movies/my-movies.component';

export const routes: Routes = [
    { path: '', component: PopularComponent },
    { path: 'popular', component: PopularComponent },
    { path: 'genres', component: GenreComponent },
    { path: 'movie/:id', component: MovieDetailsComponent },
    { path: 'my-movies', component: MyMoviesComponent },
    { path: '**', redirectTo: '' }
];