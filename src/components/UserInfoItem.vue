<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-sky-200">WhoAmI</h1>
      <p class="mt-2 text-lg text-gray-400">A Comprehensive User Context Dashboard</p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <svg class="animate-spin h-10 w-10 text-sky-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-xl text-gray-400">Gathering your info...</p>
    </div>

    <div v-else class="space-y-8">
      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">📍 IP & Location</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="IP Address" :value="userInfo.ipAddress" />
          <LabelValueItem label="City" :value="userInfo.city" />
          <LabelValueItem label="Region" :value="userInfo.region" />
          <LabelValueItem label="Country" :value="userInfo.country" />
          <LabelValueItem label="Latitude" :value="userInfo.latitude" />
          <LabelValueItem label="Longitude" :value="userInfo.longitude" />
          <LabelValueItem label="ISP / Organization" :value="userInfo.isp" />
          <LabelValueItem label="Timezone (from IP)" :value="userInfo.ipTimezone" />
        </dl>
        <div v-if="userInfo.latitude && userInfo.longitude" class="mt-6 rounded-lg overflow-hidden shadow-lg">
          <MapDisplay :latitude="userInfo.latitude" :longitude="userInfo.longitude" :zoom-level="15" />
        </div>
        <p v-if="ipError" class="mt-4 text-sm text-red-400">{{ ipError }}</p>
      </section>

      <section v-if="userInfo.latitude && userInfo.longitude" class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🌤️ Weather & Climate</h2>
        <div v-if="weather.loading">
          <p class="text-gray-400">Loading weather data...</p>
        </div>
        <div v-else-if="weather.error">
          <p class="text-red-400">{{ weather.error }}</p>
        </div>
        <div v-else>
          <div class="flex flex-col sm:flex-row items-center mb-4">
            <div class="text-center sm:text-left sm:mr-6">
              <h3 class="text-xl font-medium text-white">{{ weather.location }}</h3>
              <p class="text-sm text-gray-400">{{ weather.description }}</p>
            </div>
            <div class="flex items-center mt-3 sm:mt-0">
              <span class="text-4xl font-bold text-white">{{ weather.temperature }}°{{ weather.units === 'metric' ? 'C' : 'F' }}</span>
              <span v-if="weather.icon" class="text-4xl ml-2">{{ weather.icon }}</span>
            </div>
          </div>

          <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LabelValueItem label="Feels Like" :value="`${weather.feelsLike}°${weather.units === 'metric' ? 'C' : 'F'}`" />
            <LabelValueItem label="Humidity" :value="`${weather.humidity}%`" />
            <LabelValueItem label="Wind" :value="`${weather.windSpeed} ${weather.units === 'metric' ? 'km/h' : 'mph'} ${weather.windDirection}`" />
            <LabelValueItem label="Pressure" :value="`${weather.pressure} hPa`" />
            <LabelValueItem label="Visibility" :value="`${weather.visibility} km`" />
            <LabelValueItem label="Clouds" :value="`${weather.clouds}%`" />
            <LabelValueItem label="Sunrise" :value="weather.sunrise" />
            <LabelValueItem label="Sunset" :value="weather.sunset" />
          </dl>

          <div class="mt-4">
            <h3 class="text-lg font-medium text-sky-300 mb-2">Forecast</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <div v-for="day in weather.forecast" :key="day.date" class="bg-gray-700/50 rounded-lg p-3 text-center">
                <div class="text-sm text-gray-400">{{ day.date }}</div>
                <div class="text-2xl my-1">{{ day.icon }}</div>
                <div class="flex justify-center gap-2 text-sm">
                  <span class="text-white">{{ day.tempMax }}°</span>
                  <span class="text-gray-400">{{ day.tempMin }}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="userInfo.latitude && userInfo.longitude" class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🌎 Geographic Details</h2>
        <div v-if="geo.loading">
          <p class="text-gray-400">Loading geographic data...</p>
        </div>
        <div v-else-if="geo.error">
          <p class="text-red-400">{{ geo.error }}</p>
        </div>
        <div v-else>
          <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <LabelValueItem label="Elevation" :value="`${geo.elevation} meters`" />
            <LabelValueItem label="Local Time" :value="geo.localTime" />
            <LabelValueItem label="Timezone" :value="geo.timezone" />
            <LabelValueItem label="Country Code" :value="geo.countryCode" />
            <LabelValueItem label="Country" :value="geo.country" />
            <LabelValueItem label="Currency" :value="geo.currency" />
            <LabelValueItem label="Languages" :value="geo.languages" />
            <LabelValueItem label="Population (City)" :value="geo.cityPopulation" />
            <LabelValueItem label="Population (Country)" :value="geo.countryPopulation" />
          </dl>

          <div v-if="geo.nearbyPlaces && geo.nearbyPlaces.length > 0" class="mt-4">
            <h3 class="text-lg font-medium text-sky-300 mb-2">Nearby Places</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li v-for="place in geo.nearbyPlaces" :key="place.name" class="bg-gray-700/50 rounded-lg p-2 flex items-center">
                <span class="text-sm">{{ place.name }} ({{ place.distance }} km)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">💻 Browser & OS</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="User Agent String" :value="userInfo.userAgent" />
          <LabelValueItem label="Browser (from UAData)" :value="userInfo.browserNameVersion" />
          <LabelValueItem label="OS (from UAData)" :value="userInfo.osNameVersion" />
          <LabelValueItem label="Mobile (from UAData)" :value="userInfo.isMobile" />
          <LabelValueItem label="Platform (navigator.platform)" :value="userInfo.platform" />
          <LabelValueItem label="Vendor (navigator.vendor)" :value="userInfo.vendor" />
          <LabelValueItem label="Language (navigator.language)" :value="userInfo.language" />
          <LabelValueItem label="Languages (navigator.languages)" :value="userInfo.languages" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🖥️ Display & Screen</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Screen Resolution" :value="`${userInfo.screenWidth} x ${userInfo.screenHeight}`" />
          <LabelValueItem label="Available Screen Size" :value="`${userInfo.availScreenWidth} x ${userInfo.availScreenHeight}`" />
          <LabelValueItem label="Window Size" :value="`${userInfo.windowInnerWidth} x ${userInfo.windowInnerHeight}`" />
          <LabelValueItem label="Color Depth" :value="userInfo.colorDepth" />
          <LabelValueItem label="Pixel Depth" :value="userInfo.pixelDepth" />
          <LabelValueItem label="Device Pixel Ratio" :value="userInfo.devicePixelRatio" />
          <LabelValueItem label="Screen Orientation" :value="userInfo.screenOrientation" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">⚙️ Hardware & Performance</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="CPU Cores (Threads)" :value="userInfo.cpuCores" />
          <LabelValueItem label="Device Memory (Approx. GB)" :value="userInfo.deviceMemory" />
          <LabelValueItem label="Max Touch Points" :value="userInfo.maxTouchPoints" />
        </dl>
      </section>
      
      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🌐 Network Status</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Online Status" :value="userInfo.isOnline" />
          <LabelValueItem label="Connection Type" :value="userInfo.connectionType" />
          <LabelValueItem label="Effective Connection Type" :value="userInfo.effectiveConnectionType" />
          <LabelValueItem label="Downlink (Mbps)" :value="userInfo.downlink" />
          <LabelValueItem label="RTT (ms)" :value="userInfo.rtt" />
          <LabelValueItem label="Save Data Mode" :value="userInfo.saveData" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🔧 Browser Features</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Cookies Enabled" :value="userInfo.cookiesEnabled" />
          <LabelValueItem label="Do Not Track" :value="userInfo.doNotTrack" />
          <LabelValueItem label="PDF Viewer Enabled" :value="userInfo.pdfViewerEnabled" />
          <LabelValueItem label="Webdriver Active" :value="userInfo.webdriver" />
          <LabelValueItem label="Java Enabled (Legacy)" :value="userInfo.javaEnabled" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">⏱️ Date & Time</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Local Date & Time" :value="userInfo.localDateTime" />
          <LabelValueItem label="UTC Date & Time" :value="userInfo.utcDateTime" />
          <LabelValueItem label="Timezone Offset (minutes from UTC)" :value="userInfo.timezoneOffset" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🔋 Battery Status</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <template v-if="userInfo.battery">
            <template v-if="'level' in userInfo.battery">
              <LabelValueItem label="Battery Level" :value="`${(userInfo.battery.level * 100).toFixed(0)}%`" />
              <LabelValueItem label="Charging" :value="userInfo.battery.charging ? 'Yes' : 'No'" />
              <LabelValueItem label="Charging Time" :value="userInfo.battery.chargingTime === Infinity ? 'Infinity' : userInfo.battery.chargingTime.toString()" />
              <LabelValueItem label="Discharging Time" :value="userInfo.battery.dischargingTime === Infinity ? 'Infinity' : userInfo.battery.dischargingTime.toString()" />
            </template>
            <template v-else-if="'error' in userInfo.battery">
              <LabelValueItem label="Battery Status" :value="userInfo.battery.error" />
            </template>
            <template v-else>
              <LabelValueItem label="Battery Status" :value="'N/A'" />
            </template>
          </template>
          <template v-else>
            <LabelValueItem label="Battery Status" :value="'N/A'" />
          </template>
        </dl>
      </section>

      <!-- NEW SECTIONS -->
      
      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🔐 API Support & Permissions</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Geolocation" :value="permissions.geolocation" />
          <LabelValueItem label="Notifications" :value="permissions.notifications" />
          <LabelValueItem label="Camera" :value="permissions.camera" />
          <LabelValueItem label="Microphone" :value="permissions.microphone" />
          <LabelValueItem label="Push API" :value="apiSupport.pushApi ? 'Supported' : 'Not Supported'" />
          <LabelValueItem label="Web Bluetooth" :value="apiSupport.bluetooth ? 'Supported' : 'Not Supported'" />
          <LabelValueItem label="Web Share" :value="apiSupport.webShare ? 'Supported' : 'Not Supported'" />
          <LabelValueItem label="Web USB" :value="apiSupport.webUsb ? 'Supported' : 'Not Supported'" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">📱 Device Sensors</h2>
        <div v-if="sensors.available">
          <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <LabelValueItem label="Accelerometer" :value="sensors.accelerometer ? 'Available' : 'Unavailable'" />
            <LabelValueItem label="Gyroscope" :value="sensors.gyroscope ? 'Available' : 'Unavailable'" />
            <LabelValueItem label="Magnetometer" :value="sensors.magnetometer ? 'Available' : 'Unavailable'" />
            <LabelValueItem label="Ambient Light" :value="sensors.ambientLight ? 'Available' : 'Unavailable'" />
            <LabelValueItem label="Device Orientation" :value="sensors.deviceOrientation ? 'Available' : 'Unavailable'" />
          </dl>
          <div v-if="sensors.liveData" class="p-4 bg-gray-700/50 rounded-lg">
            <h3 class="text-lg font-medium text-sky-300 mb-2">Live Sensor Data</h3>
            <pre class="text-xs text-gray-300 overflow-x-auto">{{ sensors.liveData }}</pre>
          </div>
        </div>
        <p v-else class="text-gray-400">Sensor APIs not available in this browser</p>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">💾 Storage</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValueItem label="LocalStorage Available" :value="storage.localStorage" />
          <LabelValueItem label="SessionStorage Available" :value="storage.sessionStorage" />
          <LabelValueItem label="IndexedDB Available" :value="storage.indexedDB ? 'Yes' : 'No'" />
          <LabelValueItem label="Cache API Available" :value="storage.cacheAPI ? 'Yes' : 'No'" />
          <LabelValueItem label="Estimated Storage Usage" :value="storage.usage" />
          <LabelValueItem label="Estimated Storage Quota" :value="storage.quota" />
          <LabelValueItem label="Persistent Storage Granted" :value="storage.persistentStorage" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🎮 Media Capabilities</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="WebGL" :value="media.webgl" />
          <LabelValueItem label="WebGL2" :value="media.webgl2" />
          <LabelValueItem label="Canvas Supported" :value="media.canvas ? 'Yes' : 'No'" />
          <LabelValueItem label="Audio Supported" :value="media.audio ? 'Yes' : 'No'" />
          <LabelValueItem label="Video Formats" :value="media.videoFormats" />
          <LabelValueItem label="Audio Formats" :value="media.audioFormats" />
          <LabelValueItem label="WebRTC Support" :value="media.webrtc ? 'Supported' : 'Not Supported'" />
        </dl>
        <div v-if="media.gpuInfo" class="mt-4 p-3 bg-gray-700/50 rounded-lg">
          <h3 class="text-md font-medium text-sky-300 mb-1">GPU Information</h3>
          <p class="text-sm text-gray-300">{{ media.gpuInfo }}</p>
        </div>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">⚡ Performance Metrics</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValueItem label="Page Load Time" :value="performance.pageLoadTime + 'ms'" />
          <LabelValueItem label="DOM Content Loaded" :value="performance.domContentLoaded + 'ms'" />
          <LabelValueItem label="First Paint" :value="performance.firstPaint + 'ms'" />
          <LabelValueItem label="First Contentful Paint" :value="performance.firstContentfulPaint + 'ms'" />
        </dl>
        <div class="mt-4">
          <h3 class="text-lg font-medium text-sky-300 mb-2">Resource Timing</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-300">
              <thead class="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th class="px-4 py-2">Resource</th>
                  <th class="px-4 py-2">Duration</th>
                  <th class="px-4 py-2">Size</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(resource, index) in performance.resources.slice(0, 5)" :key="index" class="border-b border-gray-700">
                  <td class="px-4 py-2 truncate max-w-xs">{{ resource.name }}</td>
                  <td class="px-4 py-2">{{ resource.duration }}ms</td>
                  <td class="px-4 py-2">{{ resource.size }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🛡️ Security Features</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="HTTPS Connection" :value="security.isHttps ? 'Yes' : 'No'" />
          <LabelValueItem label="Content Security Policy" :value="security.csp ? 'Enabled' : 'Not Detected'" />
          <LabelValueItem label="Cross-Origin Opener Policy" :value="security.coop" />
          <LabelValueItem label="Referrer Policy" :value="security.referrerPolicy" />
          <LabelValueItem label="Third-Party Cookies" :value="security.thirdPartyCookies ? 'Allowed' : 'Blocked'" />
          <LabelValueItem label="Incognito Mode" :value="security.incognito ? 'Likely Yes' : 'Likely No'" />
          <LabelValueItem label="Ad Blocker Detected" :value="security.adBlocker ? 'Yes' : 'No'" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🔤 Typography</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <LabelValueItem label="System Font" :value="fonts.systemFont" />
          <LabelValueItem label="Default Font Size" :value="fonts.defaultSize + 'px'" />
          <LabelValueItem label="Font Smoothing" :value="fonts.smoothing" />
        </dl>
        <div class="mt-4">
          <h3 class="text-lg font-medium text-sky-300 mb-2">Common Font Availability</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="(available, fontName) in fonts.available" :key="fontName" 
                  class="px-2 py-1 rounded text-xs" 
                  :class="available ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'">
              {{ fontName }}
            </span>
          </div>
        </div>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">♿ Accessibility</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValueItem label="Preferred Reduced Motion" :value="a11y.prefersReducedMotion ? 'Yes' : 'No'" />
          <LabelValueItem label="Prefers Color Scheme" :value="a11y.prefersColorScheme" />
          <LabelValueItem label="Prefers Contrast" :value="a11y.prefersContrast" />
          <LabelValueItem label="Forced Colors" :value="a11y.forcedColors" />
          <LabelValueItem label="Screen Reader Detected" :value="a11y.screenReader ? 'Likely Yes' : 'Not Detected'" />
          <LabelValueItem label="Keyboard Navigation" :value="a11y.keyboardNav ? 'Active' : 'Not Active'" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🕒 Visit History</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabelValueItem label="First Visit" :value="history.firstVisit" />
          <LabelValueItem label="Last Visit" :value="history.lastVisit" />
          <LabelValueItem label="Visit Count" :value="history.visitCount" />
          <LabelValueItem label="Referrer" :value="history.referrer || 'Direct / None'" />
          <LabelValueItem label="Navigation Type" :value="history.navigationType" />
          <LabelValueItem label="Session Duration" :value="history.sessionDuration" />
        </dl>
      </section>

      <footer class="text-center pt-8 pb-4 text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} WhoAmI.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, onMounted, reactive, computed, watch } from 'vue';
import LabelValueItem from './LabelValueItem.vue';
import MapDisplay from './MapDisplay.vue';

interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

interface UserAgentDataBrand {
  brand: string;
  version: string;
}
interface UserAgentData {
  brands?: UserAgentDataBrand[];
  mobile?: boolean;
  platform?: string;
  // Potentially more properties based on the spec
  [key: string]: any; 
}

interface PerformanceResource {
  name: string;
  duration: number;
  size: string;
}

// Reactive state for user information
const userInfo = reactive({
  // IP & Location
  ipAddress: undefined as string | undefined,
  city: undefined as string | undefined,
  region: undefined as string | undefined,
  country: undefined as string | undefined,
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  isp: undefined as string | undefined,
  ipTimezone: undefined as string | undefined,

  // Browser & OS
  userAgent: navigator.userAgent,
  browserNameVersion: 'N/A',
  osNameVersion: 'N/A',
  isMobile: false,
  platform: navigator.platform,
  vendor: navigator.vendor,
  language: navigator.language,
  languages: navigator.languages ? navigator.languages.join(', ') : 'N/A',

  // Display & Screen
  screenWidth: screen.width,
  screenHeight: screen.height,
  availScreenWidth: screen.availWidth,
  availScreenHeight: screen.availHeight,
  windowInnerWidth: window.innerWidth,
  windowInnerHeight: window.innerHeight,
  colorDepth: screen.colorDepth,
  pixelDepth: screen.pixelDepth, // May be same as colorDepth or undefined
  devicePixelRatio: window.devicePixelRatio,
  screenOrientation: screen.orientation?.type || 'N/A',

  // Hardware & Performance
  cpuCores: navigator.hardwareConcurrency || 'N/A',
  deviceMemory: (navigator as any).deviceMemory || 'N/A', // Experimental
  maxTouchPoints: navigator.maxTouchPoints || 0,

  // Network Status
  isOnline: navigator.onLine,
  connectionType: (navigator as any).connection?.type || 'N/A',
  effectiveConnectionType: (navigator as any).connection?.effectiveType || 'N/A',
  downlink: (navigator as any).connection?.downlink || 'N/A',
  rtt: (navigator as any).connection?.rtt || 'N/A',
  saveData: (navigator as any).connection?.saveData || false,

  // Browser Features
  cookiesEnabled: navigator.cookieEnabled,
  doNotTrack: navigator.doNotTrack === '1' ? 'Enabled' : (navigator.doNotTrack === '0' ? 'Disabled' : 'Unspecified'),
  pdfViewerEnabled: (navigator as any).pdfViewerEnabled || 'N/A',
  webdriver: (navigator as any).webdriver || false,
  javaEnabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false, // Deprecated

  // Date & Time
  localDateTime: new Date().toLocaleString(),
  utcDateTime: new Date().toUTCString(),
  timezoneOffset: new Date().getTimezoneOffset(),

  // Battery
  battery: null as BatteryInfo | null | { error: string },
});

// New reactive data objects for new features
const permissions = reactive({
  geolocation: 'Unknown',
  notifications: 'Unknown',
  camera: 'Unknown',
  microphone: 'Unknown'
});

const apiSupport = reactive({
  pushApi: 'PushManager' in window,
  bluetooth: 'bluetooth' in navigator,
  webShare: 'share' in navigator,
  webUsb: 'usb' in navigator,
  webRTC: 'RTCPeerConnection' in window,
  webSpeech: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
});

const sensors = reactive({
  available: 'DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window,
  accelerometer: 'DeviceMotionEvent' in window,
  gyroscope: 'DeviceMotionEvent' in window,
  magnetometer: 'DeviceOrientationEvent' in window,
  ambientLight: 'AmbientLightSensor' in window,
  deviceOrientation: 'DeviceOrientationEvent' in window,
  liveData: null as string | null
});

const storage = reactive({
  localStorage: typeof localStorage !== 'undefined' ? 'Available' : 'Not Available',
  sessionStorage: typeof sessionStorage !== 'undefined' ? 'Available' : 'Not Available',
  indexedDB: 'indexedDB' in window,
  cacheAPI: 'caches' in window,
  usage: 'Checking...',
  quota: 'Checking...',
  persistentStorage: 'Checking...'
});

const media = reactive({
  webgl: 'Checking...',
  webgl2: 'Checking...',
  canvas: !!document.createElement('canvas').getContext,
  audio: !!window.AudioContext || !!(window as any).webkitAudioContext,
  videoFormats: 'Checking...',
  audioFormats: 'Checking...',
  webrtc: 'RTCPeerConnection' in window,
  gpuInfo: null as string | null
});

const performance = reactive({
  pageLoadTime: 0,
  domContentLoaded: 0,
  firstPaint: 0,
  firstContentfulPaint: 0,
  resources: [] as PerformanceResource[]
});

const security = reactive({
  isHttps: window.location.protocol === 'https:',
  csp: null as string | null,
  coop: null as string | null,
  referrerPolicy: null as string | null,
  thirdPartyCookies: true, // Will be checked
  incognito: false, // Will be detected
  adBlocker: false // Will be detected
});

const fonts = reactive({
  systemFont: 'Checking...',
  defaultSize: parseFloat(window.getComputedStyle(document.body).fontSize),
  smoothing: 'Checking...',
  available: {} as Record<string, boolean>
});

const a11y = reactive({
  prefersReducedMotion: false,
  prefersColorScheme: 'No Preference',
  prefersContrast: 'No Preference',
  forcedColors: 'None',
  screenReader: false,
  keyboardNav: false
});

const history = reactive({
  firstVisit: 'First visit',
  lastVisit: 'N/A',
  visitCount: 1,
  referrer: document.referrer,
  navigationType: 'N/A',
  sessionDuration: '0:00',
  sessionStart: Date.now()
});

// Weather and Geographic Information
const weather = reactive({
  loading: true,
  error: null as string | null,
  location: '',
  description: '',
  temperature: 0,
  feelsLike: 0,
  humidity: 0,
  windSpeed: 0,
  windDirection: '',
  pressure: 0,
  visibility: 0,
  clouds: 0,
  sunrise: '',
  sunset: '',
  icon: '',
  units: 'metric',
  forecast: [] as Array<{
    date: string;
    icon: string;
    tempMax: number;
    tempMin: number;
    description: string;
  }>
});

const geo = reactive({
  loading: true,
  error: null as string | null,
  elevation: 0,
  localTime: '',
  timezone: '',
  countryCode: '',
  country: '',
  currency: '',
  languages: '',
  cityPopulation: 'N/A',
  countryPopulation: 'N/A',
  nearbyPlaces: [] as Array<{
    name: string;
    distance: number;
  }>
});

const isLoading = ref(true);
const ipError = ref<string | null>(null);

// Helper function to format bytes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Fetch weather data
const fetchWeatherData = async (lat: number, lon: number) => {
  try {
    weather.loading = true;
    weather.error = null;
    
    // Using OpenWeatherMap API (you'll need to replace 'YOUR_API_KEY' with an actual key)
    // For demo purposes, we'll handle this differently
    const apiKey = 'demo_mode'; // Replace with your actual API key
    
    if (apiKey === 'demo_mode') {
      // Demo mode - simulate weather data based on location
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const season = getSeason(lat);
      const temp = getRandomTemp(season, lat);
      
      weather.location = `${userInfo.city || 'Your Location'}, ${userInfo.country || ''}`;
      weather.description = getWeatherDesc(season);
      weather.temperature = temp;
      weather.feelsLike = temp + (Math.random() > 0.5 ? -2 : 2);
      weather.humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
      weather.windSpeed = Math.floor(Math.random() * 20) + 5;
      weather.windDirection = getWindDirection();
      weather.pressure = Math.floor(Math.random() * 50) + 1000; // 1000-1050 hPa
      weather.visibility = Math.floor(Math.random() * 5) + 5; // 5-10 km
      weather.clouds = Math.floor(Math.random() * 100);
      
      // Set sunrise/sunset based on rough latitude
      const now = new Date();
      const baseDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      
      // Adjust sunrise/sunset times based on latitude and season
      let sunriseHour = 6; // Default
      let sunsetHour = 18; // Default
      
      if (Math.abs(lat) > 45) { // Far north or south
        if (season === 'summer') {
          sunriseHour = lat > 0 ? 4 : 7; // Earlier in northern summer, later in southern summer
          sunsetHour = lat > 0 ? 21 : 17; // Later in northern summer, earlier in southern summer
        } else if (season === 'winter') {
          sunriseHour = lat > 0 ? 8 : 5; // Later in northern winter, earlier in southern winter
          sunsetHour = lat > 0 ? 16 : 20; // Earlier in northern winter, later in southern winter
        }
      }
      
      const sunrise = new Date(baseDay);
      sunrise.setHours(sunriseHour, Math.floor(Math.random() * 60));
      const sunset = new Date(baseDay);
      sunset.setHours(sunsetHour, Math.floor(Math.random() * 60));
      
      weather.sunrise = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      weather.sunset = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Set weather icon based on description
      weather.icon = getWeatherIcon(weather.description);
      
      // Generate 5-day forecast
      weather.forecast = [];
      const forecastTemp = temp;
      for (let i = 0; i < 5; i++) {
        const forecastDate = new Date();
        forecastDate.setDate(forecastDate.getDate() + i + 1);
        
        const variance = Math.floor(Math.random() * 6) - 3; // -3 to +3 degrees variance
        const dayTemp = forecastTemp + variance;
        const nightTemp = dayTemp - (Math.floor(Math.random() * 5) + 3); // 3-8 degrees cooler at night
        
        weather.forecast.push({
          date: forecastDate.toLocaleDateString([], { weekday: 'short' }),
          icon: getWeatherIcon(getWeatherDesc(season)),
          tempMax: Math.round(dayTemp),
          tempMin: Math.round(nightTemp),
          description: getWeatherDesc(season)
        });
      }
    } else {
      // Actual API implementation would go here
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${weather.units}&appid=${apiKey}`);
      const data = await response.json();
      
      if (data.cod !== 200) {
        throw new Error(data.message || 'Failed to fetch weather data');
      }
      
      weather.location = data.name + ', ' + data.sys.country;
      weather.description = data.weather[0].description;
      weather.temperature = Math.round(data.main.temp);
      weather.feelsLike = Math.round(data.main.feels_like);
      weather.humidity = data.main.humidity;
      weather.windSpeed = data.wind.speed;
      weather.windDirection = getWindDirectionFromDegrees(data.wind.deg);
      weather.pressure = data.main.pressure;
      weather.visibility = data.visibility / 1000; // Convert to km
      weather.clouds = data.clouds.all;
      
      const sunriseDate = new Date(data.sys.sunrise * 1000);
      const sunsetDate = new Date(data.sys.sunset * 1000);
      weather.sunrise = sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      weather.sunset = sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      weather.icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      
      // Fetch forecast
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${weather.units}&appid=${apiKey}`);
      const forecastData = await forecastResponse.json();
      
      if (forecastData.cod !== '200') {
        throw new Error(forecastData.message || 'Failed to fetch forecast data');
      }
      
      const dailyForecasts = new Map();
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString();
        
        if (!dailyForecasts.has(day)) {
          dailyForecasts.set(day, {
            date: date.toLocaleDateString([], { weekday: 'short' }),
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
            tempMax: Math.round(item.main.temp_max),
            tempMin: Math.round(item.main.temp_min),
            description: item.weather[0].description
          });
        } else {
          const existing = dailyForecasts.get(day);
          if (item.main.temp_max > existing.tempMax) {
            existing.tempMax = Math.round(item.main.temp_max);
          }
          if (item.main.temp_min < existing.tempMin) {
            existing.tempMin = Math.round(item.main.temp_min);
          }
        }
      }
      
      weather.forecast = Array.from(dailyForecasts.values()).slice(0, 5);
    }
  } catch (error: any) {
    console.error('Error fetching weather:', error);
    weather.error = `Could not load weather data: ${error?.message || 'Unknown error'}`;
  } finally {
    weather.loading = false;
  }
};

