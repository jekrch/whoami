<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
    <header class="mb-8 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-sky-400">WhoAmI?</h1>
      <p class="mt-2 text-lg text-gray-400"></p>
    </header>

    <div v-if="isLoading" class="text-center py-10">
      <svg class="animate-spin h-10 w-10 text-sky-500 mx-auto" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24">
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
        <p v-if="ipError" class="mt-4 text-sm text-red-400">{{ ipError }}</p>
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

      <section v-if="userInfo.battery !== null" class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">🔋 Battery Status</h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <LabelValueItem label="Battery Level" :value="userInfo.battery?.level !== undefined ? `${(userInfo.battery.level * 100).toFixed(0)}%` : 'N/A'" />
          <LabelValueItem label="Charging" :value="userInfo.battery?.charging" />
          <LabelValueItem label="Charging Time" :value="userInfo.battery?.chargingTime === Infinity ? 'Infinity' : userInfo.battery?.chargingTime" />
          <LabelValueItem label="Discharging Time" :value="userInfo.battery?.dischargingTime === Infinity ? 'Infinity' : userInfo.battery?.dischargingTime" />
        </dl>
      </section>

      <section class="bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl p-6">
        <h2 class="text-2xl font-semibold text-sky-500 mb-4 border-b border-gray-700 pb-2">📤 HTTP Headers (Examples)</h2>
        <p class="text-sm text-gray-400 mb-3">
          Note: Full incoming HTTP headers are typically only accessible server-side. 
          Below are examples of common headers your browser <span class="italic">might</span> send with requests.
        </p>
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LabelValueItem label="Accept" value="text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8" />
            <LabelValueItem label="Accept-Language" :value="userInfo.language || 'en-US,en;q=0.5'" />
            <LabelValueItem label="Accept-Encoding" value="gzip, deflate, br" />
            <LabelValueItem label="User-Agent" :value="userInfo.userAgent" />
            <LabelValueItem label="Connection" value="keep-alive" />
            <LabelValueItem label="Upgrade-Insecure-Requests" value="1 (typically for initial HTTP request)" />
            <LabelValueItem label="Sec-Fetch-Dest" value="document" />
            <LabelValueItem label="Sec-Fetch-Mode" value="navigate" />
            <LabelValueItem label="Sec-Fetch-Site" value="none / same-origin / cross-site" />
            <LabelValueItem label="Sec-Fetch-User" value="?1 (indicates user activation)" />
        </dl>
      </section>

      <footer class="text-center pt-8 pb-4 text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} WhoAmI. Information gathered from your browser.</p>
        <p class="mt-1">Some information might be approximate or unavailable depending on your browser and settings.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import LabelValueItem from './LabelValueItem.vue';

// Define interfaces for structured data
interface IpInfo {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string; // Mapped to country
  latitude?: number;
  longitude?: number;
  org?: string; // Mapped to isp
  timezone?: string; // Mapped to ipTimezone
}

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
  pdfViewerEnabled: navigator.pdfViewerEnabled,
  webdriver: navigator.webdriver,
  javaEnabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false, // Deprecated

  // Date & Time
  localDateTime: new Date().toLocaleString(),
  utcDateTime: new Date().toUTCString(),
  timezoneOffset: new Date().getTimezoneOffset(),

  // Battery
  battery: null as BatteryInfo | null | { error: string },
});

const isLoading = ref(true);
const ipError = ref<string | null>(null);

// Helper to safely get a value or return 'N/A'
const getSafe = <T>(getter: () => T, defaultValue: any = 'N/A'): T | string => {
  try {
    const value = getter();
    return value === undefined || value === null ? defaultValue : value;
  } catch (error) {
    console.warn('Error getting value:', error);
    return defaultValue;
  }
};


onMounted(async () => {
  isLoading.value = true;
  ipError.value = null;

  // --- Fetch IP Information ---
  try {
    const response = await fetch('[https://ipapi.co/json/](https://ipapi.co/json/)');
    if (!response.ok) {
      throw new Error(`Failed to fetch IP info: ${response.statusText}`);
    }
    const data: IpInfo = await response.json();
    userInfo.ipAddress = data.ip;
    userInfo.city = data.city;
    userInfo.region = data.region;
    userInfo.country = data.country_name;
    userInfo.latitude = data.latitude;
    userInfo.longitude = data.longitude;
    userInfo.isp = data.org;
    userInfo.ipTimezone = data.timezone;
  } catch (error: any) {
    console.error("Error fetching IP info:", error);
    ipError.value = `Could not load IP information: ${error.message}. Some ad-blockers or privacy extensions might block this.`;
    // Set defaults or leave as undefined
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
