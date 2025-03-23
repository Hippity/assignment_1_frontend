import { Routes } from '@angular/router';
import { PopularComponent } from './popular/popular.component';
import { GenreComponent } from './genre/genre.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const routes: Routes = [
    { path: '', component: PopularComponent },
    { path: 'popular', component: PopularComponent },
    { path: 'genres', component: GenreComponent },
    { path: 'movie/:id', component: MovieDetailsComponent },
    { path: '**', redirectTo: '' } // Wildcard route for 404 page
];