// Helper functions for demo mode
const getSeason = (lat: number) => {
  const month = new Date().getMonth();
  
  // Northern hemisphere
  if (lat >= 0) {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  } 
  // Southern hemisphere
  else {
    if (month >= 2 && month <= 4) return 'autumn';
    if (month >= 5 && month <= 7) return 'winter';
    if (month >= 8 && month <= 10) return 'spring';
    return 'summer';
  }
};

const getRandomTemp = (season: string, lat: number) => {
  const latAbs = Math.abs(lat);
  let baseTemp = 20; // Default base temperature
  
  // Adjust base temperature based on latitude (cooler at high latitudes)
  if (latAbs > 60) baseTemp -= 15;
  else if (latAbs > 45) baseTemp -= 10;
  else if (latAbs > 30) baseTemp -= 5;
  else if (latAbs < 15) baseTemp += 5; // Warmer in tropics
  
  // Adjust for season
  switch(season) {
    case 'winter': baseTemp -= 15; break;
    case 'autumn': baseTemp -= 5; break;
    case 'spring': baseTemp += 0; break;
    case 'summer': baseTemp += 10; break;
  }
  
  // Add some randomness
  const randomVariance = Math.floor(Math.random() * 10) - 5; // -5 to +5
  return Math.round(baseTemp + randomVariance);
};

