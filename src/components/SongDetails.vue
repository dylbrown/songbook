<template>
  <div class="details">
    <div class="song-info" v-if="song.info">
      <div class="label">Story</div>
      <div class="info-items source-info" v-html="info" />
    </div>
    <div class="song-info" v-if="song.chords">
      <div class="label">Chords</div>
      <div class="info-items source-info" v-html="chords" />
    </div>
    <div style="flex-grow: 1" v-if="!song.info && !song.chords" />
    <div class="song-buttons" v-if="!horizontal">
      <q-btn
        size="sm"
        color="accent"
        round
        dense
        :to="'/lyrics/' + encodeURIComponent(song.name)"
        icon="lyrics"
        v-if="song.lyrics"
      />
    </div>
  </div>
  <div class="song-buttons horizontal" v-if="horizontal">
    <q-btn
      size="sm"
      color="accent"
      round
      dense
      :to="'/lyrics/' + encodeURIComponent(song.name)"
      icon="lyrics"
      v-if="song.lyrics"
    />
  </div>
</template>

<script setup lang="ts">
import type { Song } from './models';
import { default as DOMPurify } from 'dompurify';
import { marked } from 'marked';
import { ref, watchEffect } from 'vue';

const { song, visible, horizontal } = defineProps<{
  song: Song;
  visible: boolean;
  horizontal?: boolean;
}>();

let rendered: string | null = null;

watchEffect(() => {
  if (visible && song.info && (rendered == null || rendered != song.name)) {
    marked.parse(song.info, { async: true }).then((s) => {
      info.value = DOMPurify.sanitize(s);
      marked.parse(song.chords, { async: true }).then((s) => {
        chords.value = DOMPurify.sanitize(s);
        rendered = song.name;
      });
    });
  }
});

const info = ref<string>('');
const chords = ref<string>('');
</script>
