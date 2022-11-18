<template>
  <div class="q-pa-md">
    <q-input v-model="filter_string" label="Search" />
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
    <SongTable :filter_string="filter_string" :happiness_filter="happiness_filter" />
  </Suspense>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SongTable from 'src/components/SongTable.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { SongTable },
  data() {
    return {
      filter_string: ref(''),
      happiness_filter: ref({ min: 1, max: 5 }),
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
    }
  }
});
</script>
