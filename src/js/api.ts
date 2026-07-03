import axios, { AxiosResponse } from 'axios';
import type {
  BodyPart,
  Equipment,
  FilterType,
  FiltersResponse,
  ExerciseResponse,
  ExercisesResponse,
  Muscle,
  QuoteResponse,
  SubscriptionResponse,
  RatingRequest,
  SearchExercisesParams,
} from './types';

const api = axios.create({
  baseURL: 'https://your-energy.b.goit.study/api',
});

export function getFilterCategories(
  filter: FilterType = 'Muscles',
  page: number = 1,
  limit: number = 12
): Promise<AxiosResponse<FiltersResponse>> {
  return api.get('/filters', { params: { filter, page, limit } });
}

export function getExercisesByMuscle(
  muscle: Muscle,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { muscles: muscle, page, limit } });
}

export function getExercisesByBodyPart(
  bodypart: BodyPart,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { bodypart, page, limit } });
}

export function getExercisesByEquipment(
  equipment: Equipment,
  page: number = 1,
  limit: number = 10
): Promise<AxiosResponse<ExercisesResponse>> {
  return api.get('/exercises', { params: { equipment, page, limit } });
}

export function searchExercises({
  filter,
  category,
  keyword,
  page = 1,
  limit = 10,
}: SearchExercisesParams = {}): Promise<AxiosResponse<ExercisesResponse>> {
  const params: Record<string, string | number> = { page, limit };

  if (filter && category) {
    params[filter] = category;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  return api.get('/exercises', { params });
}

export function getExerciseById(
  id: string
): Promise<AxiosResponse<ExerciseResponse>> {
  return api.get(`/exercises/${id}`);
}

export function addExerciseRating(
  id: string,
  { rate, email, review }: RatingRequest
): Promise<AxiosResponse<ExerciseResponse>> {
  return api.patch(`/exercises/${id}/rating`, { rate, email, review });
}

export function getQuote(): Promise<AxiosResponse<QuoteResponse>> {
  return api.get('/quote');
}

export function subscribe(
  email: string
): Promise<AxiosResponse<SubscriptionResponse>> {
  return api.post('/subscription', { email });
}
