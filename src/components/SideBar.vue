<template>
  <v-card id="side-bar">
    <v-list two-line>
      <template v-for="(item, index) in sortedPlaces">
        <v-list-item :key="item.id" @click="$emit('deedClick', item)">
          <template v-slot:default="{ active, toggle }">
            <v-list-item-content>
              <v-list-item-action-text v-text="relativeTime(item.createdAt)"/>
              <v-list-item-subtitle v-text="deedLabel(item)"/>
              <v-list-item-title v-text="item.description"/>
            </v-list-item-content>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < sortedPlaces.length" :key="index" />
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import moment from 'moment';
import GeoJsonFeatureCollection from '@/models/GeoJsonFeatureCollection';
import Deed from '@/models/Deed';

moment.locale('hu');

@Component({ name: 'SideBar' })
export default class SideBar extends Vue {
  @Prop()
  places?: GeoJsonFeatureCollection;

  get sortedPlaces() {
    return this.places!.features.sort((a, b) => new Date(b.createdAt!).getTime()
      - new Date(a.createdAt!).getTime());
  }

  deedLabel(deed: Deed) {
    return deed.reportType === 'self'
      ? `${deed.createdBy.nickname} jót tett:`
      : `${deed.createdBy.nickname} jótettet látott:`;
  }

  relativeTime(date: Date) {
    return moment(date).fromNow();
  }
}
</script>

<style lang="scss">
#side-bar {
  position: absolute;
  top: 60px;
  left: 10px;
  width: 350px;
  height: auto;
  max-height: calc(100% - 100px);
  overflow-y: auto;
}

.v-list-item__action-text {
  position: absolute;
  right: 16px;
  top: 14px;
}
</style>
