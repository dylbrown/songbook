export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type Song = {
  name: string;
  alt: string[];
  roud?: number;
  singers: string[];
  date: string;
  composer?: string;
  unaccompanied: boolean;
  accompanied: boolean;
  refrain: string;
  themes: string[];
  categories: string[];
  happiness: number;
  reference?: string;
  lyrics?: string;
  info?: string;
};
