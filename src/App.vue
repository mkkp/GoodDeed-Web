<template>
  <v-app>
    <v-content>
      <v-container fluid id="app-container">
        <div v-if="!isNewDeedPanelVisible" class="top-bar">
          <v-btn @click="showAddDeed" class="add-deed-btn">
            <v-icon left>add</v-icon> Jótett jelentése</v-btn>
        </div>

        <base-map ref="baseMap" :places="places" :edit-mode="isNewDeedPanelVisible"
                  @click="chooseLocation" />

        <new-deed v-if="isNewDeedPanelVisible" :location-selected="isNewDeedLocationSelected"
                  :location="newDeedLocation" @cancel="hideAddDeed" @deed-created="onDeedCreated"/>

        <side-bar v-else :places="places" @deedClick="onDeedClick" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import BaseMap from '@/components/BaseMap.vue';
import NewDeed from '@/components/NewDeed.vue';
import SideBar from '@/components/SideBar.vue';
import apiClient from '@/utils/api-client';
import GeoJsonFeatureCollection from '@/models/GeoJsonFeatureCollection';
import GeoJsonGeometry from '@/models/GeoJsonGeometry';
import Deed from '@/models/Deed';

@Component({ name: 'App', components: { BaseMap, SideBar, NewDeed } })
export default class App extends Vue {
  @Ref()
  readonly baseMap!: BaseMap;

  places = new GeoJsonFeatureCollection();

  newDeedLocation? = new GeoJsonGeometry();

  isNewDeedLocationSelected = false;

  isNewDeedPanelVisible = false;

  async loadData() {
    this.places = await apiClient.getDeeds();
  }

  showAddDeed() {
    (this.baseMap as any).clear();
    this.isNewDeedLocationSelected = false;
    this.isNewDeedPanelVisible = true;
  }

  hideAddDeed() {
    this.isNewDeedPanelVisible = false;
    this.isNewDeedLocationSelected = false;
  }

  onDeedCreated() {
    this.hideAddDeed();
    this.loadData();
  }

  chooseLocation(loc: GeoJsonGeometry | undefined) {
    if (!loc) {
      return;
    }

    this.isNewDeedLocationSelected = true;
    this.newDeedLocation = loc;
  }

  onDeedClick(deed: Deed) {
    (this.baseMap as any).openPopup(deed);
  }

  mounted() {
    this.loadData();
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app-container {
  padding: 0;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .add-deed-btn {
    margin: 10px;
  }
}
</style>
