<template>
  <q-page>
    <div class="q-pa-md">
      <q-input v-model="filter_string" label="Search" />
      <div class="filters">
        <q-select v-model="singers_filter" multiple :options="singers" label="Singers" style="flex-grow: 1"
          behavior="menu" />
        <q-toggle v-model="acc_filter" size="xl" icon="piano" />
        <q-toggle v-model="unacc_filter" size="xl" icon="piano_off" />
      </div>
      <q-range v-model="happiness_filter" :min=1 :max=5 :step=1 markers marker-labels>
        <template v-slot:marker-label-group="{ markerList }">

          <q-icon v-for="val in [0, 1, 2, 3, 4]" :key="val" :class="(<any>markerList[val]).classes"
            :style="(<any>markerList[val]).style" size="xs" :name="getIconName(val)" />
        </template>
      </q-range>
    </div>
    <Suspense>
      <template #fallback>
        <div class="notice">Loading...</div>
      </template>
      <SongTable :filter_string="filter_string" :happiness_filter="happiness_filter" :singers_filter="singers_filter"
        :acc_filter="acc_filter" :unacc_filter="unacc_filter" @updateSingers="updateSingers" />
    </Suspense>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 36]">
      <q-btn fab icon="keyboard_arrow_up" color="accent-clear" />
    </q-page-scroller>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SongTable from 'src/components/SongTable.vue';

export default defineComponent({
  name: 'TablePage',
  components: { SongTable },
  setup: function () {
    return { singers: ref(new Array<string>()) };
  },
  data() {
    return {
      filter_string: ref(''),
      happiness_filter: ref({ min: 1, max: 5 }),
      singers_filter: ref(null),
      acc_filter: ref(true),
      unacc_filter: ref(true),
    }
  },
  methods: {
    getIconName(index: number): string {
      switch (index) {
        case 0: return 'sentiment_very_dissatisfied';
        case 1: return 'sentiment_dissatisfied';
        case 3: return 'sentiment_satisfied';
        case 4: return 'sentiment_very_satisfied';
        default:
        case 2: return 'sentiment_neutral';
      }
    },
    updateSingers(singers: Set<string>) {
      this.singers.length = 0;
      this.singers.push(...singers);
    }
  }
});
</script>
