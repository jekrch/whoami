# WhoAmI :mag:

This is a web app designed to gather and display a comprehensive digital fingerprint of the user's browser and device. It collects a wide array of information, including IP address, location, browser features, hardware details, network status, security settings, and more. This data can be used to understand what information a website can learn about its visitors.

The application is built with Vue.js, Vite, and TypeScript, and styled with Tailwind.

## Getting Started

1.  Clone the repository:
    ```
    git clone https://github.com/jekrch/whoami.git
    cd whoami
    ```

2.  Install dependencies:
    This project uses Bun to manage dependencies. Run the following command in the project's root directory:
    ```
    bun install
    ```

3.  Start the development server:
    To run the application locally for development, use the following command:
    ```
    bun run dev
    ```
    This will typically start the server on `http://localhost:3000`.

4.  Build for production:
    To create a production build of the application, run:
    ```
    bun run build
    ```
    This will compile the Vue.js application, including TypeScript and Vue Single File Components, into static assets located in the `dist` folder.

5.  Preview the production build:
    After building, you can preview the production version locally using:
    ```
    bun run preview
    ```

6.  Deploy to GitHub Pages:
    The project is configured for easy deployment to GitHub Pages. After building the project, run:
    ```
    bun run deploy
    ```
    This script uses `gh-pages` to deploy the contents of the `dist` directory. Ensure your `vite.config.ts` has the correct `base` path (currently set to `/whoami/`) for GitHub Pages deployment.

## Accessing the Application

Once the development server is running (using `bun run dev`), you can access the application by opening a web browser and navigating to:

| Service       | URL                   |
|---------------|-----------------------|
| Frontend      | http://localhost:3000 |

The production version, if deployed (e.g., to GitHub Pages), will be available at `https://jekrch.github.io/whoami/`.

## Features / Data Collected

The application collects a variety of information to create a digital fingerprint. Key categories include:

* **User Info:**
    * IP Address & Geolocation (City, Region, Country, ISP, Timezone, Latitude, Longitude)
    * Browser & OS (User Agent, Browser Name/Version, OS Name/Version, Platform, Vendor, Language(s))
    * Display & Screen (Screen/Window dimensions, Color/Pixel Depth, Device Pixel Ratio, Orientation)
    * Hardware (CPU Cores, Device Memory, Max Touch Points)
    * Network Status (Online status, Connection Type, Effective Connection Type, Downlink, RTT, Save Data mode)
    * Browser Features (Cookies Enabled, Do Not Track status, PDF Viewer, WebDriver, Java Enabled)
    * Date & Time (Local and UTC date/time, Timezone Offset)
    * Battery Status (Charging status, Level, Charging/Discharging time)

* **Permissions State:**
    * Status of permissions for Geolocation, Notifications, Camera, Microphone.

* **API Support:**
    * Availability of Push API, Bluetooth, Web Share, Web USB, WebRTC, Web Speech.

* **Sensors State:**
    * Availability and data from Accelerometer, Gyroscope, Magnetometer, Ambient Light, Device Orientation.

* **Storage Info:**
    * Availability of Local Storage, Session Storage, IndexedDB, Cache API.
    * Storage quota and usage, persistent storage status.

* **Media Capabilities:**
    * Support for WebGL, WebGL2, Canvas, Audio.
    * Supported video and audio formats.
    * GPU information.

* **Performance Metrics:**
    * Page load time, DOM content loaded time, First Paint, First Contentful Paint.
    * Information on loaded resources (name, duration, size).

* **Security Features:**
    * HTTPS status, Content Security Policy (CSP), Cross-Origin-Opener-Policy (COOP), Referrer Policy.
    * Third-party cookie support, Incognito mode detection, Ad blocker detection.

* **Font Info:**
    * System font, default font size, font smoothing.
    * Availability of common fonts.

* **Accessibility Features (A11y):**
    * Preferences for reduced motion, color scheme, contrast.
    * Forced colors status, screen reader detection, keyboard navigation usage.

* **History State:**
    * First visit, last visit, visit count (using localStorage).
    * Referrer, navigation type, session duration.

## Tech Stack

* **Vue.js:** 
* **Vite:** 
* **TypeScript:** 
* **TailwindCSS:** 
* **PostCSS:** 
* **Autoprefixer:**
