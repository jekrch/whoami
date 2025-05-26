export interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
  error?: string;
}

export interface UserAgentDataBrand {
  brand: string;
  version: string;
}

export interface UserAgentData {
  brands?: UserAgentDataBrand[];
  mobile?: boolean;
  platform?: string;
  [key: string]: any;
}

export interface PerformanceResource {
  name: string;
  duration: number;
  size: string;
}

export interface UserInfo {
  // IP & Location
  ipAddress?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  ipTimezone?: string;

  // Browser & OS
  userAgent: string;
  browserNameVersion: string;
  osNameVersion: string;
  isMobile: boolean;
  platform: string;
  vendor: string;
  language: string;
  languages: string;

  // Display & Screen
  screenWidth: number;
  screenHeight: number;
  availScreenWidth: number;
  availScreenHeight: number;
  windowInnerWidth: number;
  windowInnerHeight: number;
  colorDepth: number;
  pixelDepth: number;
  devicePixelRatio: number;
  screenOrientation: string;

  // Hardware & Performance
  cpuCores: number | string;
  deviceMemory: number | string;
  maxTouchPoints: number;

  // Network Status
  isOnline: boolean;
  connectionType: string;
  effectiveConnectionType: string;
  downlink: number | string;
  rtt: number | string;
  saveData: boolean;

  // Browser Features
  cookiesEnabled: boolean;
  doNotTrack: string;
  pdfViewerEnabled: string;
  webdriver: boolean;
  javaEnabled: boolean;

  // Date & Time
  localDateTime: string;
  utcDateTime: string;
  timezoneOffset: number;

  // Battery
  battery: BatteryInfo | null;
}

export interface PermissionsState {
  geolocation: string;
  notifications: string;
  camera: string;
  microphone: string;
}

export interface ApiSupportState {
  pushApi: boolean;
  bluetooth: boolean;
  webShare: boolean;
  webUsb: boolean;
  webRTC: boolean;
  webSpeech: boolean;
}

export interface SensorsState {
  available: boolean;
  accelerometer: boolean;
  gyroscope: boolean;
  magnetometer: boolean;
  ambientLight: boolean;
  deviceOrientation: boolean;
  liveData: string | null;
}

export interface StorageInfoState {
  localStorage: string;
  sessionStorage: string;
  indexedDB: boolean;
  cacheAPI: boolean;
  usage: string;
  quota: string;
  persistentStorage: string;
}

export interface MediaCapabilitiesState {
  webgl: string;
  webgl2: string;
  canvas: boolean;
  audio: boolean;
  videoFormats: string;
  audioFormats: string;
  webrtc: boolean;
  gpuInfo: string | null;
}

export interface PerformanceMetricsState {
  pageLoadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  resources: PerformanceResource[];
}

export interface SecurityFeaturesState {
  isHttps: boolean;
  csp: string | null;
  coop: string | null;
  referrerPolicy: string | null;
  thirdPartyCookies: boolean;
  incognito: boolean;
  adBlocker: boolean;
}

export interface FontInfoState {
  systemFont: string;
  defaultSize: number;
  smoothing: string;
  available: Record<string, boolean>;
}

export interface AccessibilityFeaturesState {
  prefersReducedMotion: boolean;
  prefersColorScheme: string;
  prefersContrast: string;
  forcedColors: string;
  screenReader: boolean;
  keyboardNav: boolean;
}

export interface HistoryState {
  firstVisit: string;
  lastVisit: string;
  visitCount: number;
  referrer: string;
  navigationType: string;
  sessionDuration: string;
  sessionStart: number;
}

export interface GeographicDataState {
  loading: boolean;
  error: string | null;
  elevation: number;
  localTime: string;
  timezone: string;
  countryCode: string;
  country: string;
  currency: string;
  languages: string;
  cityPopulation: string;
  countryPopulation: string;
  nearbyPlaces: Array<{
    name: string;
    distance: number;
  }>;
}