const getWeatherDesc = (season: string) => {
  const descriptions = {
    winter: ['Light snow', 'Freezing', 'Partly cloudy', 'Overcast', 'Clear sky', 'Snowfall'],
    spring: ['Light rain', 'Scattered clouds', 'Partly cloudy', 'Moderate rain', 'Sunny intervals'],
    summer: ['Sunny', 'Clear sky', 'Scattered clouds', 'Warm', 'Hot and humid', 'Thunderstorm'],
    autumn: ['Cloudy', 'Light rain', 'Windy', 'Partly cloudy', 'Fog', 'Overcast']
  };
  
  const options = descriptions[season as keyof typeof descriptions] || descriptions.spring;
  return options[Math.floor(Math.random() * options.length)];
};

const getWindDirection = () => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.floor(Math.random() * directions.length)];
};

const getWindDirectionFromDegrees = (deg: number) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round((deg % 360) / 22.5) % 16];
};

const getWeatherIcon = (description: string) => {
  // Map common descriptions to icon codes (using Font Awesome or similar)
  const lowerDesc = description.toLowerCase();
  
  // For a demo, we could return simple emoji or placeholder images
  if (lowerDesc.includes('rain')) return '🌧️';
  if (lowerDesc.includes('snow')) return '❄️';
  if (lowerDesc.includes('cloud')) return '☁️';
  if (lowerDesc.includes('clear') || lowerDesc.includes('sunny')) return '☀️';
  if (lowerDesc.includes('thunder')) return '⛈️';
  if (lowerDesc.includes('fog') || lowerDesc.includes('mist')) return '🌫️';
  if (lowerDesc.includes('wind')) return '💨';
  
  // Default
  return '🌤️';
};

