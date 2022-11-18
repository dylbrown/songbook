<template>
  <q-table :rows="songs" :columns="COLUMNS" row-key="name" card-class="song-table" :rows-per-page-options="NO_ROWS"
    :filter="filter_string + happiness_filter" :filter-method="filter" hide-bottom>
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
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
          <div v-if="col.name == 'name'" class="composer">{{ props.row.composer }}</div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="details">
            <div class="song-info" v-if="props.row.alt.length > 0">
              <div class="label">Other Names</div>
              <div class="info-items">
                <div class="info-item" v-for="(alt, index) in props.row.alt" :key="index"> {{ alt }} </div>
              </div>
            </div>
            <div class="song-info">
              <div class="label">Themes</div>
              <div class="info-items">
                <div class="info-item" v-for="(themes, index) in props.row.themes" :key="index"> {{ themes }} </div>
              </div>
            </div>
            <div class="song-lights">
              <div class="label">Tone</div>
              <div class="lights-icons">
                <q-icon name="sentiment_very_dissatisfied" size="sm" v-if="props.row.happiness == 1" />
                <q-icon name="sentiment_dissatisfied" size="sm" v-if="props.row.happiness == 2" />
                <q-icon name="sentiment_neutral" size="sm" v-if="props.row.happiness == 3" />
                <q-icon name="sentiment_ssatisfied" size="sm" v-if="props.row.happiness == 4" />
                <q-icon name="sentiment_very_satisfied" size="sm" v-if="props.row.happiness == 5" />
              </div>
            </div>
            <div class="song-lights">
              <div class="label">Refrain</div>
              <div class="lights-icons">
                <q-icon name="person" size="sm" v-if="props.row.refrain == 'None'" />
                <q-icon name="group" size="sm" v-if="props.row.refrain == 'Short'" />
                <q-icon name="groups" size="sm" v-if="props.row.refrain == 'Long'" />
              </div>
            </div>
            <div class="song-lights">
              <div class="label">Styles</div>
              <div class="lights-icons">
                <q-icon name="piano" size="sm" v-if="props.row.accompanied" />
                <q-icon name="piano_off" size="sm" v-if="props.row.unaccompanied" />
              </div>
            </div>
            <div class="song-buttons">
              <q-btn size="sm" color="accent" round dense :href="props.row.norfolk" target="_blank"
                v-if="props.row.norfolk" icon='info' />
              <q-btn size="sm" color="accent" round dense :to="'/lyrics/' + encodeURIComponent(props.row.name)"
                icon='lyrics' v-if="props.row.lyrics" />
            </div>
          </div>
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

export default defineComponent({
  name: 'SongTable',
  props: ['filter_string', 'happiness_filter'],
  async setup() {
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
      const filter_string = this.filter_string.toLowerCase();
      const happiness_filter = this.happiness_filter;
      const p = (row: Song): boolean => {
        // Name check
        if (!row.name.toLowerCase().includes(filter_string) && !
          row.alt.some((altName) =>
            altName.toLowerCase().includes(filter_string)
          ) && !
          row.themes.some((themeName) =>
            themeName.toLowerCase().includes(filter_string)
          )
        ) return false;
        // Happiness check
        if (row.happiness < happiness_filter.min || row.happiness > happiness_filter.max) return false;
        return true;
      };
      return rows.filter(p);
    },
  },
});
</script>
