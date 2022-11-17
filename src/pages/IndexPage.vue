<template>
  <q-input v-model="filter_string" label="Search" class="search" />
  <Suspense>
    <template #fallback>
      <div class="notice">Loading...</div>
    </template>
    <SongTable :filter_string="filter_string" />
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
      filter_string: ref('')
    }
  }
});
</script>
