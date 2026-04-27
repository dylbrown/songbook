import type { Song } from 'src/components/models';
import { capitalize } from 'vue';
type Results = {
  songs: Song[];
  themes: Map<string, number>;
  purposes: Map<string, number>;
};
let songs_promise: Promise<Results> | null = null;

export async function getSongs(): Promise<Results> {
  if (songs_promise != null) return songs_promise;
  songs_promise = fetch(
    'https://docs.google.com/spreadsheets/d/1Zq-F5FfIdzCwzoXfOKWQN4WBxKdZG54382W44mrySSA/gviz/tq?tqx=out:json&sheet=Responses',
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch spreadsheet!');
      }
      return res.text();
    })
    .then((text) => {
      return JSON.parse(text.substring(47, text.length - 2));
    })
    .then(async (songs_sheet) => {
      const songs: Song[] = [];
      for (const row_obj of songs_sheet.table.rows) {
        const row = row_obj.c;
        const song: Song = {
          name: get(row, 1),
          date: parseDate(get(row, 0).trim()),
          source: get(row, 2),
          info: get(row, 3),
          chords: get(row, 4),
          themes: sanitize(makeList(get(row, 5), ',')),
          purposes: sanitize(makeList(get(row, 6), ',')),
          difficulty: Number(get(row, 7)),
          audio: get(row, 8),
          lyrics: get(row, 9),
        };
        songs.push(song);
      }
      const themes: Map<string, number> = new Map();
      const purposes: Map<string, number> = new Map();
      for (const song of songs) {
        for (const theme of song.themes) {
          const count = themes.get(theme);
          themes.set(theme, 1 + (count ?? 0));
        }
        for (const purpose of song.purposes) {
          const count = purposes.get(purpose);
          purposes.set(purpose, 1 + (count ?? 0));
        }
      }
      return { songs, themes, purposes };
    });
  return songs_promise;
}

function sanitize(strings: Array<string>) {
  return strings.map((s) => capitalize(s));
}

function makeList(value: string | null, separator = ';') {
  if (value == null) return [];
  return value
    .split(new RegExp(' *' + separator + ' *'))
    .filter((s) => s.trim().length > 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(row: any[], i: number): string {
  const item = row[i];
  if (item == null) return '';
  if (item.f != null) return item.f;
  return item.v;
}
function parseDate(dateTime: string): Date {
  const space = dateTime.indexOf(' ');
  const date = dateTime
    .substring(0, space)
    .split('/')
    .map((s) => parseInt(s));
  const time = dateTime
    .substring(space + 1)
    .split(':')
    .map((s) => parseInt(s));

  return new Date(
    date[2] ?? 0,
    (date[1] ?? 1) - 1,
    date[0] ?? 0,
    time[0] ?? 0,
    time[1] ?? 0,
    time[2] ?? 0,
  );
}