// Fetch geographic data
// @ts-ignore
const fetchGeographicData = async (lat: number, lon: number) => {
  try {
    geo.loading = true;
    geo.error = null;
    
    // In a real implementation, you would use APIs like OpenStreetMap/Nominatim,
    // RestCountries API, etc. For demo purposes, we'll simulate the response.
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
    
    // Demo data based on location
    geo.elevation = Math.floor(Math.random() * 1000); // Random elevation
    
    // Local time based on timezone
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    geo.localTime = now.toLocaleString(undefined, options);
    geo.timezone = userInfo.ipTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Country information (should be updated with real data in production)
    geo.countryCode = userInfo.country || 'Unknown';
    geo.country = getCountryName(geo.countryCode);
    
    // Demo data for currency and languages
    const countryCurrencies: Record<string, string> = {
      'US': 'USD - United States Dollar',
      'GB': 'GBP - British Pound',
      'CA': 'CAD - Canadian Dollar',
      'AU': 'AUD - Australian Dollar',
      'DE': 'EUR - Euro',
      'FR': 'EUR - Euro',
      'JP': 'JPY - Japanese Yen',
      'CN': 'CNY - Chinese Yuan',
      'IN': 'INR - Indian Rupee',
      'BR': 'BRL - Brazilian Real',
    };
    
    const countryLanguages: Record<string, string> = {
      'US': 'English',
      'GB': 'English',
      'CA': 'English, French',
      'AU': 'English',
      'DE': 'German',
      'FR': 'French',
      'JP': 'Japanese',
      'CN': 'Mandarin, Cantonese',
      'IN': 'Hindi, English, and many regional languages',
      'BR': 'Portuguese',
    };
    
    geo.currency = countryCurrencies[geo.countryCode] || 'Unknown';
    geo.languages = countryLanguages[geo.countryCode] || 'Unknown';
    
    // Demo population data
    const demoPopulations: Record<string, any> = {
      'New York': {city: '8.8 million', country: '332 million'},
      'London': {city: '9.5 million', country: '67 million'},
      'Paris': {city: '2.1 million', country: '67 million'},
      'Tokyo': {city: '13.9 million', country: '126 million'},
      'Sydney': {city: '5.3 million', country: '25 million'},
      'Berlin': {city: '3.7 million', country: '83 million'},
      'Mumbai': {city: '20.4 million', country: '1.38 billion'},
      'São Paulo': {city: '12.3 million', country: '212 million'},
    };
    
    if (userInfo.city && demoPopulations[userInfo.city]) {
      geo.cityPopulation = demoPopulations[userInfo.city].city;
      geo.countryPopulation = demoPopulations[userInfo.city].country;
    } else {
      // Generate random but realistic population figures
      const randomCitySize = Math.floor(Math.random() * 10) + 1;
      geo.cityPopulation = randomCitySize < 3 ? 
        `${(Math.random() * 0.5 + 0.1).toFixed(1)} million` : 
        `${(Math.random() * 5 + 1).toFixed(1)} million`;
        
      const countrySizes: Record<string, string> = {
        'US': '332 million',
        'GB': '67 million',
        'CA': '38 million',
        'AU': '25 million',
        'DE': '83 million',
        'FR': '67 million',
        'JP': '126 million',
        'CN': '1.4 billion',
        'IN': '1.38 billion',
        'BR': '212 million',
      };
      
      geo.countryPopulation = countrySizes[geo.countryCode] || `${Math.floor(Math.random() * 100) + 1} million`;
    }
    
    // Generate nearby places (fictitious for demo)
    geo.nearbyPlaces = [];
    const numPlaces = Math.floor(Math.random() * 3) + 3; // 3-5 places
    
    const placeTypes = ['Park', 'Lake', 'Mountain', 'Beach', 'Forest', 'River', 'Valley'];
    const placeNames = ['Grand', 'Royal', 'Golden', 'Silver', 'Crystal', 'Emerald', 'Blue', 'Green', 'Red', 'White'];
    
    for (let i = 0; i < numPlaces; i++) {
      const placeName = `${placeNames[Math.floor(Math.random() * placeNames.length)]} ${placeTypes[Math.floor(Math.random() * placeTypes.length)]}`;
      const distance = Math.floor(Math.random() * 30) + 1; // 1-30 km
      
      geo.nearbyPlaces.push({
        name: placeName,
        distance: distance
      });
    }
    
    // Sort by distance
    geo.nearbyPlaces.sort((a, b) => a.distance - b.distance);
    
  } catch (error: any) {
    console.error('Error fetching geographic data:', error);
    geo.error = `Could not load geographic data: ${error?.message || 'Unknown error'}`;
  } finally {
    geo.loading = false;
  }
};

