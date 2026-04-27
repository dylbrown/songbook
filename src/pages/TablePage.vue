<template>
  <q-page>
    <div class="q-pa-md">
      <q-input v-model="filter_string" label="Search" clearable />
      <div class="filters">
        <q-field
          ref="tagSelector"
          label="Tags"
          style="flex-grow: 1"
          v-model="tags_filter"
          clearable
          @clear="clearTags"
        >
          <template v-slot:control>
            <div
              style="width: 100%; height: 100%; position: absolute"
              @click="selectTags = true"
            />
            <div
              class="self-center full-width no-outline"
              tabindex="0"
              v-if="tags_filter"
            >
              {{
                Object.values(tags_filter)
                  .map((o) => o.selections.join(o.all ? ' + ' : ' | '))
                  .filter((s) => s.length > 0)
                  .join(', ')
              }}
            </div>
          </template>
          <q-dialog v-model="selectTags" @hide="updateTagFilters">
            <q-card class="tag-selection">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="themes" label="Themes" />
                <q-tab name="purposes" label="Purposes" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="themes">
                  <TagTab v-model="theme_selections" :options="themes" />
                </q-tab-panel>
                <q-tab-panel name="purposes">
                  <TagTab
                    v-model="purpose_selections"
                    :options="purposes"
                    default-all
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </q-dialog>
        </q-field>
        <q-range
          v-model="difficulty_filter"
          :min="1"
          :max="5"
          :step="1"
          markers
          style="max-width: 50%"
          marker-labels
        >
          <template v-slot:marker-label-group="{ markerList }">
            <q-icon
              v-for="val in [0, 1, 2, 3, 4]"
              :key="val"
              :class="(<any>markerList[val]).classes"
              :style="(<any>markerList[val]).style"
              size="xs"
              :name="getIconName(val)"
            />
          </template>
        </q-range>
      </div>
    </div>
    <Suspense>
      <template #fallback>
        <div class="notice">Loading...</div>
      </template>
      <SongTable
        :filter_string="filter_string"
        :difficulty_filter="difficulty_filter"
        :tags_filter="tags_filter"
        @updateThemes="(map) => doOptionsUpdate(themes, map)"
        @updatePurposes="(map) => doOptionsUpdate(purposes, map)"
        :gridMode="gridMode"
      />
    </Suspense>
    <q-page-scroller
      position="bottom-right"
      :scroll-offset="150"
      :offset="[18, 36]"
    >
      <q-btn fab icon="keyboard_arrow_up" color="accent-clear" />
    </q-page-scroller>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SongTable from 'src/components/SongTable.vue';
import { QField } from 'quasar';
import type { TagFilterModel, Option } from 'src/components/TagTab.vue';
import TagTab from 'src/components/TagTab.vue';

const { gridMode } = defineProps<{
  gridMode: boolean;
}>();

const themes = ref(new Array<Option>());
const purposes = ref(new Array<Option>());

const tagSelector = ref<QField | null>(null);
const selectTags = ref<boolean>(false);
const tab = ref<string>('themes');

const theme_selections = ref<TagFilterModel>({ selections: [] });
const purpose_selections = ref<TagFilterModel>({ selections: [], all: true });
const tags_filter = ref<{
  themes: TagFilterModel;
  purposes: TagFilterModel;
} | null>(null);

function updateTagFilters() {
  if (
    theme_selections.value.selections.length == 0 &&
    purpose_selections.value.selections.length == 0
  ) {
    tags_filter.value = null;
    return;
  }
  tags_filter.value = {
    themes: theme_selections.value,
    purposes: purpose_selections.value,
  };
}

function clearTags() {
  theme_selections.value.selections.splice(0);
  purpose_selections.value.selections.splice(0);
  tags_filter.value = null;
}

const filter_string = ref(null);
const difficulty_filter = ref({ min: 1, max: 5 });

function getIconName(index: number): string {
  switch (index) {
    case 0:
      return 'diversity_1';
    case 4:
      return 'sym_o_cognition_2';
    default:
      return '';
  }
}
function doOptionsUpdate(destination: Array<Option>, map: Map<string, number>) {
  destination.splice(0);
  destination.push(
    ...Array.from(map.keys()).map((s) => {
      return { label: s, value: s };
    }),
  );
  destination.sort((a, b) => (map.get(b.value) ?? 0) - (map.get(a.value) ?? 0));
}
</script>
