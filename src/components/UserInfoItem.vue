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
          <LabelValueItem label="Latitude" :value="userInfo.latitude?.toFixed(4)" />
          <LabelValueItem label="Longitude" :value="userInfo.longitude?.toFixed(4)" />
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
            Hardware
          </h2>
          <dl class="space-y-4">
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">CPU Cores</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.cpuCores }}</dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Device Memory (RAM)</dt>
              <dd class="text-xl font-medium text-white">{{ userInfo.deviceMemory }}{{ typeof userInfo.deviceMemory === 'number' ? ' GB' : '' }}</dd>
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
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4"> 
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Connection Type</dt>
            <dd class="text-lg xl:text-xl font-medium text-white">{{ userInfo.connectionType }}</dd> 
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Effective Type</dt>
            <dd class="text-lg xl:text-xl font-medium text-white">{{ userInfo.effectiveConnectionType }}</dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Downlink Speed</dt> 
            <dd class="text-lg xl:text-xl font-medium text-white">{{ userInfo.downlink }}{{ typeof userInfo.downlink === 'number' ? ' Mbps' : (userInfo.downlink === 'N/A' ? '' : '') }}</dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Round Trip Time (RTT)</dt>
            <dd class="text-lg xl:text-xl font-medium text-white">{{ userInfo.rtt }}{{ typeof userInfo.rtt === 'number' ? ' ms' : (userInfo.rtt === 'N/A' ? '' : '') }}</dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Data Saver Mode</dt>
            <dd class="text-lg xl:text-xl font-medium text-white">{{ typeof userInfo.saveData === 'boolean' ? (userInfo.saveData ? 'Enabled' : 'Disabled') : 'N/A' }}</dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Online Status</dt>
            <dd class="flex items-center">
              <span class="inline-block w-3 h-3 rounded-full mr-2" :class="userInfo.isOnline ? 'bg-green-500' : 'bg-red-500'"></span>
              <span class="text-lg xl:text-xl font-medium text-white">{{ userInfo.isOnline ? 'Online' : 'Offline' }}</span>
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
                               permissions.geolocation === 'denied' ? 'bg-red-500' : 
                               permissions.geolocation === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.geolocation }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Notifications</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.notifications === 'granted' ? 'bg-green-500' : 
                               permissions.notifications === 'denied' ? 'bg-red-500' :
                               permissions.notifications === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.notifications }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Camera</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.camera === 'granted' ? 'bg-green-500' : 
                               permissions.camera === 'denied' ? 'bg-red-500' :
                               permissions.camera === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.camera }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Microphone</dt>
              <dd class="flex items-center">
                <span class="inline-block w-3 h-3 rounded-full mr-2" 
                      :class="permissions.microphone === 'granted' ? 'bg-green-500' : 
                               permissions.microphone === 'denied' ? 'bg-red-500' :
                               permissions.microphone === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                <span class="text-lg font-medium text-white capitalize">{{ permissions.microphone }}</span>
              </dd>
            </div>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium text-white mb-3">API Support</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div v-for="(supported, api) in apiSupport" :key="api" 
                   class="flex items-center justify-between px-3 py-2 rounded-lg" 
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
                      :class="security.csp && security.csp.startsWith('Set') ? 'bg-green-500' : 'bg-yellow-500'"></span>
                <span class="text-lg font-medium text-white">{{ security.csp && security.csp.startsWith('Set') ? 'Enabled' : (security.csp || 'Not Detected') }}</span>
              </dd>
            </div>
            <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
              <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Referrer Policy</dt>
              <dd class="text-lg font-medium text-white capitalize">{{ security.referrerPolicy || 'None' }}</dd>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">Page Load Time</dt>
            <dd class="text-2xl font-medium text-white">{{ performanceMetrics.pageLoadTime >= 0 ? performanceMetrics.pageLoadTime : 'N/A' }}
              <span class="text-sm text-gray-400" v-if="performanceMetrics.pageLoadTime >= 0">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">DOM Content Loaded</dt>
            <dd class="text-2xl font-medium text-white">{{ performanceMetrics.domContentLoaded >= 0 ? performanceMetrics.domContentLoaded : 'N/A' }}
              <span class="text-sm text-gray-400" v-if="performanceMetrics.domContentLoaded >= 0">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">First Paint (FP)</dt>
            <dd class="text-2xl font-medium text-white">{{ performanceMetrics.firstPaint >= 0 ? performanceMetrics.firstPaint : 'N/A' }}
              <span class="text-sm text-gray-400" v-if="performanceMetrics.firstPaint >= 0">ms</span>
            </dd>
          </div>
          <div class="bg-gray-800/20 p-4 rounded-xl border border-gray-700/30">
            <dt class="text-xs uppercase tracking-wider text-gray-500 mb-1">First Contentful Paint (FCP)</dt>
            <dd class="text-2xl font-medium text-white">{{ performanceMetrics.firstContentfulPaint >= 0 ? performanceMetrics.firstContentfulPaint : 'N/A' }}
              <span class="text-sm text-gray-400" v-if="performanceMetrics.firstContentfulPaint >= 0">ms</span>
            </dd>
          </div>
        </div>
        <div class="mt-6">
          <h3 class="text-lg font-medium text-white mb-3">Resource Timing (Top 5)</h3>
          <div v-if="performanceMetrics.resources.length > 0" class="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs uppercase bg-gray-800/50 text-gray-400">
                  <tr>
                    <th class="px-4 py-3">Resource</th>
                    <th class="px-4 py-3 w-28 text-right">Duration (ms)</th>
                    <th class="px-4 py-3 w-24 text-right">Size</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-800/50">
                  <tr v-for="(resource, index) in performanceMetrics.resources.slice(0, 5)" :key="index" class="bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
                    <td class="px-4 py-3 truncate max-w-xs sm:max-w-md md:max-w-lg">{{ resource.name }}</td>
                    <td class="px-4 py-3 text-amber-300 text-right">{{ resource.duration }}</td>
                    <td class="px-4 py-3 text-emerald-300 text-right">{{ resource.size }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
           <p v-else class="text-gray-400 text-sm">No resource timing data available or API not supported.</p>
        </div>
      </section>

      <footer class="text-center pt-10 pb-6">
        <div class="flex justify-center space-x-4 mb-4">
          <a href="https://www.github.com/jekrch/whoami" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">GitHub</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
        <p class="text-gray-500 text-sm">
          <span class="bg-gradient-to-r from-indigo-300 via-emerald-300 to-green-300 text-transparent bg-clip-text font-medium">WhoAmI</span> 
          — A digital fingerprinting dashboard &copy; {{ new Date().getFullYear() }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore: Assuming LabelValueItem.vue and MapDisplay.vue are present
import LabelValueItem from './LabelValueItem.vue';
// @ts-ignore
import MapDisplay from './MapDisplay.vue';
import { useDigitalFingerprint } from '../composables/useDigitalFingerprint'; // Adjust path as needed

const {
  isLoading,
  ipError,
  userInfo,
  permissions,
  apiSupport,
  // sensors, // Uncomment if data from sensors is directly used in template
  // storageInfo, // Uncomment if data from storageInfo is directly used in template
  // media, // Uncomment if data from media is directly used in template
  performanceMetrics,
  security,
  // fonts, // Uncomment if data from fonts is directly used in template
  // a11y, // Uncomment if data from a11y is directly used in template
  history,
} = useDigitalFingerprint();

// The composable handles its own initialization logic (similar to onMounted).
// All reactive data is provided by the composable.
</script>

<style scoped>
.bg-gray-900 {
  background-image: linear-gradient(to bottom right, #111827, #1f2937);
}
</style>