// Helper to get country name from country code
const getCountryName = (countryCode: string) => {
  const countryNames: Record<string, string> = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
    // Add more as needed
  };
  
  return countryNames[countryCode] || countryCode;
};

// Detect WebGL support
const checkWebGLSupport = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (gl) {
    // @ts-ignore
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        // @ts-ignore
      media.gpuInfo = `${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)} - ${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}`;
    }
    return 'Supported';
  }
  return 'Not Supported';
};

// Detect WebGL2 support
const checkWebGL2Support = () => {
  const canvas = document.createElement('canvas');
  return canvas.getContext('webgl2') ? 'Supported' : 'Not Supported';
};

// Check if a font is available
const isFontAvailable = (font: string) => {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';
  const h = document.createElement('span');
  
  h.style.fontSize = testSize;
  h.style.fontFamily = baseFonts[0];
  h.innerHTML = testString;
  document.body.appendChild(h);
  
  const defaultWidth = h.offsetWidth;
  const defaultHeight = h.offsetHeight;
  
  for (const baseFont of baseFonts) {
    h.style.fontFamily = `${font}, ${baseFont}`;
    const matched = h.offsetWidth !== defaultWidth || h.offsetHeight !== defaultHeight;
    
    if (matched) {
      document.body.removeChild(h);
      return true;
    }
  }
  
  document.body.removeChild(h);
  return false;
};

