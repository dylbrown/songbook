<template>
  <div class="content">
    <q-btn class="back" size="lg" color="accent" round dense to="/" icon='arrow_back' />
    <Suspense>
      <template #fallback>
        <div class="notice">Loading...</div>
      </template>
      <SongLyrics :song_name="$route.params.song_name" />
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongLyrics from 'src/components/SongLyrics.vue';

export default defineComponent({
  name: 'LyricsPage',
  components: { SongLyrics },
});
</script>
