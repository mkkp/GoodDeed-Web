<template>
  <l-map ref="map" :options="options.map" @click="mapClick">
    <l-tile-layer :url="options.tileLayer.url" :attribution="options.tileLayer.attribution"/>
    <l-control-zoom position="bottomright"/>
    <l-marker v-if="editMode && isMarkerPlaced" draggable :lat-lng="markerLocation"
              v-on:update:latLng="mapClick"/>
    <l-geo-json ref="geojson" v-if="!editMode && places !== undefined" :options="options.geojson"
                :geojson="places" />
  </l-map>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Emit, Prop, Ref } from 'vue-property-decorator';
import { Icon, LatLngBoundsLiteral } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LControlZoom, LGeoJson, LMap, LMarker, LTileLayer } from 'vue2-leaflet';
import GeoJsonFeatureCollection from '@/models/GeoJsonFeatureCollection';
import GeoJsonGeometry from '@/models/GeoJsonGeometry';
import MarkerPopup from '@/components/MarkerPopup.vue';
import Deed from '@/models/Deed';

// eslint-disable-next-line no-underscore-dangle
delete (Icon.Default.prototype as any)._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const boundsOfHungary: LatLngBoundsLiteral = [
  [45.737128, 16.1138866],
  [48.585257, 22.8977094],
];

function onEachFeature(feature: any, layer: any) {
  const PopupWrapper = Vue.extend(MarkerPopup);
  const popup = new PopupWrapper({
    propsData: {
      deed: feature,
    },
  });
  layer.bindPopup(popup.$mount().$el);
}

@Component({
  name: 'BaseMap',
  components: {
    LMap, LTileLayer, LControlZoom, LMarker, LGeoJson, MarkerPopup,
  },
})
export default class BaseMap extends Vue {
  @Prop()
  places?: GeoJsonFeatureCollection;

  @Prop()
  editMode?: Boolean;

  @Ref()
  geojson?: LGeoJson;

  readonly options = {
    map: {
      zoom: 7,
      zoomControl: false,
    },
    tileLayer: {
      url: process.env.VUE_APP_OSM_URL,
      attribution: '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    },
    geojson: {
      onEachFeature,
    },
    cluster: {
      showCoverageOnHover: false,
      maxClusterRadius: 35,
    },
    popup: {
      closeButton: false,
    },
  };

  markerLocation = { lat: 0, lng: 0 };

  isMarkerPlaced = false;

  @Emit('click')
  mapClick(evt: any): GeoJsonGeometry | undefined {
    if (!this.editMode) {
      return undefined;
    }

    this.isMarkerPlaced = true;
    this.markerLocation = (evt.latlng || evt) as {lat: number, lng: number};

    const deedGeometry = new GeoJsonGeometry();
    deedGeometry.coordinates = [this.markerLocation.lng, this.markerLocation.lat];

    return deedGeometry;
  }

  initMap() {
    const map = (this.$refs.map as LMap).mapObject;
    map.invalidateSize();
    map.fitBounds(boundsOfHungary);
  }

  clear() {
    this.isMarkerPlaced = false;
  }

  openPopup(deed: Deed) {
    const coords = deed.geometry.coordinates!;
    (this.$refs.map as LMap).mapObject.flyTo([coords[1], coords[0]], 14);

    this.geojson!.mapObject.eachLayer((feature: any) => {
      if (feature.feature.id === deed.id) {
        feature.openPopup();
      }
    });
  }

  mounted() {
    this.$nextTick(this.initMap);
  }
}
</script>

<style lang="scss" scoped>
.leaflet-container {
  z-index: 0;
  height: 100vh !important;
}
</style>