// Check for Incognito/Private mode
const detectIncognito = () => {
  return new Promise<boolean>(resolve => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      (navigator.storage.estimate() as Promise<{quota: number}>)
        .then(({quota}) => {
          if (quota < 120000000) {
            resolve(true); // Likely private mode
          } else {
            resolve(false);
          }
        })
        .catch(() => resolve(false));
    } else {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        resolve(false);
      } catch (e) {
        resolve(true); // If localStorage is not available, likely private mode
      }
    }
  });
};

// Detect Ad Blocker
const detectAdBlocker = () => {
  return new Promise<boolean>(resolve => {
    const fakeAd = document.createElement('div');
    fakeAd.className = 'ad_unit adsbox ad-placement ad-zone ad-space';
    fakeAd.style.height = '1px';
    fakeAd.style.position = 'absolute';
    fakeAd.style.opacity = '0';
    document.body.appendChild(fakeAd);
    
    setTimeout(() => {
      const isAdBlocked = !fakeAd.offsetHeight;
      document.body.removeChild(fakeAd);
      resolve(isAdBlocked);
    }, 100);
  });
};

// Get navigation type
const getNavigationType = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    try {
      const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return navEntry ? navEntry.type : 'N/A';
    } catch (error) {
      console.warn("Error accessing navigation type:", error);
      return 'N/A';
    }
  }
  return 'N/A';
};

// Format session duration
const formatSessionDuration = (startTime: number) => {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Check for accessibility preferences
const checkAccessibilityPreferences = () => {
  // Reduced motion
  a11y.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Color scheme
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    a11y.prefersColorScheme = 'Dark';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    a11y.prefersColorScheme = 'Light';
  }
  
  // Contrast
  if (window.matchMedia('(prefers-contrast: more)').matches) {
    a11y.prefersContrast = 'High';
  } else if (window.matchMedia('(prefers-contrast: less)').matches) {
    a11y.prefersContrast = 'Low';
  }
  
  // Forced colors (Windows High Contrast Mode)
  a11y.forcedColors = window.matchMedia('(forced-colors: active)').matches ? 'Active' : 'None';
  
  // Keyboard navigation detection
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      a11y.keyboardNav = true;
    }
  }, { once: true });
};

