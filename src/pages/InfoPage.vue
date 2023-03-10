<template>
  <q-page>
    <Suspense>
      <template #fallback>
        <div class="notice">Loading...</div>
      </template>
      <SongInfo :song_name="$route.params.song_name" />
    </Suspense>
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn fab to="/" icon='arrow_back' color="accent" />
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongInfo from 'src/components/SongInfo.vue';

export default defineComponent({
  name: 'InfoPage',
  components: { SongInfo },
});
</script>
