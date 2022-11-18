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
  composer?: string;
  unaccompanied: boolean;
  accompanied: boolean;
  refrain: string;
  themes: string[];
  category: string;
  happiness: number;
  norfolk?: string;
  lyrics?: string;
};