// Check for screen reader
const detectScreenReader = () => {
  // This is a heuristic and not 100% reliable
  return (
    // JAWS, NVDA (Windows)
    ('speechSynthesis' in window && 
     window.speechSynthesis.getVoices && 
     window.speechSynthesis.getVoices().filter(v => v.name.includes('NVDA') || v.name.includes('JAWS')).length > 0) ||
    // VoiceOver (macOS)
    ('webkitSpeechRecognition' in window && navigator.userAgent.includes('Mac'))
  );
};

// Initialize visit history from localStorage
const initializeVisitHistory = () => {
  try {
    const storageKey = 'whoami_visit_history';
    const storedHistory = localStorage.getItem(storageKey);
    
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      history.firstVisit = parsedHistory.firstVisit;
      history.lastVisit = parsedHistory.lastVisit || 'N/A';
      history.visitCount = (parsedHistory.visitCount || 0) + 1;
    }
    
    // Update for this visit
    const now = new Date().toLocaleString();
    localStorage.setItem(storageKey, JSON.stringify({
      firstVisit: history.firstVisit,
      lastVisit: now,
      visitCount: history.visitCount
    }));
    
    history.navigationType = getNavigationType();
    history.sessionStart = Date.now();
    
    // Update session duration every second
    setInterval(() => {
      history.sessionDuration = formatSessionDuration(history.sessionStart);
    }, 1000);
  } catch (e) {
    console.warn('Unable to access localStorage for visit history:', e);
  }
};

// Check support for media formats
const checkMediaSupport = () => {
  const videoFormats: string[] = [];
  const audioFormats: string[] = [];
  const video = document.createElement('video');
  
  // Common video formats
  const videoTypes = {
    'video/mp4': 'MP4',
    'video/webm': 'WebM',
    'video/ogg': 'Ogg Video'
  };
  
  for (const [mime, label] of Object.entries(videoTypes)) {
    if (video.canPlayType(mime) !== '') {
      videoFormats.push(label);
    }
  }
  
  // Common audio formats
  const audio = document.createElement('audio');
  const audioTypes = {
    'audio/mpeg': 'MP3',
    'audio/wav': 'WAV',
    'audio/ogg': 'Ogg Audio',
    'audio/aac': 'AAC',
    'audio/flac': 'FLAC'
  };
  
  for (const [mime, label] of Object.entries(audioTypes)) {
    if (audio.canPlayType(mime) !== '') {
      audioFormats.push(label);
    }
  }
  
  media.videoFormats = videoFormats.join(', ') || 'None detected';
  media.audioFormats = audioFormats.join(', ') || 'None detected';
};

// Check common fonts
const checkCommonFonts = () => {
  const commonFonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 
    'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 
    'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact', 
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro'
  ];
  
  const available: Record<string, boolean> = {};
  for (const font of commonFonts) {
    available[font] = isFontAvailable(font);
  }
  
  fonts.available = available;
  
  // Detect system font
  const computedFont = window.getComputedStyle(document.body).fontFamily;
  fonts.systemFont = computedFont.split(',')[0].replace(/["']/g, '');
  
  // Detect font smoothing
  // @ts-ignore
  const isSmoothingEnabled = document.body.style.webkitFontSmoothing === 'antialiased' || 
                            // @ts-ignore
                           window.getComputedStyle(document.body).webkitFontSmoothing === 'antialiased' ||
                           // @ts-ignore
                           window.getComputedStyle(document.body).fontSmooth === 'antialiased';
  
  fonts.smoothing = isSmoothingEnabled ? 'Enabled' : 'Not detected';
};

// Collect performance metrics
const collectPerformanceMetrics = () => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    try {
      // Basic timings
      const navTiming = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        performance.pageLoadTime = Math.round(navTiming.loadEventEnd - navTiming.startTime);
        performance.domContentLoaded = Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime);
      }
      
      // First Paint & First Contentful Paint
      const paintEntries = window.performance.getEntriesByType('paint');
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (firstPaint) performance.firstPaint = Math.round(firstPaint.startTime);
      if (firstContentfulPaint) performance.firstContentfulPaint = Math.round(firstContentfulPaint.startTime);
      
      // Resource timings
      const resources = window.performance.getEntriesByType('resource');
      performance.resources = resources.map(res => {
        // @ts-ignore
        const size = res.encodedBodySize || res.transferSize || 0;
        return {
          name: res.name,
          duration: Math.round(res.duration),
          size: formatBytes(size)
        };
      });
    } catch (error) {
      console.warn("Error accessing performance metrics:", error);
      performance.pageLoadTime = 0;
      performance.domContentLoaded = 0;
      performance.firstPaint = 0;
      performance.firstContentfulPaint = 0;
      performance.resources = [];
    }
  } else {
    console.warn("Performance API not fully supported");
    performance.pageLoadTime = 0;
    performance.domContentLoaded = 0;
    performance.firstPaint = 0;
    performance.firstContentfulPaint = 0;
    performance.resources = [];
  }
};

// Check storage quota
const checkStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const quota = estimate.quota || 0;
      const usage = estimate.usage || 0;
      
      storage.quota = formatBytes(quota);
      storage.usage = formatBytes(usage);
      
      // Check if persistent storage is granted
      if ('persist' in navigator.storage && 'persisted' in navigator.storage) {
        const isPersisted = await navigator.storage.persisted();
        storage.persistentStorage = isPersisted ? 'Granted' : 'Not Granted';
      } else {
        storage.persistentStorage = 'API Not Available';
      }
    } catch (e) {
      console.warn('Storage API error:', e);
      storage.quota = 'Error estimating';
      storage.usage = 'Error estimating';
    }
  } else {
    storage.quota = 'API Not Available';
    storage.usage = 'API Not Available';
  }
};

// Get security headers
const getSecurityHeaders = () => {
  if (document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    security.csp = 'Set via meta tag';
  } else {
    security.csp = 'Not detected via meta tag';
  }
  
  if (document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]')) {
    security.coop = 'Set via meta tag';
  } else {
    security.coop = 'Not detected via meta tag';
  }
  
  if (document.querySelector('meta[name="referrer"]')) {
    const referrerMeta = document.querySelector('meta[name="referrer"]');
    security.referrerPolicy = referrerMeta ? referrerMeta.getAttribute('content') : 'Not set via meta tag';
  } else {
    security.referrerPolicy = 'Not detected via meta tag';
  }
};

