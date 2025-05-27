<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-emerald-900 to-gray-800 text-gray-200 font-sans">
    <aside class="flex flex-col fixed top-0 left-0 z-40 w-[3.5em] lg:w-72 h-screen bg-gray-950/80 backdrop-blur-xl border-r border-gray-800/70 shadow-2xl transition-width duration-300 ease-in-out">
      <div class="lg:p-6 lg:pt-8 px-0 pt-6 mb-2 text-center">
        <a href="#" @click.prevent="scrollToTop" class="block hover:opacity-80 transition-opacity duration-200">
          <span class="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text hidden lg:inline">
            WhoAmI
          </span>
          <span class="text-xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text lg:hidden">
            WI
          </span>
        </a>
      </div>
      <nav class="flex-grow lg:px-4 px-0 pb-4 overflow-y-auto space-y-1.5">
        <ul>
          <li v-for="item in navItems" :key="item.id">
            <a :href="'#' + item.id"
               @click.prevent="smoothScrollTo(item.id)"
               class="flex items-center justify-center lg:justify-start p-3 lg:rounded-xl text-gray-400 hover:bg-emerald-500/10 hover:text-emerald-300 group transition-all duration-200 h-12 lg:h-auto"
               :class="{ 'bg-emerald-500/20 text-emerald-200 shadow-md': activeSectionId === item.id }">
              <span v-html="item.icon" class="w-5 h-5 shrink-0 lg:mr-3"></span>
              <span class="text-sm font-medium hidden lg:inline">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="lg:p-4 p-3 mt-auto border-t border-gray-800/60 flex justify-center items-center">
        <p class="text-xs text-gray-500 text-center hidden lg:block">
          &copy; {{ new Date().getFullYear() }}
          <span class="font-medium bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text">WhoAmI</span>
        </p>
        <span class="lg:hidden text-emerald-400 text-xl font-bold">©</span>
      </div>
    </aside>

    <div class="ml-14 lg:ml-72 transition-margin duration-300 ease-in-out">
      <div class="p-4 sm:p-6 lg:p-8">
        <header class="mb-6 sm:mb-6 text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text tracking-tight">WhoAmI</h1>
          <p class="mt-2 sm:mt-3 text-base sm:text-lg text-gray-400 max-w-xl mx-auto">A comprehensive digital fingerprint dashboard</p>
        </header>

        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="relative w-20 h-20">
            <div class="absolute top-0 left-0 w-full h-full border-4 border-emerald-500/30 rounded-full"></div>
            <div class="absolute top-0 left-0 w-full h-full border-4 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p class="mt-6 text-xl text-gray-300 font-light">Gathering your digital shadow...</p>
        </div>

        <main v-else class="space-y-6 sm:space-y-8 md:space-y-10">
          <section id="section-fingerprint" class="backdrop-blur-lg bg-gradient-to-br from-emerald-900/40 to-green-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-emerald-800/50 transition-all hover:shadow-emerald-900/20 hover:shadow-2xl overflow-hidden relative">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/20 rounded-full blur-2xl"></div>
            <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
              <span class="inline-block p-2 bg-emerald-500/10 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </span>
              Digital Fingerprint
            </h2>
            <div v-if="fingerprint.hash" class="bg-emerald-900/30 rounded-xl p-4 border border-emerald-700/30 relative">
              <p class="text-xs sm:text-sm text-emerald-300 mb-2">Your unique fingerprint hash:</p>
              <div class="flex items-center gap-2">
                <p class="text-lg sm:text-xl font-mono text-white break-all flex-1">{{ fingerprint.hash }}</p>
                <button 
                  @click="copyFingerprint"
                  class="p-2 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-lg transition-colors group shrink-0"
                  :title="copied ? 'Copied!' : 'Copy fingerprint'"
                >
                  <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <!-- <button
                  @click="openValueModal(fingerprint.hash, 'Digital Fingerprint Hash')"
                  class="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors group shrink-0"
                  title="View in details modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400 group-hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button> -->
              </div>
            </div>
            
            <div class="mt-4">
              <button 
                @click="showTechnicalDetails = !showTechnicalDetails"
                class="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform" :class="{ 'rotate-90': showTechnicalDetails }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span>{{ showTechnicalDetails ? 'Hide' : 'Show' }} Technical Details</span>
              </button>
              
              <div v-if="showTechnicalDetails" class="mt-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800/50 text-sm space-y-4">
                <h3 class="text-base font-medium text-emerald-300 mb-3">Fingerprinting Algorithm Details</h3>
                
                <div class="space-y-3 text-gray-300">
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">1. Canvas Fingerprinting</h4>
                    <p class="text-xs leading-relaxed">Renders text and shapes onto an HTML5 canvas element using specific fonts, emojis, and drawing operations. The rendering output varies based on GPU, drivers, OS font rendering, and anti-aliasing settings. We use:</p>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li>Text: "Canvas fingerprint cwm4n8t5i3n9" with font "11pt no-real-font-123"</li>
                      <li>Unicode emoji: 🚀 and mathematical symbols: 𝓤𝓷𝓲𝓬𝓸𝓭𝓮</li>
                      <li>Geometric shapes with composite operations (multiply blend mode)</li>
                      <li>Linear gradient from red→green→blue</li>
                      <li>Export via canvas.toDataURL() for base64 encoded PNG</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">2. Audio Context Fingerprinting</h4>
                    <p class="text-xs leading-relaxed">Creates an audio signal processing graph that produces slightly different outputs based on hardware and software audio stack:</p>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li>OscillatorNode: Triangle wave at 10kHz frequency</li>
                      <li>AnalyserNode: FFT size 2048 for frequency analysis</li>
                      <li>ScriptProcessorNode: 4096 sample buffer processing</li>
                      <li>Captures first 100 samples of processed audio output</li>
                      <li>Differences arise from audio hardware, sample rate conversion, and DSP implementations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">3. WebGL Fingerprinting</h4>
                    <p class="text-xs leading-relaxed">Queries GPU and graphics driver information through WebGL API:</p>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li>WEBGL_debug_renderer_info extension for unmasked vendor/renderer</li>
                      <li>Maximum texture sizes, viewport dimensions, and anisotropic filtering</li>
                      <li>Supported extensions list (varies by GPU capabilities)</li>
                      <li>Shader precision and vertex attribute limits</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">4. Font Detection</h4>
                    <p class="text-xs leading-relaxed">Detects installed system fonts by measuring text dimensions:</p>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li>Tests 60+ common fonts across Windows, macOS, and Linux</li>
                      <li>Renders test string "mmmmmmmmmmlli" in 72px size</li>
                      <li>Compares dimensions against baseline fonts (monospace, sans-serif, serif)</li>
                      <li>Font availability reveals OS and installed software</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">5. Additional Entropy Sources</h4>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li><strong>Screen:</strong> Resolution, color depth, pixel ratio, orientation</li>
                      <li><strong>Hardware:</strong> CPU cores, device memory, touch points</li>
                      <li><strong>Timezone:</strong> Offset and IANA timezone identifier</li>
                      <li><strong>Media Devices:</strong> Count and IDs of audio/video devices</li>
                      <li><strong>Navigator:</strong> Language, platform, vendor strings</li>
                      <li><strong>Speech Synthesis:</strong> Available TTS voices and engines</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 class="text-emerald-400 font-medium mb-1">6. Hashing Algorithm</h4>
                    <p class="text-xs leading-relaxed">Final fingerprint generation:</p>
                    <ul class="list-disc list-inside text-xs mt-1 ml-4 space-y-1 text-gray-400">
                      <li>Combines all component data into a JSON structure</li>
                      <li>Sorts object keys for consistent ordering</li>
                      <li>Encodes as UTF-8 and computes SHA-256 hash</li>
                      <li>Outputs 64-character hexadecimal string</li>
                      <li>Collision probability: ~1 in 2^256 (practically impossible)</li>
                    </ul>
                  </div>
                  
                  <div class="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-700/30">
                    <p class="text-xs text-amber-300">
                      <strong>Privacy Note:</strong> This fingerprint is calculated locally in your browser. No data is sent to any server. The fingerprint can be used to track users across websites, which is why privacy-focused browsers implement anti-fingerprinting measures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <p class="mt-4 text-sm text-gray-400">This hash is generated from various browser and device characteristics to create a unique identifier.</p>
          </section>

          <section id="section-ip" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-emerald-900/10 hover:shadow-2xl overflow-hidden relative">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full blur-2xl"></div>
            <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
              <span class="inline-block p-2 bg-emerald-500/10 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              IP & Location
            </h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              <LabelValueItem label="IP Address" :value="userInfo.ipAddress" />
              <LabelValueItem label="City" :value="userInfo.city" />
              <LabelValueItem label="Region" :value="userInfo.region" />
              <LabelValueItem label="Country" :value="userInfo.country" />
              <LabelValueItem label="Latitude" :value="userInfo.latitude?.toFixed(4)" />
              <LabelValueItem label="Longitude" :value="userInfo.longitude?.toFixed(4)" />
              <LabelValueItem label="ISP / Organization" :value="userInfo.isp" />
              <LabelValueItem label="Timezone (from IP)" :value="userInfo.ipTimezone" />
              <LabelValueItem label="Timezone (JS)" :value="timezoneInfo.timezone" />
              <LabelValueItem label="Timezone Abbr" :value="timezoneInfo.timezoneAbbr" />
              <LabelValueItem v-if="localIPs.length > 0" label="Local IPs" :value="localIPs.join(', ')" />
            </dl>
            <div v-if="userInfo.latitude && userInfo.longitude" class="mt-4 sm:mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-800/50">
              <MapDisplay :latitude="userInfo.latitude" :longitude="userInfo.longitude" :zoom-level="15" />
            </div>
            <p v-if="ipError" class="mt-4 text-sm text-red-400">{{ ipError }}</p>
          </section>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            <section id="section-browser-os" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-emerald-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
                <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                  <span class="inline-block p-2 bg-emerald-500/10 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Browser & OS
                </h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <LabelValueItem label="Browser" :value="userInfo.browserNameVersion" />
                  <LabelValueItem label="OS" :value="userInfo.osNameVersion" />
                  <LabelValueItem label="Platform" :value="userInfo.platform" />
                  <LabelValueItem label="Language" :value="userInfo.language" />
                </dl>
                <div class="mt-4">
                  <dt class="text-xs sm:text-sm font-medium text-emerald-400 mb-0.5 sm:mb-1">User Agent</dt>
                  <dd class="mt-1 text-xs sm:text-sm text-gray-300 break-all value-class-placeholder"> {{ truncateText(userInfo.userAgent, 100) }}
                    <button
                      v-if="userInfo.userAgent && userInfo.userAgent.length > 100"
                      @click="openValueModal(userInfo.userAgent, 'User Agent')"
                      class="ml-1 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                    >
                      (View Full)
                    </button>
                  </dd>
                </div>
            </section>
            <section id="section-display" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-pink-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-pink-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                Display & Screen
              </h2>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <LabelValueItem label="Screen Resolution" :value="`${userInfo.screenWidth} × ${userInfo.screenHeight}`" valueClass="mt-1 text-lg sm:text-xl font-medium text-white" />
                <LabelValueItem label="Window Size" :value="`${userInfo.windowInnerWidth} × ${userInfo.windowInnerHeight}`" valueClass="mt-1 text-lg sm:text-xl font-medium text-white" />
                <LabelValueItem label="Device Pixel Ratio" :value="userInfo.devicePixelRatio" unit="×" valueClass="mt-1 text-lg sm:text-xl font-medium text-white" />
                <LabelValueItem label="Color Depth" :value="userInfo.colorDepth" unit=" bit" valueClass="mt-1 text-lg sm:text-xl font-medium text-white" />
                <LabelValueItem label="Orientation" :value="userInfo.screenOrientation" valueClass="mt-1 text-lg sm:text-xl font-medium text-white" />
              </dl>
            </section>
          </div>

          <section id="section-advanced-fingerprint" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-orange-900/10 hover:shadow-2xl overflow-hidden relative">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-2xl"></div>
            <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
              <span class="inline-block p-2 bg-orange-500/10 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </span>
              Advanced Fingerprinting
            </h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div class="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                  <span class="inline-block w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Canvas Fingerprint
                </h3>
                <div v-if="canvasFingerprint.supported && canvasFingerprint.fingerprint" class="space-y-2">
                  <p class="text-xs text-gray-400">Unique canvas rendering signature</p>
                  <p class="text-xs font-mono text-gray-300 break-all">
                    {{ truncateText(canvasFingerprint.fingerprint, 60) }}
                    <button
                      v-if="canvasFingerprint.fingerprint && canvasFingerprint.fingerprint.length > 60"
                      @click="openValueModal(canvasFingerprint.fingerprint, 'Canvas Fingerprint')"
                      class="ml-1 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                    >
                      (View Full)
                    </button>
                  </p>
                </div>
                <p v-else class="text-sm text-gray-500">Not supported</p>
              </div>

              <div class="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                  <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Audio Fingerprint
                </h3>
                <div v-if="audioFingerprint.supported && audioFingerprint.fingerprint" class="space-y-2">
                  <p class="text-xs text-gray-400">Audio context signature</p>
                  <p class="text-xs font-mono text-gray-300 break-all">
                    {{ truncateText(audioFingerprint.fingerprint, 60) }}
                     <button
                      v-if="audioFingerprint.fingerprint && audioFingerprint.fingerprint.length > 60"
                      @click="openValueModal(audioFingerprint.fingerprint, 'Audio Fingerprint')"
                      class="ml-1 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                    >
                      (View Full)
                    </button>
                  </p>
                </div>
                <p v-else class="text-sm text-gray-500">Not supported</p>
              </div>

              <div class="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  WebGL Details
                </h3>
                <div v-if="webglFingerprint.supported" class="space-y-2">
                  <LabelValueItem label="Vendor" :value="webglFingerprint.vendor" valueClass="text-sm" />
                  <LabelValueItem label="Renderer" :value="webglFingerprint.renderer" valueClass="text-sm" />
                  <LabelValueItem label="Max Texture Size" :value="webglFingerprint.maxTextureSize" valueClass="text-sm" />
                  <p class="text-xs text-gray-400 mt-2">{{ webglFingerprint.extensions?.length || 0 }} extensions supported
                    <button
                      v-if="webglFingerprint.extensions && webglFingerprint.extensions.length > 0"
                      @click="openValueModal(webglFingerprint.extensions, 'WebGL Extensions')"
                      class="ml-1 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                    >
                      (View All)
                    </button>
                  </p>
                </div>
                <p v-else class="text-sm text-gray-500">Not supported</p>
              </div>

              <div class="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                  <span class="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Media Devices
                </h3>
                <div v-if="mediaDevices.available" class="space-y-2">
                  <LabelValueItem label="Audio Inputs" :value="mediaDevices.audioInputs" valueClass="text-sm" />
                  <LabelValueItem label="Audio Outputs" :value="mediaDevices.audioOutputs" valueClass="text-sm" />
                  <LabelValueItem label="Video Inputs" :value="mediaDevices.videoInputs" valueClass="text-sm" />
                  <p class="text-xs text-gray-400 mt-2">{{ mediaDevices.deviceIds.length }} unique device IDs
                     <button
                        v-if="mediaDevices.deviceIds && mediaDevices.deviceIds.length > 0"
                        @click="openValueModal(mediaDevices.deviceIds, 'Media Device IDs')"
                        class="ml-1 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                      >
                        (View All)
                      </button>
                  </p>
                </div>
                <p v-else class="text-sm text-gray-500">{{ mediaDevices.error || 'Not available' }}</p>
              </div>
            </div>

            <div v-if="plugins.length > 0" class="mt-4 bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
              <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                <span class="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Browser Plugins
                  <button
                    @click="openValueModal(plugins, 'Browser Plugins')"
                    class="ml-2 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                  >
                    (View All Details)
                  </button>
              </h3>
              <p class="text-xs text-gray-400 mb-2">{{ plugins.length }} plugin{{ plugins.length !== 1 ? 's' : '' }} detected</p>
              <div class="space-y-2 max-h-62 overflow-y-auto">
                <div v-for="(plugin, index) in plugins" :key="index" class="text-xs bg-gray-900/50 rounded p-2">
                  <p class="text-emerald-300 font-medium">{{ plugin.name }}</p>
                  <p class="text-gray-400 text-xs">{{ truncateText(plugin.description, 50) }}</p>
                  <p v-if="plugin.filename !== 'N/A'" class="text-gray-500 text-xs">{{ plugin.filename }}</p>
                </div>
              </div>
              <p class="text-xs text-amber-400 mt-2">
                <strong>Note:</strong> Modern browsers limit plugin detection for privacy. Only certain plugins may be visible.
              </p>
            </div>

            <div v-if="speechVoices.available" class="mt-4 bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
              <h3 class="text-base sm:text-lg font-medium text-white mb-3 flex items-center">
                <span class="inline-block w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Speech Synthesis Voices
                 <button
                    @click="openValueModal(speechVoices.voices, 'Speech Synthesis Voices')"
                    class="ml-2 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                  >
                    (View All Details)
                  </button>
              </h3>
              <p class="text-sm text-gray-300">{{ speechVoices.count }} voices available</p>
              <div class="mt-2 max-h-32 overflow-y-auto">
                <div v-for="(voice, index) in speechVoices.voices" :key="index" class="text-xs text-gray-400 py-1">
                  {{ voice.name }} ({{ voice.lang }}) {{ voice.default ? '- Default' : '' }}
                </div>                
              </div>
            </div>
          </section>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <section id="section-hardware" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-amber-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-amber-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </span>
                Hardware
              </h2>
              <dl class="space-y-3 sm:space-y-4">
                <LabelValueItem label="CPU Cores" :value="userInfo.cpuCores" />
                <LabelValueItem label="Device Memory (RAM)" :value="userInfo.deviceMemory" :unit="typeof userInfo.deviceMemory === 'number' ? ' GB' : ''" />
                <LabelValueItem label="Max Touch Points" :value="userInfo.maxTouchPoints" />
              </dl>
            </section>

            <section id="section-network" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-cyan-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-cyan-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </span>
                Network Status
              </h2>
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <LabelValueItem label="Connection Type" :value="userInfo.connectionType" />
                <LabelValueItem label="Effective Type" :value="userInfo.effectiveConnectionType" />
                <LabelValueItem label="Downlink Speed" :value="userInfo.downlink" :unit="typeof userInfo.downlink === 'number' ? ' Mbps' : ''" />
                <LabelValueItem label="Round Trip Time (RTT)" :value="userInfo.rtt" :unit="typeof userInfo.rtt === 'number' ? ' ms' : ''" />
                <LabelValueItem label="Data Saver Mode" :value="userInfo.saveData" />
                <LabelValueItem label="Online Status" :value="userInfo.isOnline">
                  <template #default="{ value }">
                    <span class="flex items-center">
                      <span class="inline-block w-3 h-3 rounded-full mr-2" :class="value ? 'bg-green-500' : 'bg-red-500'"></span>
                      <span class="text-base sm:text-lg font-medium text-white">{{ value ? 'Online' : 'Offline' }}</span>
                    </span>
                  </template>
                </LabelValueItem>
              </dl>
            </section>

            <section id="section-datetime" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-rose-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-rose-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Date & Time
              </h2>
              <dl class="space-y-3 sm:space-y-4">
                <LabelValueItem label="Local Date & Time" :value="userInfo.localDateTime" />
                <LabelValueItem label="UTC Date & Time" :value="userInfo.utcDateTime" />
                <LabelValueItem label="Timezone Offset" :value="userInfo.timezoneOffset" unit=" minutes from UTC" />
                <LabelValueItem label="Session Duration" :value="history.sessionDuration" />
              </dl>
            </section>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            <section id="section-api-permissions" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-blue-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-blue-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </span>
                API Support & Permissions
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <LabelValueItem label="Geolocation" :value="permissions.geolocation">
                  <template #default="{ value: permValue }">
                    <span class="flex items-center">
                      <span class="inline-block w-3 h-3 rounded-full mr-2"
                            :class="permValue === 'granted' ? 'bg-green-500' :
                                     permValue === 'denied' ? 'bg-red-500' :
                                     permValue === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                      <span class="text-base sm:text-lg font-medium text-white capitalize">{{ permValue || 'N/A' }}</span>
                    </span>
                  </template>
                </LabelValueItem>
                <LabelValueItem label="Notifications" :value="permissions.notifications">
                    <template #default="{ value: permValue }">
                     <span class="flex items-center">
                        <span class="inline-block w-3 h-3 rounded-full mr-2"
                              :class="permValue === 'granted' ? 'bg-green-500' :
                                       permValue === 'denied' ? 'bg-red-500' :
                                       permValue === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                        <span class="text-base sm:text-lg font-medium text-white capitalize">{{ permValue || 'N/A' }}</span>
                     </span>
                    </template>
                </LabelValueItem>
                <LabelValueItem label="Camera" :value="permissions.camera">
                  <template #default="{ value: permValue }">
                    <span class="flex items-center">
                      <span class="inline-block w-3 h-3 rounded-full mr-2"
                            :class="permValue === 'granted' ? 'bg-green-500' :
                                     permValue === 'denied' ? 'bg-red-500' :
                                     permValue === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                      <span class="text-base sm:text-lg font-medium text-white capitalize">{{ permValue || 'N/A' }}</span>
                    </span>
                  </template>
                </LabelValueItem>
                <LabelValueItem label="Microphone" :value="permissions.microphone">
                  <template #default="{ value: permValue }">
                    <span class="flex items-center">
                      <span class="inline-block w-3 h-3 rounded-full mr-2"
                            :class="permValue === 'granted' ? 'bg-green-500' :
                                     permValue === 'denied' ? 'bg-red-500' :
                                     permValue === 'prompt' ? 'bg-yellow-500' : 'bg-gray-500'"></span>
                      <span class="text-base sm:text-lg font-medium text-white capitalize">{{ permValue || 'N/A' }}</span>
                    </span>
                  </template>
                </LabelValueItem>
              </div>
              <div class="mt-4 sm:mt-6">
                <h3 class="text-base sm:text-lg font-medium text-white mb-3">API Support</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  <div v-for="(supported, api) in apiSupport" :key="api"
                       class="flex items-center justify-between px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg"
                       :class="supported ? 'bg-blue-500/10 text-blue-300' : 'bg-gray-800/30 text-gray-400'">
                    <span class="text-xs sm:text-sm capitalize">{{ api.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}</span>
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

            <section id="section-security" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-green-900/10 hover:shadow-2xl overflow-hidden relative">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-2xl"></div>
              <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
                <span class="inline-block p-2 bg-green-500/10 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                Security Features
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <LabelValueItem label="HTTPS Connection" :value="security.isHttps" />
                <LabelValueItem label="Content Security Policy" :value="security.csp">
                   <template #default="{ value: cspValue }">
                     <span class="flex items-center">
                        <span class="inline-block w-3 h-3 rounded-full mr-2"
                              :class="cspValue && cspValue.startsWith('Set') ? 'bg-green-500' : (cspValue ? 'bg-yellow-500' : 'bg-gray-500')"></span>
                        <span class="text-base sm:text-lg font-medium text-white">{{ (cspValue && cspValue.startsWith('Set')) ? 'Enabled' : (cspValue || 'Not Detected') }}</span>
                     </span>
                   </template>
                </LabelValueItem>
                <LabelValueItem label="Referrer Policy" :value="security.referrerPolicy || 'None'" />
                  <LabelValueItem label="Ad Blocker" :value="security.adBlocker">
                    <template #default="{ value: adBlockerValue }">
                        <span class="flex items-center">
                            <span class="inline-block w-3 h-3 rounded-full mr-2"
                                  :class="adBlockerValue ? 'bg-green-500' : 'bg-gray-500'"></span>
                            <span class="text-base sm:text-lg font-medium text-white">{{ adBlockerValue ? 'Detected' : 'Not Detected' }}</span>
                        </span>
                    </template>
                </LabelValueItem>
                <LabelValueItem label="Incognito Mode" :value="security.incognito">
                    <template #default="{ value: incognitoValue }">
                        <span class="flex items-center">
                            <span class="inline-block w-3 h-3 rounded-full mr-2"
                                  :class="incognitoValue ? 'bg-purple-500' : 'bg-gray-500'"></span>
                            <span class="text-base sm:text-lg font-medium text-white">{{ incognitoValue ? 'Likely Yes' : 'Likely No' }}</span>
                        </span>
                    </template>
                </LabelValueItem>
                <LabelValueItem label="Cookies Enabled" :value="userInfo.cookiesEnabled" />
              </div>
            </section>
          </div>

          <section id="section-performance" class="backdrop-blur-lg bg-gray-900/40 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-800/50 transition-all hover:shadow-violet-900/10 hover:shadow-2xl overflow-hidden relative">
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-2xl"></div>
            <h2 class="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-5 flex items-center">
              <span class="inline-block p-2 bg-violet-500/10 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              Performance Metrics
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <LabelValueItem label="Page Load Time" :value="performanceMetrics.pageLoadTime >= 0 ? performanceMetrics.pageLoadTime : 'N/A'"
                              :unit="performanceMetrics.pageLoadTime >=0 ? ' ms' : ''"
                              valueClass="mt-1 text-xl sm:text-2xl font-medium text-white" />
              <LabelValueItem label="DOM Content Loaded" :value="performanceMetrics.domContentLoaded >= 0 ? performanceMetrics.domContentLoaded : 'N/A'"
                              :unit="performanceMetrics.domContentLoaded >= 0 ? ' ms' : ''"
                              valueClass="mt-1 text-xl sm:text-2xl font-medium text-white" />
              <LabelValueItem label="First Paint (FP)" :value="performanceMetrics.firstPaint >= 0 ? performanceMetrics.firstPaint : 'N/A'"
                              :unit="performanceMetrics.firstPaint >= 0 ? ' ms' : ''"
                              valueClass="mt-1 text-xl sm:text-2xl font-medium text-white" />
              <LabelValueItem label="First Contentful Paint (FCP)" :value="performanceMetrics.firstContentfulPaint >= 0 ? performanceMetrics.firstContentfulPaint : 'N/A'"
                              :unit="performanceMetrics.firstContentfulPaint >= 0 ? ' ms' : ''"
                              valueClass="mt-1 text-xl sm:text-2xl font-medium text-white" />
            </div>
            <div class="mt-4 sm:mt-6">
              <h3 class="text-base sm:text-lg font-medium text-white mb-3">Resource Timing (Top 5)
                <button
                  v-if="performanceMetrics.resources && performanceMetrics.resources.length > 0"
                  @click="openValueModal(performanceMetrics.resources, 'All Resource Timings')"
                  class="ml-2 text-emerald-400 hover:text-emerald-300 text-xs focus:outline-none underline"
                >
                  (View All)
                </button>
              </h3>
              <div v-if="performanceMetrics.resources.length > 0" class="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left">
                    <thead class="text-xs uppercase bg-gray-800/50 text-gray-400">
                      <tr>
                        <th class="px-3 py-2 sm:px-4 sm:py-3">Resource</th>
                        <th class="px-3 py-2 sm:px-4 sm:py-3 w-24 sm:w-28 text-right">Duration (ms)</th>
                        <th class="px-3 py-2 sm:px-4 sm:py-3 w-20 sm:w-24 text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-800/50">
                      <tr v-for="(resource, index) in performanceMetrics.resources.slice(0, 5)" :key="index" class="bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
                        <td class="px-3 py-2 sm:px-4 sm:py-3 truncate max-w-[150px] xs:max-w-xs sm:max-w-md md:max-w-lg">{{ resource.name }}</td>
                        <td class="px-3 py-2 sm:px-4 sm:py-3 text-amber-300 text-right">{{ resource.duration }}</td>
                        <td class="px-3 py-2 sm:px-4 sm:py-3 text-emerald-300 text-right">{{ resource.size }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                <p v-else class="text-gray-400 text-sm">No resource timing data available or API not supported.</p>
            </div>
          </section>
        </main>

        <footer class="text-center pt-8 sm:pt-10 pb-6">
          <div class="flex justify-center space-x-4 mb-4">
            <a href="https://www.github.com/jekrch/whoami" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">GitHub</span>
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          <p class="text-gray-500 text-sm">
            <span class="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-transparent bg-clip-text font-medium">WhoAmI</span>
            — A digital fingerprinting dashboard &copy; {{ new Date().getFullYear() }}
          </p>
        </footer>
      </div>
    </div>

    <teleport to="body">
      <transition name="modal-fade">
        <div
          v-if="showValueModal"
          @click.self="closeValueModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          aria-modal="true"
          role="dialog"
        >
          <div class="bg-gray-900 border border-emerald-700/50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <header class="flex items-center justify-between p-4 border-b border-gray-800/60 shrink-0">
              <h3 class="text-lg font-medium text-emerald-300">{{ modalTitle }}</h3>
              <button @click="closeValueModal" class="text-gray-400 hover:text-white transition-colors" aria-label="Close modal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </header>
            <main class="p-4 flex-grow overflow-y-auto">
              <pre class="text-sm text-gray-300 whitespace-pre-wrap break-all bg-gray-800/40 p-3 rounded-md modal-pre-content">{{ modalDisplayedValue }}</pre>
            </main>
            <footer class="p-4 border-t border-gray-800/60 flex justify-end gap-3 shrink-0">
              <button
                @click="copyModalValueToClipboard"
                class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="!modalValueCopied" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {{ modalValueCopied ? 'Copied!' : 'Copy to Clipboard' }}
              </button>
              <button
                @click="closeValueModal"
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
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
  performanceMetrics,
  security,
  history,
  // New fingerprinting data
  canvasFingerprint,
  audioFingerprint,
  webglFingerprint,
  mediaDevices,
  timezoneInfo,
  speechVoices,
  localIPs,
  plugins,
  fingerprint
} = useDigitalFingerprint();

// Component state
const showTechnicalDetails = ref(false);
const copied = ref(false); // For main fingerprint hash direct copy button

// Modal State
const showValueModal = ref(false);
const modalValue = ref<string | object | any[] | null | undefined>('');
const modalTitle = ref('');
const modalValueCopied = ref(false);

// Truncate Text Helper for display purposes, except for main hash
const truncateText = (text: string | undefined | null, maxLength: number): string => {
  if (!text) return 'N/A';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Modal Control Functions
const openValueModal = (value: string | object | any[] | null | undefined, title: string) => {
  modalValue.value = value;
  modalTitle.value = title;
  showValueModal.value = true;
  modalValueCopied.value = false; // Reset copy status when modal opens
};

const closeValueModal = () => {
  showValueModal.value = false;
};

// Computed property for modal display to handle JSON stringification
const modalDisplayedValue = computed(() => {
  if (typeof modalValue.value === 'string') {
    return modalValue.value;
  }
  if (modalValue.value === null || modalValue.value === undefined) {
    return 'N/A';
  }
  // For objects or arrays, pretty-print JSON
  return JSON.stringify(modalValue.value, null, 2);
});

const copyModalValueToClipboard = async () => {
  if (!modalValue.value && typeof modalValue.value !== 'object') return; // Allow copying empty string, but not null/undefined directly for text
  try {
    await navigator.clipboard.writeText(modalDisplayedValue.value);
    modalValueCopied.value = true;
    setTimeout(() => {
      modalValueCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy modal content:', err);
    // Optionally: alert('Failed to copy content.');
  }
};

// Copy main fingerprint function (existing) - copies the full hash
const copyFingerprint = async () => {
  if (!fingerprint.hash) return;
  
  try {
    await navigator.clipboard.writeText(fingerprint.hash);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy fingerprint:', err);
  }
};

const navItems = ref([
  { id: 'section-fingerprint', label: 'Digital Fingerprint', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>' },
  { id: 'section-ip', label: 'IP & Location', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
  { id: 'section-browser-os', label: 'Browser & OS', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>' },
  { id: 'section-display', label: 'Display & Screen', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>' },
  { id: 'section-advanced-fingerprint', label: 'Advanced Fingerprinting', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>' },
  { id: 'section-hardware', label: 'Hardware', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>' },
  { id: 'section-network', label: 'Network Status', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>' },
  { id: 'section-datetime', label: 'Date & Time', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
  { id: 'section-api-permissions', label: 'API & Permissions', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>' },
  { id: 'section-security', label: 'Security Features', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>' },
  { id: 'section-performance', label: 'Performance', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' },
]);

const activeSectionId = ref('');
const observer = ref<IntersectionObserver | null>(null);
const observedElements = new Set<Element>();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const PADDING_OFFSET = 12; // Desired padding in pixels

const smoothScrollTo = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    window.history.pushState(null, '', '#' + id);
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - PADDING_OFFSET;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    activeSectionId.value = id;
  }
};

const initIntersectionObserver = () => {
  if (observer.value) {
    observedElements.forEach(el => observer.value!.unobserve(el));
    observedElements.clear();
    observer.value.disconnect();
  }

  const options = {
    rootMargin: '-20% 0px -50% 0px', // Adjust as needed for active section highlighting
    threshold: 0,
  };

  observer.value = new IntersectionObserver((entries) => {
    let intersectingEntry = entries.find(entry => entry.isIntersecting);
    if (intersectingEntry) {
        activeSectionId.value = intersectingEntry.target.id;
    }
  }, options);

  document.querySelectorAll('main section[id]').forEach(section => {
    if (section) {
      observer.value!.observe(section);
      observedElements.add(section);
    }
  });
};

watch(isLoading, (newIsLoading) => {
  if (!newIsLoading) {
    // Use nextTick or a small timeout to ensure DOM is updated after isLoading changes
    // For IntersectionObserver, it's better to ensure elements are rendered.
    setTimeout(initIntersectionObserver, 100); 
  }
}, { immediate: true });

// Handle Escape key for modal
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showValueModal.value) {
    closeValueModal();
  }
};

onMounted(() => {
  if (!isLoading.value) {
      // Ensure DOM is ready for observer
      setTimeout(initIntersectionObserver, 100);
  }
  // Set active section based on hash or default to first item
  if (window.location.hash) {
    const initialSectionId = window.location.hash.substring(1);
    const element = document.getElementById(initialSectionId);
    // Check if the hash corresponds to a valid nav item
    if (element && navItems.value.some(item => item.id === initialSectionId)) {
        activeSectionId.value = initialSectionId;
        // Optionally, scroll to it if not perfectly aligned (smoothScrollTo handles this)
        // smoothScrollTo(initialSectionId); 
    } else if (navItems.value.length > 0) {
      activeSectionId.value = navItems.value[0].id; // Default to first if hash is invalid
    }
  } else if (navItems.value.length > 0) {
    activeSectionId.value = navItems.value[0].id; // Default to first nav item
  }
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (observer.value) {
    observedElements.forEach(el => observer.value!.unobserve(el));
    observer.value.disconnect();
  }
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
html {
  scroll-behavior: smooth !important;
}

.transition-width {
  transition-property: width;
}
.transition-margin {
  transition-property: margin-left;
}

/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Style for pre tag in modal for better font rendering */
.modal-pre-content { /* Applied class to the pre tag in modal */
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
}

/* For very small screens, you might want to make fonts even smaller if needed */
@media (max-width: 380px) { /* example: 'xs' screens or similar custom breakpoint */
  .xs-text-xs { /* You'd apply this class where needed or adjust base styles */
    font-size: 0.65rem; /* ~10.4px */
    line-height: 0.9rem;
  }
  /* Further target specific elements if necessary */
  main section h2 {
    font-size: 1.125rem; /* equivalent to text-lg */
  }
}

/* Ensure dt/dd behave as expected for User Agent custom display */
#section-browser-os .value-class-placeholder {
    /* This class was a placeholder, the styles are directly on the dd:
       mt-1 text-xs sm:text-sm text-gray-300 break-all */
}
</style>