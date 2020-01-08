<template>
  <v-card id="new-deed">
    <v-card-title>
      <div class="text-left">
        <v-btn text icon class="back-btn" @click="$emit('cancel')">
          <v-icon color="grey darken-4">arrow_back</v-icon>
        </v-btn>
        <span>Jótett jelentése</span>
      </div>
    </v-card-title>

    <v-card-text>
      <v-form>
        <v-text-field v-model="newDeed.createdBy.nickname" label="Neved" />

        <v-radio-group v-model="newDeed.reportType" class="type-select">
          <v-radio color="primary" label="Jót tettem" value="self" />
          <v-radio color="primary" label="Jótettet láttam" value="seen" />
        </v-radio-group>

        <v-textarea v-model="newDeed.description" :label="descriptionInputLabel" />

        <v-input v-if="!locationSelected">
          Válassz egy helyet a térképen!
        </v-input>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer/>
      <v-btn color="primary" :disabled="!isFormValid || isLoading" :loading="isLoading"
             @click="submit">Küldés</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop } from 'vue-property-decorator';
import ApiClient from '@/utils/api-client';
import Deed from '@/models/Deed';
import GeoJsonGeometry from '@/models/GeoJsonGeometry';

@Component({ name: 'NewDeed' })
export default class SideBar extends Vue {
  @Prop()
  locationSelected?: Boolean;

  @Prop()
  location?: GeoJsonGeometry;

  newDeed = new Deed();

  isLoading = false;

  get isFormValid() {
    return this.newDeed.createdBy.nickname && this.newDeed.description && this.locationSelected;
  }

  get descriptionInputLabel() {
    return this.newDeed.reportType === 'self' ? 'Mi jót cselekedtél?' : 'Milyen jótettet láttál?';
  }

  @Emit('deed-created')
  async submit() {
    this.isLoading = true;

    this.newDeed.geometry = this.location!;

    await ApiClient.createDeed(this.newDeed);

    this.isLoading = false;
  }
}
</script>

<style lang="scss">
#new-deed {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 350px;
}

.back-btn {
  margin-top: -4px;
}

.type-select {
  .v-input__control {
    width: 100% !important;
  }

  .v-input--radio-group__input {
    -webkit-box-orient: horizontal !important;
    -ms-flex-direction: row !important;
    flex-direction: row !important;
    justify-content: space-around;
  }

  .v-radio {
    margin: 0 !important;
  }
}
</style>