onMounted(async () => {
  isLoading.value = true;
  ipError.value = null;

  // --- Fetch IP Information ---
  try {
    // First get the IP address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) {
      throw new Error(`Failed to fetch IP: ${ipResponse.statusText}`);
    }
    const ipData = await ipResponse.json();
    userInfo.ipAddress = ipData.ip;
    
    // Then get the location information using the IP
    const infoResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
    if (!infoResponse.ok) {
      throw new Error(`Failed to fetch location: ${infoResponse.statusText}`);
    }
    const data = await infoResponse.json();
    
    // Map the response fields to our userInfo object
    userInfo.city = data.city;
    userInfo.region = data.region;
    userInfo.country = data.country;
    userInfo.isp = data.org;
    userInfo.ipTimezone = data.timezone;
    
    // Parse coordinates (they come as a string like "37.7749,-122.4194")
    if (data.loc) {
      const [lat, long] = data.loc.split(',');
      userInfo.latitude = parseFloat(lat);
      userInfo.longitude = parseFloat(long);
      
      // Fetch weather and geographic data once we have coordinates
      fetchWeatherData(userInfo.latitude, userInfo.longitude);
      fetchGeographicData(userInfo.latitude, userInfo.longitude);
    }
  } catch (error: any) {
    console.error("Error fetching IP info:", error);
    ipError.value = `Could not load IP information: ${error?.message}`;
    userInfo.ipAddress = 'Error fetching';
  }

  // --- User Agent Data (Client Hints) ---
  if ('userAgentData' in navigator) {
    const uaData = (navigator as any).userAgentData as UserAgentData;
    if (uaData.brands && uaData.brands.length > 0) {
      // Filter out "Chromium" and "Google Chrome" if "Microsoft Edge" is present, or similar logic
      const primaryBrand = uaData.brands.find(b => !['Chromium', 'Google Chrome', 'Not;A=Brand'].includes(b.brand)) || uaData.brands[0];
      userInfo.browserNameVersion = `${primaryBrand.brand} ${primaryBrand.version}`;
    }
    userInfo.osNameVersion = uaData.platform || 'N/A';
    userInfo.isMobile = uaData.mobile || false;
  } else {
    // Basic fallback if userAgentData is not available (parsing userAgent is unreliable)
    userInfo.browserNameVersion = 'N/A (UAData not supported)';
    userInfo.osNameVersion = 'N/A (UAData not supported)';
  }

  // --- Battery API ---
  if ('getBattery' in navigator) {
    try {
      const batteryManager = await (navigator as any).getBattery();
      const updateBatteryInfo = () => {
        userInfo.battery = {
          charging: batteryManager.charging,
          level: batteryManager.level,
          chargingTime: batteryManager.chargingTime,
          dischargingTime: batteryManager.dischargingTime,
        };
      };
      updateBatteryInfo();
      batteryManager.addEventListener('chargingchange', updateBatteryInfo);
      batteryManager.addEventListener('levelchange', updateBatteryInfo);
      batteryManager.addEventListener('chargingtimechange', updateBatteryInfo);
      batteryManager.addEventListener('dischargingtimechange', updateBatteryInfo);
    } catch (error) {
      console.warn("Battery Status API error:", error);
      userInfo.battery = { error: "Battery API not accessible or error." };
    }
  } else {
    userInfo.battery = { error: "Battery API not supported." };
  }

  // --- Check permissions ---
  if ('permissions' in navigator) {
    try {
      const geoStatus = await navigator.permissions.query({name: 'geolocation'});
      permissions.geolocation = geoStatus.state;
      
      const notifStatus = await navigator.permissions.query({name: 'notifications'});
      permissions.notifications = notifStatus.state;
      
      // Camera and microphone might not be queryable in all browsers
      try {
        const camStatus = await navigator.permissions.query({name: 'camera' as PermissionName});
        permissions.camera = camStatus.state;
      } catch (e) {
        permissions.camera = 'Not supported';
      }
      
      try {
        const micStatus = await navigator.permissions.query({name: 'microphone' as PermissionName});
        permissions.microphone = micStatus.state;
      } catch (e) {
        permissions.microphone = 'Not supported';
      }
    } catch (e) {
      console.warn('Permissions API error:', e);
    }
  }

  // --- Initialize sensors ---
  if (sensors.available) {
    window.addEventListener('devicemotion', (event) => {
      sensors.liveData = JSON.stringify({
        acceleration: {
          x: event.acceleration?.x?.toFixed(2) || 'N/A',
          y: event.acceleration?.y?.toFixed(2) || 'N/A',
          z: event.acceleration?.z?.toFixed(2) || 'N/A'
        }
      }, null, 2);
    }, { once: true });
  }

  // --- Check media capabilities ---
  media.webgl = checkWebGLSupport();
  media.webgl2 = checkWebGL2Support();
  checkMediaSupport();
  
  // --- Check storage quota ---
  await checkStorageQuota();
  
  // --- Detect security features ---
  getSecurityHeaders();
  security.thirdPartyCookies = document.cookie.indexOf('test_3pc=1') !== -1;
  security.incognito = await detectIncognito();
  security.adBlocker = await detectAdBlocker();
  
  // --- Check fonts ---
  checkCommonFonts();
  
  // --- Check accessibility features ---
  checkAccessibilityPreferences();
  a11y.screenReader = detectScreenReader();
  
  // --- Initialize visit history ---
  initializeVisitHistory();
  
  // --- Collect performance metrics ---
  collectPerformanceMetrics();

  // Add a watcher to fetch weather if coordinates change later
  watch(() => [userInfo.latitude, userInfo.longitude], ([newLat, newLong], [oldLat, oldLong]) => {
    if (newLat && newLong && (newLat !== oldLat || newLong !== oldLong)) {
      fetchWeatherData(newLat, newLong);
      fetchGeographicData(newLat, newLong);
    }
  });

  // --- Dynamic Window Size ---
  window.addEventListener('resize', () => {
    userInfo.windowInnerWidth = window.innerWidth;
    userInfo.windowInnerHeight = window.innerHeight;
    userInfo.screenOrientation = screen.orientation?.type || 'N/A';
  });
  
  // --- Network Information Events ---
  if ((navigator as any).connection) {
    const connection = (navigator as any).connection;
    const updateConnectionInfo = () => {
      userInfo.connectionType = connection.type || 'N/A';
      userInfo.effectiveConnectionType = connection.effectiveType || 'N/A';
      userInfo.downlink = connection.downlink || 'N/A';
      userInfo.rtt = connection.rtt || 'N/A';
      userInfo.saveData = connection.saveData || false;
    };
    updateConnectionInfo(); // Initial call
    connection.addEventListener('change', updateConnectionInfo);
  }

  // --- Online/Offline Events ---
  window.addEventListener('online', () => userInfo.isOnline = true);
  window.addEventListener('offline', () => userInfo.isOnline = false);

  // --- Update Time Regularly ---
  setInterval(() => {
    userInfo.localDateTime = new Date().toLocaleString();
    userInfo.utcDateTime = new Date().toUTCString();
  }, 1000);

  isLoading.value = false;
});
</script>

<style scoped>
.bg-gray-900 {
  background-image: linear-gradient(to bottom right, #111827, #1f2937);
}
</style>