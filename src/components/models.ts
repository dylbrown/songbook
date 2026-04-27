export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type Song = {
  name: string;
  date: Date;
  source: string;
  info: string;
  chords: string;
  themes: string[];
  purposes: string[];
  difficulty: number;
  audio: string;
  lyrics: string;
};
