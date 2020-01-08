<template>
  <div class="popup-content">
    <div class="text--secondary timestamp">{{ relativeTime(deed.createdAt) }}</div>
    <div class="text--secondary">{{ deedLabel(deed) }}</div>
    <div>{{ deed.description }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import moment from 'moment';
import Deed from '../models/Deed';

@Component({ name: 'MarkerPopup' })
export default class MarkerPopup extends Vue {
  @Prop()
  deed?: Deed;

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

<style lang="scss" scoped>
.popup-content {
  min-width: 150px;
}

.timestamp {
  position: absolute;
  right: 16px;
  top: 14px;
}
</style>
