<template>
  <q-table :rows="songs" :columns="COLUMNS" row-key="name" card-class="song-table" :rows-per-page-options="NO_ROWS"
    :filter="[filter_string]" :filter-method="filter" hide-bottom :pagination="{ sortBy: 'date', descending: true }">
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand"
            :icon="props.expand ? 'expand_more' : 'chevron_right'" />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props" class="table-cell" :class="{
    small: col.value.includes('\n') && col.name != 'name'
  }">
          {{ col.value }}
          <div v-if="col.name == 'name'" class="composer">{{ props.row.composer }}</div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props" class="expand"
        v-if="props.row.maker.length > 0 || props.row.chords.length > 0">
        <q-td colspan="100%">
          <div class="details">
            <div class="song-info" v-if="props.row.maker.length > 0">
              <div class="label">Maker</div>
              <div class="info-items">
                {{ props.row.maker.join('\n') }}
              </div>
            </div>
            <div class="lbar" v-if="props.row.chords.length > 0">
              <q-icon name="piano" size="sm" />&nbsp;
              {{ props.row.chords }}
            </div>
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props" class="expand" v-if="props.row.firstLines.length > 0">
        <q-td colspan="100%">
          <p class="firstLines" v-html="props.row.firstLines.join('<br><br>')"></p>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QTableProps } from 'quasar';
import { Song } from './models';
import { getSongs } from 'src/util/table-utils';

const NO_ROWS = [0];

function removeThe(s: string): string {
  if (s.startsWith('The')) return s.substring(4);
  return s;
}

const COLUMNS: QTableProps['columns'] = [{
  name: 'name', label: 'Name', field: 'name', required: true, align: 'left', sortable: true,
  sort: (a, b, _rowA, _rowB) => {
    return removeThe(a).localeCompare(removeThe(b));
  }
}, {
  name:
    'key', label: 'Key', field: 'key', required: false, align:
    'center', sortable: true,
}, {
  name:
    'from', label: 'From', field: (row: Song) => row.from.join('\n'), required: true, align:
    'center', sortable: true,
},];

export default defineComponent({
  name: 'SongTable',
  props: ['filter_string'],
  async setup(_props) {
    let songs: Song[] = await getSongs();
    return {
      songs: songs,
      COLUMNS: COLUMNS,
      NO_ROWS: NO_ROWS,
    };
  },
  methods: {
    filter(
      rows: readonly Song[],
      _terms: string,
      _cols: unknown,
      _getCellValue: (col: unknown, row: Song) => unknown
    ) {
      const filter_string = this.filter_string.toLowerCase().trim();
      const p = (row: Song): boolean => {
        for (const filter_item of filter_string.split(/[, ]+/)) {
          if (!row.name.toLowerCase().includes(filter_item) && !
            row.from.some((place) =>
              place.toLowerCase().includes(filter_item)
            ) && !
            row.tags.some((tag) =>
              tag.toLowerCase().includes(filter_item)
            ) && !
            row.firstLines?.some(line => line.toLowerCase().includes(filter_item))
          ) return false;
        }
        return true;
      };
      return rows.filter(p);
    },
  },
});
</script>
