import { MovieListDetails } from "../movieListDetails";

export interface MovieListResponse {
    page: number;
    results: MovieListDetails[];
    total_pages: number;
    total_results: number;
  }