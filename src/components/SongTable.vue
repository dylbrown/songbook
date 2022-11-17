<template>
  <q-table title="Songs" :rows="songs" :columns="COLUMNS" row-key="name" style="height: 100%"
    :rows-per-page-options="NO_ROWS" :filter="filter_string" :filter-method="filter" hide-bottom>
    <template v-slot:body-cell-name="props">
      <q-td :props="props">
        <a class="song-name" :href="props.row.norfolk" target="_blank">
          {{ props.row.name }}
        </a>
      </q-td>
    </template>
    <template v-slot:body-cell-category="props">
      <q-td :props="props" style="text-transform: capitalize">
        {{ props.row.category }}
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTableProps } from 'quasar';

type Song = {
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

const NO_ROWS = [0];

const COLUMNS: QTableProps['columns'] = [{
  name: 'name', label: 'Name', field:
    (row) => row.name, required: true, align: 'left', sortable: true,
}, {
  name:
    'category', label: 'Category', field: 'category', required: true, align:
    'right', sortable: true,
}, {
  name: 'roud', label: 'Roud', field: 'roud',
  required: false, align: 'right', sortable: true,
},];

function makeList(value: string | null) {
  if (value == null) return [];
  return value.split(/ *; */);
}

function get(row: any[], i: number): string {
  const item = row[i];
  if (item == null) return '';
  if (item.f != null) return item.f;
  return item.v;
}

export default defineComponent({
  name: 'SongTable',
  props: ['filter_string'],
  async setup() {
    let songs_sheet = await fetch(
      'https://docs.google.com/spreadsheets/d/19_AunvMQBWfs3G91r23vIwdEyqy4g9r2p5I7zGPfWvc/gviz/tq?tqx=out:json&sheet=Responses'
    ).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch spreadsheet!');
      }
      return res.text();
    }).then((text) => {
      return JSON.parse(text.substring(47, text.length - 2));
    });
    let songs: Song[] = [];
    for (const row_obj of songs_sheet.table.rows) {
      const row = row_obj.c;
      let song: Song = {
        name: get(row, 1),
        alt: makeList(get(row, 2)),
        roud: Number(get(row, 3)),
        composer: get(row, 4),
        unaccompanied: get(row, 5).includes('Unaccompanied'),
        accompanied: get(row, 5).includes('Accompanied'),
        refrain: get(row, 6),
        themes: makeList(get(row, 7)),
        category: get(row, 8),
        happiness: Number(get(row, 9)),
        norfolk: get(row, 10),
        lyrics: get(row, 11)
      };
      songs.push(song);
    }
    return { songs, COLUMNS, NO_ROWS };
  },
  methods: {
    filter(
      rows: readonly Song[],
      terms: string,
      _cols: unknown,
      _getCellValue: (col: unknown, row: Song) => unknown
    ) {
      terms = terms.toLowerCase();
      const p = (row: Song): boolean => {
        // Name check
        if (row.name.toLowerCase().includes(terms)) return true;
        // Alt name check
        if (
          row.alt.some((altName) =>
            altName.toLowerCase().includes(terms)
          )
        )
          return true;
        return false;
      };
      return rows.filter(p);
    },
  },
});
</script>
