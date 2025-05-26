<template>
  <div id="mapContainer" style="height: 400px; width: 100%;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick } from 'vue';
import 'leaflet/dist/leaflet.css';
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'; // Using specific type imports

// Optional: Icon fix for Leaflet markers. If your markers don't appear, uncomment and ensure paths are correct.
// For Vite, you might need to place images in the `public` directory or import them as assets.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default defineComponent({
  name: 'MapDisplay',
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    zoomLevel: {
      type: Number,
      default: 13,
    },
  },
  setup(props) {
    const mapInstance = ref<LeafletMap | null>(null);
    const markerInstance = ref<LeafletMarker | null>(null);

    onMounted(async () => {
      // Wait for the next DOM update cycle to ensure 'mapContainer' is definitely in the DOM
      await nextTick();

      const mapContainerElement = document.getElementById('mapContainer');

      if (mapContainerElement && !mapInstance.value) { // Ensure container exists and map isn't already initialized
        // 1. Create the map instance directly
        const localMap = L.map(mapContainerElement).setView( // Pass the element directly
          [props.latitude, props.longitude],
          props.zoomLevel
        );

        // 2. Add tile layer to this local map instance
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(localMap);

        // 3. Add marker to the local map instance
        const localMarker = L.marker([props.latitude, props.longitude]).addTo(localMap);
        
        // 4. Assign the fully initialized map and marker to the Vue refs
        mapInstance.value = localMap;
        markerInstance.value = localMarker;

      } else if (!mapContainerElement) {
        console.error("Map container 'mapContainer' not found in the DOM.");
      }
    });

    // Watch for prop changes to update map center and marker
    watch(() => [props.latitude, props.longitude], ([newLat, newLng]) => {
      if (mapInstance.value) {
        mapInstance.value.setView([newLat, newLng], props.zoomLevel);
      }
      if (markerInstance.value) {
        markerInstance.value.setLatLng([newLat, newLng]);
      }
    });

    watch(() => props.zoomLevel, (newZoom) => {
      if (mapInstance.value) {
        mapInstance.value.setZoom(newZoom);
      }
    });

    return {}; // Nothing needed in template from setup, map is attached to DOM element
  },
});
</script>

<style scoped>
/* Component-specific styles if needed */
#mapContainer {
  z-index: 0; /* Or a low value if you have z-index issues with other elements */
}

</style>