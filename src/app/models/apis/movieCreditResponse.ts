import { Cast } from "../cast";
import { Crew } from "../crew";

export interface MovieCreditResponse {
    id: number;
    cast: Cast[];
    crew: Crew[];
  }