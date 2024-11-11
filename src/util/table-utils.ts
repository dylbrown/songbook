import { Song } from 'src/components/models';
import * as XLSX from 'xlsx';

let songs_promise: Promise<Song[]> | null = null;

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
/* function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
} */

export async function getSongs(): Promise<Song[]> {
  if (songs_promise != null) return songs_promise;
  songs_promise = fetch(
    'https://dl.dropboxusercontent.com/scl/fi/ip7jgbc9ixbkn7g2nqvjy/Christina-s-Songs.xlsx?rlkey=1z21c01yp0jo6upel4c846afb&e=1&dl=1',
  )
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((res) => {
      return XLSX.read(new Uint8Array(res), {
        type: 'array',
        sheets: "Christina's Songs",
        dense: true,
        cellHTML: false,
        cellText: false,
      });
    })
    .then(async (songs_sheet) => {
      const songs: Song[] = [];
      let rowID = 0;
      for (const row of songs_sheet.Sheets["Christina's Songs"]['!data'] ??
        []) {
        if (rowID++ < 2 || !row) {
          continue;
        }
        const song: Song = {
          name: get(row, 1),
          firstLines: makeList(get(row, 2), '[/]'),
          key: get(row, 3),
          chords: get(row, 4),
          maker: makeList(get(row, 5), '( *[/] *| {4,})', true),
          from: makeList(get(row, 7), '[, ]'),
          tags: makeList(get(row, 8), '[,]'),
        };
        songs.push(song);
      }
      // shuffleArray(songs);
      return songs;
    });
  return songs_promise;
}

function makeList(value: string | null, separator = ';', usesOr = false) {
  if (value == null) return [];
  return value
    .split(new RegExp(usesOr ? separator : ' *' + separator + ' *'))
    .filter((s, i) => s.trim().length > 0 && i % 2 == 0);
}

function get(row: any[], i: number): string {
  const item = row[i];
  if (item == null || item.v == null) return '';
  return item.v;
}
