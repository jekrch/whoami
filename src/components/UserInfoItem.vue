

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-900 to-gray-800 text-gray-200 p-4 sm:p-6 lg:p-8 font-sans">
    <header class="mb-12 text-center">
      <h1 class="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-900 via-emerald-300 to-pink-950 text-transparent bg-clip-text tracking-tight">WhoAmI</h1>
      <p class="mt-3 text-lg text-gray-400 max-w-xl mx-auto">A comprehensive digital fingerprint dashboard</p>
    </header>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="relative w-20 h-20">
        <div class="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/30 rounded-full"></div>
        <div class="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
      <p class="mt-6 text-xl text-gray-300 font-light">Gathering your digital shadow...</p>
    </div>

    <div v-else class="space-y-8">
      <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-indigo-900/10 hover:shadow-2xl overflow-hidden relative">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
        <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
          <span class="inline-block p-2 bg-indigo-500/10 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          IP & Location
        </h2>
        <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <LabelValueItem label="IP Address" :value="userInfo.ipAddress" />
          <LabelValueItem label="City" :value="userInfo.city" />
          <LabelValueItem label="Region" :value="userInfo.region" />
          <LabelValueItem label="Country" :value="userInfo.country" />
          <LabelValueItem label="Latitude" :value="userInfo.latitude" />
          <LabelValueItem label="Longitude" :value="userInfo.longitude" />
          <LabelValueItem label="ISP / Organization" :value="userInfo.isp" />
          <LabelValueItem label="Timezone (from IP)" :value="userInfo.ipTimezone" />
        </dl>
        <div v-if="userInfo.latitude && userInfo.longitude" class="mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-800/50">
          <MapDisplay :latitude="userInfo.latitude" :longitude="userInfo.longitude" :zoom-level="15" />
        </div>
        <p v-if="ipError" class="mt-4 text-sm text-red-400">{{ ipError }}</p>
      </section>


      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-emerald-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-emerald-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Browser & OS
          </h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Browser</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.browserNameVersion }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">OS</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.osNameVersion }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Platform</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.platform }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Language</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.language }}</dd>
            </div>
          </dl>
          <div class="mt-4 bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">User Agent</dt>
            <dd class="text-sm font-medium text-gray-300 break-all">{{ userInfo.userAgent }}</dd>
          </div>
        </section>

        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-pink-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-pink-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            Display & Screen
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30 col-span-2">
              <div class="flex flex-col md:flex-row justify-between">
                <div>
                  <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Screen Resolution</dt>
                  <dd class="text-xl font-medium text-white">{{ userInfo.screenWidth }} × {{ userInfo.screenHeight }}</dd>
                </div>
                <div class="mt-4 md:mt-0">
                  <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Window Size</dt>
                  <dd class="text-xl font-medium text-white">{{ userInfo.windowInnerWidth }} × {{ userInfo.windowInnerHeight }}</dd>
                </div>
                <div class="mt-4 md:mt-0">
                  <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Device Pixel Ratio</dt>
                  <dd class="text-xl font-medium text-white">{{ userInfo.devicePixelRatio }}×</dd>
                </div>
              </div>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Color Depth</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.colorDepth }} bit</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Orientation</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.screenOrientation }}</dd>
            </div>
          </div>
        </section>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-amber-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-amber-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </span>
            Hardware & Performance
          </h2>
          <dl class="space-y-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">CPU Cores</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.cpuCores }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Device Memory</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.deviceMemory }} GB</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Max Touch Points</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.maxTouchPoints }}</dd>
            </div>
          </dl>
        </section>

        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-cyan-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-cyan-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </span>
            Network Status
          </h2>
          <dl class="space-y-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Connection Type</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.connectionType }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Effective Type</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.effectiveConnectionType }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Downlink</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.downlink }} Mbps</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Online Status</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" :class="userInfo.isOnline ? 'bg-green-500' : 'bg-red-500'"></span>
                <span class="text-xl font-medium text-white">{{ userInfo.isOnline ? 'Online' : 'Offline' }}</span>
              </dd>
            </div>
          </dl>
        </section>

        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-rose-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-rose-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Date & Time
          </h2>
          <dl class="space-y-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Local Date & Time</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.localDateTime }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">UTC Date & Time</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.utcDateTime }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Timezone Offset</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.timezoneOffset }} minutes from UTC</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Session Duration</dt>
              <dd class="text-xl font-medium text-white">{{ history.sessionDuration }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-blue-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-blue-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
            API Support & Permissions
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Geolocation</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.geolocation === 'granted' ? 'bg-green-500' : 
                              permissions.geolocation === 'denied' ? 'bg-red-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.geolocation }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Notifications</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.notifications === 'granted' ? 'bg-green-500' : 
                              permissions.notifications === 'denied' ? 'bg-red-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.notifications }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Camera</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.camera === 'granted' ? 'bg-green-500' : 
                              permissions.camera === 'denied' ? 'bg-red-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.camera }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Microphone</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.microphone === 'granted' ? 'bg-green-500' : 
                              permissions.microphone === 'denied' ? 'bg-red-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.microphone }}</span>
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white mb-3">API Support</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div v-for="(supported, api) in apiSupport" :key="api" 
                   class="flex items-center px-3 py-2 rounded-lg" 
                   :class="supported ? 'bg-blue-500/10 text-blue-300' : 'bg-gray-800/30 text-gray-400'">
                <span class="text-xs capitalize">{{ api.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}</span>
                <span class="ml-auto">
                  <svg v-if="supported" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-green-900/10 hover:shadow-2xl overflow-hidden relative">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-2xl"></div>
          <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
            <span class="inline-block p-2 bg-green-500/10 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            Security Features
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">HTTPS Connection</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="security.isHttps ? 'bg-green-500' : 'bg-red-500'"></span>
                <span class="text-lg font-medium text-white">{{ security.isHttps ? 'Secure' : 'Not Secure' }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Content Security Policy</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="security.csp ? 'bg-green-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white">{{ security.csp ? 'Enabled' : 'Not Detected' }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Referrer Policy</dt>
              <dd class="text-lg font-medium text-white">{{ security.referrerPolicy || 'None' }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Ad Blocker</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="security.adBlocker ? 'bg-green-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white">{{ security.adBlocker ? 'Detected' : 'Not Detected' }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Incognito Mode</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="security.incognito ? 'bg-purple-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white">{{ security.incognito ? 'Likely Yes' : 'Likely No' }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Cookies Enabled</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="userInfo.cookiesEnabled ? 'bg-blue-500' : 'bg-red-500'"></span>
                <span class="text-lg font-medium text-white">{{ userInfo.cookiesEnabled ? 'Yes' : 'No' }}</span>
              </dd>
            </div>
          </div>
        </section>
      </div>

      <section class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-violet-900/10 hover:shadow-2xl overflow-hidden relative">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-2xl"></div>
        <h2 class="text-2xl font-medium text-white mb-5 flex items-center">
          <span class="inline-block p-2 bg-violet-500/10 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          Performance Metrics
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Page Load Time</dt>
            <dd class="text-2xl font-medium text-white">{{ performance.pageLoadTime }}
              <span class="text-sm text-gray-400">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">DOM Content Loaded</dt>
            <dd class="text-2xl font-medium text-white">{{ performance.domContentLoaded }}
              <span class="text-sm text-gray-400">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">First Paint</dt>
            <dd class="text-2xl font-medium text-white">{{ performance.firstPaint }}
              <span class="text-sm text-gray-400">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">First Contentful Paint</dt>
            <dd class="text-2xl font-medium text-white">{{ performance.firstContentfulPaint }}
              <span class="text-sm text-gray-400">ms</span>
            </dd>
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-medium text-white mb-3">Resource Timing</h3>
          <div class="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-gray-800/50 text-gray-400">
                  <tr>
                    <th class="px-4 py-3">Resource</th>
                    <th class="px-4 py-3 w-24">Duration</th>
                    <th class="px-4 py-3 w-24">Size</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800/50">
                  <tr v-for="(resource, index) in performance.resources.slice(0, 5)" :key="index" class="bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
                    <td class="px-4 py-3 truncate max-w-xs">{{ resource.name }}</td>
                    <td class="px-4 py-3 text-amber-300">{{ resource.duration }} ms</td>
                    <td class="px-4 py-3 text-emerald-300">{{ resource.size }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <footer class="text-center pt-10 pb-6">
        <div class="flex justify-center space-x-4 mb-4">
          <a href="https://www.github.com/jekrch/whoami" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">GitHub</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
        <p class="text-gray-500 text-sm">
          <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text font-medium">WhoAmI</span> 
          — A digital fingerprinting dashboard &copy; {{ new Date().getFullYear() }}
        </p>
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
      
      // geographic data once we have coordinates
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

  // Add a watcher if coordinates change later
  watch(() => [userInfo.latitude, userInfo.longitude], ([newLat, newLong], [oldLat, oldLong]) => {
    if (newLat && newLong && (newLat !== oldLat || newLong !== oldLong)) {
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