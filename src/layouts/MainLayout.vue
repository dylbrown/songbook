<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="toolbar-title"> The Folkbook </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Helpful Links </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <keep-alive include="SongTable,TablePage">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const linksList = [
  {
    title: 'Song Entry Form',
    caption: 'For adding new entries to this site',
    icon: 'post_add',
    link: 'https://forms.gle/o5DLQKaxBXxCxgYj7',
  },
  {
    title: 'Vaughan Williams Memorial Library',
    caption: 'For the Roud Index and access to various manuscripts',
    icon: 'library_books',
    link: 'https://archives.vwml.org/',
  },
  {
    title: 'Mainly Norfolk',
    caption: 'For details on numerous English folk records',
    icon: 'album',
    link: 'https://mainlynorfolk.info/',
  },
  {
    title: 'The Mudcat Cafe',
    caption: 'A forum of various folk personalities crowdsourcing information',
    icon: 'forum',
    link: 'https://mudcat.org/',
  },
  {
    title: 'Tobar an Dualchais',
    caption: 'Audio recordings of Scottish cultural heritage',
    icon: 'headphones',
    link: 'https://www.tobarandualchais.co.uk/',
  },
  {
    title: 'Clare Country Library',
    caption: 'Audio recordings collected in Clare by Jim Carroll and Pat Mackenzie',
    icon: 'headphones',
    link: 'https://www.clarelibrary.ie/eolas/coclare/songs/cmc/index.htm',
  },
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
