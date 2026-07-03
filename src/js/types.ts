export interface PaginatedResponse<T> {
  page: number | string;
  perPage: number | string;
  totalPages: number;
  results: T[];
}

export interface FilterCategory {
  filter: 'Muscles' | 'Body parts' | 'Equipment';
  name: string;
  imgURL: string;
}

export type FilterCategoriesResponse = PaginatedResponse<FilterCategory>;

export interface Exercise {
  _id: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  name: string;
  target: string;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
}

export type ExercisesResponse = PaginatedResponse<Exercise>;

export interface Quote {
  author: string;
  quote: string;
}

export interface SubscriptionResponse {
  message: string;
}

export interface RatingRequest {
  rate: number;
  email: string;
  review: string;
}

export interface SearchExercisesParams {
  filter?: 'muscles' | 'bodypart' | 'equipment';
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
