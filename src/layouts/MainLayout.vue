<template>
  <q-layout view="lHh LpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="toolbar-title" @click="home"
          >Circles of Song</q-toolbar-title
        >
        <q-toggle
          flat
          dense
          round
          color="grey"
          keep-color
          checked-icon="grid_view"
          aria-label="Display Mode"
          unchecked-icon="list"
          v-model="gridMode"
        />
        <q-btn
          flat
          dense
          round
          icon="refresh"
          aria-label="Refresh"
          @click="reload()"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Tools </q-item-label>
        <EssentialLink v-for="link in tools" :key="link.title" v-bind="link" />
        <q-item-label header> Helpful Links </q-item-label>
        <EssentialLink
          v-for="link in references"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }" :grid-mode="gridMode">
        <keep-alive include="SongTable,TablePage">
          <Suspense> <component :is="Component" /></Suspense>
        </keep-alive>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { useRouter } from 'vue-router';

const tools = [
    {
      title: 'Charts',
      caption: 'For some fun stats about the songbook',
      icon: 'bar_chart',
      to: '/charts',
    },
];
const references = [
  {
    title: 'Song Entry Form',
    caption: 'For adding new entries to this site',
    icon: 'post_add',
    link: 'https://forms.gle/nkRSpYCgMFrjegqYA',
  },
];

const leftDrawerOpen = ref(false);
const gridMode = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function reload() {
  location.reload();
}

const router = useRouter();

function home() {
  router.push('/');
}
</script>
