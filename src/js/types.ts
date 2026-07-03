export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalPages: number;
  results: T[];
}

export type BodyPart =
  | "back"
  | "cardio"
  | "chest"
  | "lower arms"
  | "lower legs"
  | "neck"
  | "shoulders"
  | "upper arms"
  | "upper legs"
  | "waist";

export type Muscle =
  | "abductors"
  | "abs"
  | "adductors"
  | "biceps"
  | "calves"
  | "cardiovascular system"
  | "delts"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "lats"
  | "levator scapulae"
  | "pectorals"
  | "quads"
  | "serratus anterior"
  | "spine"
  | "traps"
  | "triceps"
  | "upper back";

export type Equipment =
  | "assisted"
  | "band"
  | "barbell"
  | "body weight"
  | "bosu ball"
  | "cable"
  | "dumbbell"
  | "elliptical machine"
  | "ez barbell"
  | "hammer"
  | "kettlebell"
  | "leverage machine"
  | "medicine ball"
  | "olympic barbell"
  | "resistance band"
  | "roller"
  | "rope"
  | "skierg machine"
  | "sled machine"
  | "smith machine"
  | "stability ball"
  | "stationary bike"
  | "stepmill machine"
  | "tire"
  | "trap bar"
  | "upper body ergometer"
  | "weighted"
  | "wheel roller";

export type FilterType = "Body parts" | "Muscles" | "Equipment";

export interface FilterCategory {
  filter: FilterType;
  name: string;
  imgURL: string;
}

export type FiltersResponse = PaginatedResponse<FilterCategory>;

export interface Exercise {
  _id: string;
  bodyPart: BodyPart;
  equipment: Equipment;
  gifUrl: string;
  name: string;
  target: Muscle;
  description: string;
  rating: number;
  burnedCalories: number;
  time: number;
  popularity: number;
}

export type ExercisesResponse = PaginatedResponse<Exercise>;

export type ExerciseResponse = Exercise;

export interface QuoteResponse {
  author: string;
  quote: string;
}

export interface SubscriptionRequest {
  email: string;
}

export interface SubscriptionResponse {
  message: string;
}

export interface RatingRequest {
  rate: number;
  email: string;
  review?: string;
}

export interface SearchExercisesParams {
  filter?: "muscles" | "bodypart" | "equipment";
  category?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
