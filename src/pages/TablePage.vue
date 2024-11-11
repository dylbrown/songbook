<template>
  <q-page>
    <div class="q-pa-md">
      <q-input v-model="filter_string" label="Search" />
    </div>
    <Suspense>
      <template #fallback>
        <div class="notice">Loading...</div>
      </template>
      <SongTable :filter_string="filter_string" />
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
  data() {
    return {
      filter_string: ref(''),
    }
  },
});
</script>
