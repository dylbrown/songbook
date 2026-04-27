<template>
  <q-table
    :rows="songs"
    :columns="COLUMNS"
    row-key="name"
    :grid="gridMode"
    card-class="song-table"
    :rows-per-page-options="NO_ROWS"
    :filter="[filter_string, difficulty_filter, tags_filter]"
    :filter-method="filter"
    hide-bottom
    :pagination="{ sortBy: 'date', descending: true }"
  >
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
          <q-btn
            size="sm"
            color="accent"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'expand_more' : 'chevron_right'"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="table-cell"
          :class="{
            small:
              typeof col.value == 'string' &&
              col.value.includes('\n') &&
              col.name != 'name',
          }"
        >
          {{ col.value }}
          <div v-if="col.name == 'name'" class="composer">
            {{ props.row.source }}
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props" class="expand">
        <q-td colspan="100%" class="details-td">
          <SongDetails :song="props.row" :visible="props.expand" />
        </q-td>
      </q-tr>
    </template>
    <template v-slot:item="props">
      <div class="col-xs-4 col-sm-3 col-md-2">
        <q-card
          flat
          bordered
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          "
        >
          <q-card-section class="text-center">
            {{ props.row.name }}
          </q-card-section>
          <q-popup-proxy v-model="props.expand">
            <q-card dark bordered class="bg-grey-9 my-card">
              <q-card-section>
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">
                  {{ props.row.themes.join(', ') }}
                </div>
                <div>
                  {{ props.row.date.toLocaleDateString('en-GB', DATE_FORMAT) }}
                </div>
              </q-card-section>

              <q-separator dark inset />

              <q-card-section>
                <SongDetails
                  :song="props.row"
                  :visible="props.expand"
                  horizontal
                />
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </q-card>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import type { QTableProps } from 'quasar';
import type { Song } from './models';
import { getSongs } from 'src/util/load-table';
import SongDetails from './SongDetails.vue';
import type { TagFilterModel } from './TagTab.vue';

const NO_ROWS = [0];

function removeThe(s: string): string {
  if (s.startsWith('The')) return s.substring(4);
  return s;
}
const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: undefined,
  day: 'numeric',
  month: 'short',
  year: '2-digit',
};

const COLUMNS: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    required: true,
    align: 'left',
    sortable: true,
    sort: (a, b /*, _rowA, _rowB*/) => {
      return removeThe(a).localeCompare(removeThe(b));
    },
  },
  {
    name: 'themes',
    label: 'Themes',
    field: (row: Song) => row.themes.join('\n'),
    required: true,
    align: 'center',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date Added',
    field: (row: Song) => {
      return row.date.toLocaleDateString('en-GB', DATE_FORMAT);
    },
    required: true,
    align: 'center',
    sortable: true,
    sort: (_a, _b, rowA, rowB) =>
      rowA.date.getTime() > rowB.date.getTime() ? 1 : 0,
  },
];

const props = defineProps<{
  filter_string: string | null;
  difficulty_filter: { min: number; max: number };
  tags_filter: {
    themes: TagFilterModel;
    purposes: TagFilterModel;
  } | null;
  gridMode: boolean;
}>();

const { songs, themes, purposes } = await getSongs();

const emits = defineEmits<{
  updateThemes: [categories: Map<string, number>];
  updatePurposes: [categories: Map<string, number>];
}>();
emits('updateThemes', themes);
emits('updatePurposes', purposes);

function filter(
  rows: readonly Song[] /*,
      _terms: string,
      _cols: unknown,
      _getCellValue: (col: unknown, row: Song) => unknown*/,
) {
  const filter_string = props.filter_string
    ? props.filter_string.toLowerCase()
    : '';
  const filter_strings = filter_string.split(/,? +/gi);
  const p = (row: Song): boolean => {
    // Difficulty check
    if (
      row.difficulty != 0 &&
      (row.difficulty < props.difficulty_filter.min ||
        row.difficulty > props.difficulty_filter.max)
    )
      return false;
    // Themes / Purposes check
    for (const [key, value] of Object.entries(props.tags_filter ?? {})) {
      const index = key as 'themes' | 'purposes';
      const match = (cat: string) => row[index].includes(cat);
      if (
        value.selections.length > 0 &&
        !(value.all
          ? value.selections.every(match)
          : value.selections.some(match))
      )
        return false;
    }
    // Name check
    for (const keyword of filter_strings) {
      if (
        !row.name.toLowerCase().includes(keyword) &&
        !row.themes.some((themeName) =>
          themeName.toLowerCase().includes(keyword),
        )
      )
        return false;
    }
    return true;
  };

  return rows.filter(p);
}
</script>
