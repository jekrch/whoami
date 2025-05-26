import { ref, reactive, readonly } from 'vue';
import type {
    UserInfo,
    UserAgentData,
    PermissionsState,
    ApiSupportState,
    SensorsState,
    StorageInfoState,
    MediaCapabilitiesState,
    PerformanceMetricsState,
    SecurityFeaturesState,
    FontInfoState,
    AccessibilityFeaturesState,
    HistoryState,
} from '../types';

// Helper function to format bytes
const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function useDigitalFingerprint() {
    const isLoading = ref(true);
    const ipError = ref<string | null>(null);

    const userInfo = reactive<UserInfo>({
        ipAddress: undefined, city: undefined, region: undefined, country: undefined,
        latitude: undefined, longitude: undefined, isp: undefined, ipTimezone: undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
        browserNameVersion: 'N/A', osNameVersion: 'N/A',
        isMobile: false, platform: typeof navigator !== 'undefined' ? navigator.platform : 'N/A',
        vendor: typeof navigator !== 'undefined' ? navigator.vendor : 'N/A',
        language: typeof navigator !== 'undefined' ? navigator.language : 'N/A',
        languages: typeof navigator !== 'undefined' && navigator.languages ? navigator.languages.join(', ') : 'N/A',
        screenWidth: typeof screen !== 'undefined' ? screen.width : 0,
        screenHeight: typeof screen !== 'undefined' ? screen.height : 0,
        availScreenWidth: typeof screen !== 'undefined' ? screen.availWidth : 0,
        availScreenHeight: typeof screen !== 'undefined' ? screen.availHeight : 0,
        windowInnerWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
        windowInnerHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
        colorDepth: typeof screen !== 'undefined' ? screen.colorDepth : 0,
        pixelDepth: typeof screen !== 'undefined' ? screen.pixelDepth : 0,
        devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
        screenOrientation: typeof screen !== 'undefined' && screen.orientation ? screen.orientation.type : 'N/A',
        cpuCores: typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 'N/A',
        deviceMemory: typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 'N/A',
        maxTouchPoints: typeof navigator !== 'undefined' && navigator.maxTouchPoints ? navigator.maxTouchPoints : 0,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
        connectionType: typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.type : 'N/A',
        effectiveConnectionType: typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.effectiveType : 'N/A',
        downlink: typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.downlink : 'N/A',
        rtt: typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.rtt : 'N/A',
        saveData: typeof navigator !== 'undefined' && (navigator as any).connection ? (navigator as any).connection.saveData : false,
        cookiesEnabled: typeof navigator !== 'undefined' ? navigator.cookieEnabled : false,
        doNotTrack: typeof navigator !== 'undefined' && navigator.doNotTrack ? (navigator.doNotTrack === '1' ? 'Enabled' : (navigator.doNotTrack === '0' ? 'Disabled' : 'Unspecified')) : 'Unspecified',
        pdfViewerEnabled: typeof navigator !== 'undefined' && (navigator as any).pdfViewerEnabled ? (navigator as any).pdfViewerEnabled : 'N/A',
        webdriver: typeof navigator !== 'undefined' && (navigator as any).webdriver ? (navigator as any).webdriver : false,
        javaEnabled: typeof navigator !== 'undefined' && typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : false,
        localDateTime: new Date().toLocaleString(),
        utcDateTime: new Date().toUTCString(),
        timezoneOffset: new Date().getTimezoneOffset(),
        battery: null,
    });

    const permissions = reactive<PermissionsState>({
        geolocation: 'Unknown', notifications: 'Unknown', camera: 'Unknown', microphone: 'Unknown'
    });

    const apiSupport = reactive<ApiSupportState>({
        pushApi: typeof window !== 'undefined' && 'PushManager' in window,
        bluetooth: typeof navigator !== 'undefined' && 'bluetooth' in navigator,
        webShare: typeof navigator !== 'undefined' && 'share' in navigator,
        webUsb: typeof navigator !== 'undefined' && 'usb' in navigator,
        webRTC: typeof window !== 'undefined' && 'RTCPeerConnection' in window,
        webSpeech: typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
    });

    const sensors = reactive<SensorsState>({
        available: typeof window !== 'undefined' && ('DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window),
        accelerometer: typeof window !== 'undefined' && 'DeviceMotionEvent' in window,
        gyroscope: typeof window !== 'undefined' && 'DeviceMotionEvent' in window,
        magnetometer: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
        ambientLight: typeof window !== 'undefined' && 'AmbientLightSensor' in window,
        deviceOrientation: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window,
        liveData: null
    });

    const storageInfo = reactive<StorageInfoState>({
        localStorage: typeof localStorage !== 'undefined' ? 'Available' : 'Not Available',
        sessionStorage: typeof sessionStorage !== 'undefined' ? 'Available' : 'Not Available',
        indexedDB: typeof window !== 'undefined' && 'indexedDB' in window,
        cacheAPI: typeof window !== 'undefined' && 'caches' in window,
        usage: 'Checking...', quota: 'Checking...', persistentStorage: 'Checking...'
    });

    const media = reactive<MediaCapabilitiesState>({
        webgl: 'Checking...', webgl2: 'Checking...',
        canvas: typeof document !== 'undefined' && !!document.createElement('canvas').getContext,
        audio: typeof window !== 'undefined' && (!!(window as any).AudioContext || !!(window as any).webkitAudioContext),
        videoFormats: 'Checking...', audioFormats: 'Checking...',
        webrtc: typeof window !== 'undefined' && 'RTCPeerConnection' in window,
        gpuInfo: null
    });

    const performanceMetrics = reactive<PerformanceMetricsState>({
        pageLoadTime: 0, domContentLoaded: 0, firstPaint: 0, firstContentfulPaint: 0, resources: []
    });

    const security = reactive<SecurityFeaturesState>({
        isHttps: typeof window !== 'undefined' && window.location.protocol === 'https:',
        csp: null, coop: null, referrerPolicy: null,
        thirdPartyCookies: true, incognito: false, adBlocker: false
    });

    const fonts = reactive<FontInfoState>({
        systemFont: 'Checking...', defaultSize: 0, smoothing: 'Checking...', available: {}
    });

    const a11y = reactive<AccessibilityFeaturesState>({
        prefersReducedMotion: false, prefersColorScheme: 'No Preference',
        prefersContrast: 'No Preference', forcedColors: 'None',
        screenReader: false, keyboardNav: false
    });

    const history = reactive<HistoryState>({
        firstVisit: 'First visit', lastVisit: 'N/A', visitCount: 1,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        navigationType: 'N/A', sessionDuration: '0:00', sessionStart: Date.now()
    });


    const checkWebGLSupport = (): string => {
        if (typeof document === 'undefined') return 'N/A';
        const canvas = document.createElement('canvas');
        let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
        let contextAttempt: RenderingContext | null = null;

        // Try to get WebGL2 context
        contextAttempt = canvas.getContext('webgl2');
        if (contextAttempt && typeof WebGL2RenderingContext !== 'undefined' && contextAttempt instanceof WebGL2RenderingContext) {
            gl = contextAttempt;
        } else {
            // Try experimental WebGL2 if standard WebGL2 failed or wasn't the right type
            contextAttempt = canvas.getContext('experimental-webgl2');
            if (contextAttempt && typeof WebGL2RenderingContext !== 'undefined' && contextAttempt instanceof WebGL2RenderingContext) {
                gl = contextAttempt;
            }
        }

        // If no WebGL2 context was successfully obtained, try for WebGL1
        if (!gl) {
            contextAttempt = canvas.getContext('webgl');
            if (contextAttempt && typeof WebGLRenderingContext !== 'undefined' && contextAttempt instanceof WebGLRenderingContext) {
                gl = contextAttempt;
            } else {
                // Try experimental WebGL1 if standard WebGL1 failed or wasn't the right type
                contextAttempt = canvas.getContext('experimental-webgl');
                if (contextAttempt && typeof WebGLRenderingContext !== 'undefined' && contextAttempt instanceof WebGLRenderingContext) {
                    gl = contextAttempt;
                }
            }
        }

        if (gl) {
            // At this point, gl is confirmed to be either WebGLRenderingContext or WebGL2RenderingContext
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                // These constants are part of the WEBGL_debug_renderer_info extension object
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                media.gpuInfo = `${vendor} - ${renderer}`;
            } else {
                // Fallback if WEBGL_debug_renderer_info is not available
                // gl.RENDERER is a standard WebGL constant (GLenum)
                const rendererInfo = gl.getParameter(gl.RENDERER);
                media.gpuInfo = rendererInfo ? String(rendererInfo) : "Vendor/renderer info not available";
            }

            // Determine if it's WebGL1 or WebGL2 for the return string
            if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
                return 'Supported (WebGL 2)';
            }
            return 'Supported (WebGL 1)';
        }

        media.gpuInfo = "Not supported";
        return 'Not Supported';
    };

    const checkWebGL2Support = (): string => {
        if (typeof document === 'undefined') return 'N/A';
        const canvas = document.createElement('canvas');
        let gl2Context: WebGL2RenderingContext | null = null;
        let contextAttempt: RenderingContext | null = null;

        contextAttempt = canvas.getContext('webgl2');
        if (contextAttempt && typeof WebGL2RenderingContext !== 'undefined' && contextAttempt instanceof WebGL2RenderingContext) {
            gl2Context = contextAttempt;
        } else {
            contextAttempt = canvas.getContext('experimental-webgl2');
            if (contextAttempt && typeof WebGL2RenderingContext !== 'undefined' && contextAttempt instanceof WebGL2RenderingContext) {
                gl2Context = contextAttempt;
            }
        }

        return gl2Context ? 'Supported' : 'Not Supported';
    };

    const isFontAvailable = (font: string): boolean => {
        if (typeof document === 'undefined') return false;
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testString = 'mmmmmmmmmmlli'; const testSize = '72px';
        const h = document.createElement('span');
        h.style.fontSize = testSize; h.style.fontFamily = baseFonts[0]; h.innerHTML = testString;
        document.body.appendChild(h);
        const defaultWidth = h.offsetWidth; const defaultHeight = h.offsetHeight;
        for (const baseFont of baseFonts) {
            h.style.fontFamily = `${font}, ${baseFont}`;
            if (h.offsetWidth !== defaultWidth || h.offsetHeight !== defaultHeight) {
                document.body.removeChild(h); return true;
            }
        }
        document.body.removeChild(h); return false;
    };

    const detectIncognito = (): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            if (typeof navigator === 'undefined' || !('storage' in navigator) || !('estimate' in navigator.storage)) {
                // Fallback for environments like SSR or older browsers
                if (typeof localStorage !== 'undefined') {
                    try {
                        localStorage.setItem('incognito_test', 'test');
                        localStorage.removeItem('incognito_test');
                        resolve(false);
                    } catch (e) {
                        resolve(true);
                    }
                } else {
                    resolve(false); // Cannot determine
                }
                return;
            }
            (navigator.storage.estimate() as Promise<{ quota?: number, usage?: number }>) // quota can be undefined
                .then(({ quota }) => resolve(typeof quota === 'number' && quota < 120000000))
                .catch(() => resolve(false));
        });
    };

    const detectAdBlocker = (): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            if (typeof document === 'undefined') { resolve(false); return; }
            const fakeAd = document.createElement('div');
            fakeAd.className = 'ad_unit adsbox ad-placement ad-zone ad-space'; // Common ad blocker classes
            fakeAd.style.height = '1px'; fakeAd.style.position = 'absolute';
            fakeAd.style.left = '-9999px'; fakeAd.style.top = '-9999px'; fakeAd.style.opacity = '0';
            document.body.appendChild(fakeAd);
            setTimeout(() => {
                const isAdBlocked = !fakeAd.offsetHeight || fakeAd.style.display === 'none' || window.getComputedStyle(fakeAd).display === 'none';
                document.body.removeChild(fakeAd); resolve(isAdBlocked);
            }, 100);
        });
    };

    const getNavigationType = (): string => {
        if (typeof window !== 'undefined' && window.performance && 'getEntriesByType' in window.performance) {
            try {
                const navEntries = window.performance.getEntriesByType('navigation');
                if (navEntries.length > 0) {
                    const navEntry = navEntries[0] as PerformanceNavigationTiming;
                    return navEntry.type;
                }
                return 'N/A';
            } catch (error) { console.warn("Error accessing navigation type:", error); return 'N/A'; }
        }
        return 'N/A';
    };

    const formatSessionDuration = (startTime: number): string => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const checkAccessibilityPreferences = () => {
        if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;
        a11y.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) a11y.prefersColorScheme = 'Dark';
        else if (window.matchMedia('(prefers-color-scheme: light)').matches) a11y.prefersColorScheme = 'Light';
        if (window.matchMedia('(prefers-contrast: more)').matches) a11y.prefersContrast = 'High';
        else if (window.matchMedia('(prefers-contrast: less)').matches) a11y.prefersContrast = 'Low';
        a11y.forcedColors = window.matchMedia('(forced-colors: active)').matches ? 'Active' : 'None';
        window.addEventListener('keydown', (e) => { if (e.key === 'Tab') a11y.keyboardNav = true; }, { once: true });
    };

    const detectScreenReader = (): boolean => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
        return (
            (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.getVoices &&
                window.speechSynthesis.getVoices().some(v => v.name.includes('NVDA') || v.name.includes('JAWS'))) ||
            (typeof (window as any).webkitSpeechRecognition !== 'undefined' && navigator.userAgent.includes('Mac')) // Heuristic for VoiceOver
        );
    };

    const initializeVisitHistory = () => {
        if (typeof localStorage === 'undefined') return;
        try {
            const storageKey = 'whoami_visit_history';
            const storedHistory = localStorage.getItem(storageKey);
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                history.firstVisit = parsedHistory.firstVisit || new Date().toLocaleString();
                history.lastVisit = parsedHistory.lastVisit || 'N/A';
                history.visitCount = (parsedHistory.visitCount || 0) + 1;
            } else {
                history.firstVisit = new Date().toLocaleString();
            }
            const now = new Date().toLocaleString();
            localStorage.setItem(storageKey, JSON.stringify({
                firstVisit: history.firstVisit, lastVisit: now, visitCount: history.visitCount
            }));
            history.navigationType = getNavigationType();
            history.sessionStart = Date.now();
            setInterval(() => { history.sessionDuration = formatSessionDuration(history.sessionStart); }, 1000);
        } catch (e) { console.warn('Unable to access localStorage for visit history:', e); }
    };

    const checkMediaSupport = () => {
        if (typeof document === 'undefined') return;
        const videoFormats: string[] = []; const audioFormats: string[] = [];
        const videoEl = document.createElement('video');
        const videoTypes = { 'video/mp4': 'MP4', 'video/webm': 'WebM', 'video/ogg': 'Ogg Video' };
        for (const [mime, label] of Object.entries(videoTypes)) {
            if (videoEl.canPlayType(mime) !== '') videoFormats.push(label);
        }
        const audioEl = document.createElement('audio');
        const audioTypes = { 'audio/mpeg': 'MP3', 'audio/wav': 'WAV', 'audio/ogg': 'Ogg Audio', 'audio/aac': 'AAC', 'audio/flac': 'FLAC' };
        for (const [mime, label] of Object.entries(audioTypes)) {
            if (audioEl.canPlayType(mime) !== '') audioFormats.push(label);
        }
        media.videoFormats = videoFormats.join(', ') || 'None detected';
        media.audioFormats = audioFormats.join(', ') || 'None detected';
    };

    const checkCommonFonts = () => {
        if (typeof window === 'undefined' || typeof document === 'undefined') return;
        fonts.defaultSize = parseFloat(window.getComputedStyle(document.body).fontSize);
        const commonFontsList = [
            'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 'Verdana', 'Georgia',
            'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Impact',
            'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro'
        ];
        const availableFonts: Record<string, boolean> = {};
        for (const font of commonFontsList) { availableFonts[font] = isFontAvailable(font); }
        fonts.available = availableFonts;
        const computedFont = window.getComputedStyle(document.body).fontFamily;
        fonts.systemFont = computedFont.split(',')[0].replace(/["']/g, '').trim();

        const bodyStyle = window.getComputedStyle(document.body);
        const smoothingValue = bodyStyle.getPropertyValue('-webkit-font-smoothing') ||
            bodyStyle.getPropertyValue('-moz-osx-font-smoothing') ||
            bodyStyle.getPropertyValue('font-smooth');
        fonts.smoothing = smoothingValue === 'antialiased' ? 'Enabled (antialiased)' : (smoothingValue ? smoothingValue : 'Default');
    };

    const collectPerformanceMetrics = () => {
        if (typeof window === 'undefined' || !window.performance || !('getEntriesByType' in window.performance)) {
            performanceMetrics.pageLoadTime = -1; /* Indicate not available */ return;
        }
        try {
            const navEntries = window.performance.getEntriesByType('navigation');
            if (navEntries.length > 0) {
                const navTiming = navEntries[0] as PerformanceNavigationTiming;
                performanceMetrics.pageLoadTime = Math.round(navTiming.loadEventEnd - navTiming.startTime);
                performanceMetrics.domContentLoaded = Math.round(navTiming.domContentLoadedEventEnd - navTiming.startTime);
            }
            const paintEntries = window.performance.getEntriesByType('paint');
            const fp = paintEntries.find(entry => entry.name === 'first-paint');
            const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fp) performanceMetrics.firstPaint = Math.round(fp.startTime);
            if (fcp) performanceMetrics.firstContentfulPaint = Math.round(fcp.startTime);

            const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
            performanceMetrics.resources = resources.map(res => ({
                name: res.name,
                duration: Math.round(res.duration),
                size: formatBytes(res.encodedBodySize || res.transferSize || 0)
            }));
        } catch (error) { console.warn("Error accessing performance metrics:", error); }
    };

    const checkStorageQuota = async () => {
        if (typeof navigator === 'undefined' || !('storage' in navigator) || !('estimate' in navigator.storage)) {
            storageInfo.quota = 'API Not Available'; storageInfo.usage = 'API Not Available';
            storageInfo.persistentStorage = 'API Not Available'; return;
        }
        try {
            const estimate = await navigator.storage.estimate();
            storageInfo.quota = formatBytes(estimate.quota || 0);
            storageInfo.usage = formatBytes(estimate.usage || 0);
            if ('persist' in navigator.storage && 'persisted' in navigator.storage) { // persist() and persisted()
                storageInfo.persistentStorage = await navigator.storage.persisted() ? 'Granted' : 'Not Granted';
            } else { storageInfo.persistentStorage = 'API Not Available'; }
        } catch (e) {
            console.warn('Storage API error:', e);
            storageInfo.quota = 'Error'; storageInfo.usage = 'Error'; storageInfo.persistentStorage = 'Error';
        }
    };

    const getSecurityHeaders = () => {
        if (typeof document === 'undefined') return;
        security.csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? 'Set (meta)' : 'Not detected (meta)';
        security.coop = document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]') ? 'Set (meta)' : 'Not detected (meta)';
        const referrerMeta = document.querySelector('meta[name="referrer"]');
        security.referrerPolicy = referrerMeta ? (referrerMeta.getAttribute('content') || 'Empty') : 'Not set (meta)';
    };


    const initializeAllData = async () => {
        isLoading.value = true;
        ipError.value = null;

        if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined') {
            isLoading.value = false;
            ipError.value = "Cannot gather data in this environment.";
            return;
        }

        // Fetch IP Information
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            if (!ipResponse.ok) throw new Error(`IP API: ${ipResponse.statusText}`);
            const ipData = await ipResponse.json();
            userInfo.ipAddress = ipData.ip;

            const infoResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
            if (!infoResponse.ok) throw new Error(`Location API: ${infoResponse.statusText}`);
            const data = await infoResponse.json();
            //console.log("ipinfo.io full response:", JSON.stringify(data, null, 2)); // Log the full response

            userInfo.city = data.city; userInfo.region = data.region; userInfo.country = data.country;
            userInfo.isp = data.org; userInfo.ipTimezone = data.timezone;
            if (data.loc) {
                const [lat, long] = data.loc.split(',');
                userInfo.latitude = parseFloat(lat); userInfo.longitude = parseFloat(long);
            }
        } catch (error: any) {
            console.error("Error fetching IP info:", error);
            ipError.value = `Could not load IP information: ${error?.message}`;
            userInfo.ipAddress = 'Error fetching';
        }

        // User Agent Data
        if ('userAgentData' in navigator) {
            const uaData = (navigator as any).userAgentData as UserAgentData;
            if (uaData.brands && uaData.brands.length > 0) {
                const primaryBrand = uaData.brands.find(b => !['Chromium', 'Google Chrome', 'Not;A=Brand', 'Not A;Brand'].includes(b.brand)) ||
                    uaData.brands.find(b => b.brand !== "Not;A=Brand" && b.brand !== "Not A;Brand") || // Broader filter
                    uaData.brands[0];
                if (primaryBrand) userInfo.browserNameVersion = `${primaryBrand.brand} ${primaryBrand.version}`;
            }
            userInfo.osNameVersion = uaData.platform || 'N/A';
            userInfo.isMobile = uaData.mobile || false;
        }

        // Battery API
        if ('getBattery' in navigator) {
            try {
                const batteryManager = await (navigator as any).getBattery();
                const updateBatteryInfo = () => {
                    userInfo.battery = {
                        charging: batteryManager.charging, level: batteryManager.level * 100, // %
                        chargingTime: batteryManager.chargingTime, dischargingTime: batteryManager.dischargingTime,
                    };
                };
                updateBatteryInfo();
                batteryManager.addEventListener('chargingchange', updateBatteryInfo);
                batteryManager.addEventListener('levelchange', updateBatteryInfo);
                batteryManager.addEventListener('chargingtimechange', updateBatteryInfo);
                batteryManager.addEventListener('dischargingtimechange', updateBatteryInfo);
            } catch (error) {
                console.warn("Battery Status API error:", error);
                userInfo.battery = { error: "Battery API error", charging: false, level: -1, chargingTime: Infinity, dischargingTime: Infinity };
            }
        } else {
            userInfo.battery = { error: "Battery API not supported", charging: false, level: -1, chargingTime: Infinity, dischargingTime: Infinity };
        }

        // Permissions
        if ('permissions' in navigator && typeof navigator.permissions.query === 'function') {
            const checkPermission = async (name: PermissionName, target: keyof PermissionsState) => {
                try {
                    const status = await navigator.permissions.query({ name });
                    permissions[target] = status.state;
                } catch (e) {
                    console.warn(`Error querying ${name} permission:`, e);
                    permissions[target] = 'Not Queryable';
                }
            };
            await Promise.all([
                checkPermission('geolocation', 'geolocation'),
                checkPermission('notifications', 'notifications'),
                checkPermission('camera', 'camera'),
                checkPermission('microphone', 'microphone')
            ]);
        }


        // Sensors
        if (sensors.available && 'DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', (event) => {
                sensors.liveData = JSON.stringify({
                    acceleration: {
                        x: event.acceleration?.x?.toFixed(2) || 'N/A',
                        y: event.acceleration?.y?.toFixed(2) || 'N/A',
                        z: event.acceleration?.z?.toFixed(2) || 'N/A'
                    },
                    rotationRate: {
                        alpha: event.rotationRate?.alpha?.toFixed(2) || 'N/A',
                        beta: event.rotationRate?.beta?.toFixed(2) || 'N/A',
                        gamma: event.rotationRate?.gamma?.toFixed(2) || 'N/A',
                    },
                    interval: event.interval
                }, null, 2);
            }, { once: true, passive: true });
        }

        media.webgl = checkWebGLSupport(); media.webgl2 = checkWebGL2Support(); checkMediaSupport();
        await checkStorageQuota();
        getSecurityHeaders();

        try {
            document.cookie = "test_3pc=1; SameSite=None; Secure; Max-Age=10"; // Test cookie
            security.thirdPartyCookies = document.cookie.includes('test_3pc=1');
            // No need to explicitly delete, Max-Age will handle it or it's session-scoped if Max-Age fails
        } catch (e) {
            security.thirdPartyCookies = false;
        }

        security.incognito = await detectIncognito();
        security.adBlocker = await detectAdBlocker();
        checkCommonFonts();
        checkAccessibilityPreferences();
        a11y.screenReader = detectScreenReader();
        initializeVisitHistory();

        // Delay performance collection slightly to allow other async ops to settle
        setTimeout(() => {
            collectPerformanceMetrics();
            isLoading.value = false; // Move isLoading here for more accurate "fully loaded"
        }, 500);

        window.addEventListener('resize', () => {
            userInfo.windowInnerWidth = window.innerWidth;
            userInfo.windowInnerHeight = window.innerHeight;
            userInfo.screenOrientation = screen.orientation?.type || 'N/A';
        }, { passive: true });

        if ((navigator as any).connection) {
            const connection = (navigator as any).connection;
            const updateConnectionInfo = () => {
                userInfo.connectionType = connection.type || 'N/A';
                userInfo.effectiveConnectionType = connection.effectiveType || 'N/A';
                userInfo.downlink = connection.downlink || 'N/A';
                userInfo.rtt = connection.rtt || 'N/A';
                userInfo.saveData = connection.saveData || false;
            };
            updateConnectionInfo();
            connection.addEventListener('change', updateConnectionInfo);
        }

        window.addEventListener('online', () => userInfo.isOnline = true, { passive: true });
        window.addEventListener('offline', () => userInfo.isOnline = false, { passive: true });

        // Cleanup interval on component unmount (though composable doesn't have unmount hook directly)
        // This is a consideration if the composable were to be used in a way that it outlives the component.
        // For single use in a component that initializes it, Vue handles teardown of watchers/computed.
        // Explicit cleanup of intervals set by the composable is good practice.
        // However, this composable is designed to run once.
        // If it were to be re-instantiated, ensure old intervals are cleared.
    };

    // Initialize data when the composable is first used
    if (typeof window !== 'undefined') { // Guard for SSR
        initializeAllData();
    } else {
        isLoading.value = false; // Not in browser, nothing to load
    }

    return {
        isLoading: readonly(isLoading), ipError: readonly(ipError),
        userInfo: readonly(userInfo), permissions: readonly(permissions),
        apiSupport: readonly(apiSupport), sensors: readonly(sensors),
        storageInfo: readonly(storageInfo), media: readonly(media),
        performanceMetrics: readonly(performanceMetrics), security: readonly(security),
        fonts: readonly(fonts), a11y: readonly(a11y), history: readonly(history),
    };
}