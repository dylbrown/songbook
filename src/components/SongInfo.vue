<template>
  <div v-if="song && (song.info || song.norfolk)" class="info-page">
    <h5 class="text-h5">{{ song_name }}</h5>
    <p v-if="song.info" v-html="song.info"></p>
    <p v-if="song.norfolk">For additional info, see <a :href="song.norfolk" target="_blank">Mainly Norfolk</a>.</p>
  </div>
  <div class="notice" v-else>No Info Available</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Song } from './models';
import { getSongs } from 'src/util/table-utils';

export default defineComponent({
  name: 'SongInfo',
  props: ['song_name'],
  async setup(props) {
    let songs: Song[] = await getSongs();
    let song = null;
    for (const a_song of songs) {
      if (props.song_name == a_song.name) {
        song = a_song;
      }
    }
    if (song == null) return {};
    return { song };
  },
});
</script>
