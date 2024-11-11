export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export type Song = {
  name: string;
  firstLines?: string[];
  key?: string;
  chords?: string;
  maker: string[];
  from: string[];
  tags: string[];
};
