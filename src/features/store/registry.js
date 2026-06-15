// features/store/snippets.js
import { PATHS } from './paths.js';

// Advanced Code Registry
export const REGISTRY = {
  // ===========================
  //️ PERMISSIONS (Atoms)
  // ===========================
  permissions: {
    internet: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.INTERNET",
      content: '<uses-permission android:name="android.permission.INTERNET" />',
      label: "Internet"
    },
    network_state: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.ACCESS_NETWORK_STATE",
      content: '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />',
      label: "Network State"
    },

    // Location
    location_fine: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.ACCESS_FINE_LOCATION",
      content: '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
      label: "Fine Location"
    },
    location_coarse: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.ACCESS_COARSE_LOCATION",
      content: '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
      label: "Coarse Location"
    },
    background_location: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.ACCESS_BACKGROUND_LOCATION",
      content: '<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />',
      label: "Background Location"
    },

    // Storage & Media
    storage_read: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_EXTERNAL_STORAGE",
      content: '<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />',
      label: "Read Storage"
    },
    storage_write: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WRITE_EXTERNAL_STORAGE",
      content: '<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />',
      label: "Write Storage"
    },
    media_images: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_MEDIA_IMAGES",
      content: '<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />',
      label: "Read Images (A13+)"
    },
    media_video: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_MEDIA_VIDEO",
      content: '<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />',
      label: "Read Video (A13+)"
    },
    media_audio: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_MEDIA_AUDIO",
      content: '<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />',
      label: "Read Audio (A13+)"
    },

    // Hardware
    camera: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.CAMERA",
      content: '<uses-permission android:name="android.permission.CAMERA" />',
      label: "Camera"
    },
    record_audio: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.RECORD_AUDIO",
      content: '<uses-permission android:name="android.permission.RECORD_AUDIO" />',
      label: "Record Audio"
    },
    bluetooth: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BLUETOOTH",
      content: '<uses-permission android:name="android.permission.BLUETOOTH" />',
      label: "Bluetooth"
    },
    bluetooth_admin: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BLUETOOTH_ADMIN",
      content: '<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />',
      label: "Bluetooth Admin"
    },
    bluetooth_scan: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BLUETOOTH_SCAN",
      content: '<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />',
      label: "Bluetooth Scan (A12+)"
    },
    bluetooth_connect: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BLUETOOTH_CONNECT",
      content: '<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />',
      label: "Bluetooth Connect (A12+)"
    },
    bluetooth_advertise: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BLUETOOTH_ADVERTISE",
      content: '<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />',
      label: "Bluetooth Advertise (A12+)"
    },
    vibrate: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.VIBRATE",
      content: '<uses-permission android:name="android.permission.VIBRATE" />',
      label: "Vibrate"
    },
    flashlight: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.FLASHLIGHT",
      content: '<uses-permission android:name="android.permission.FLASHLIGHT" />',
      label: "Flashlight"
    },
    // --- Nearby Devices (Android 13+) ---
    nearby_wifi: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.NEARBY_WIFI_DEVICES",
      content: '<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />',
      label: "Nearby Wi-Fi Devices"
    },

    // System
    foreground_service: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.FOREGROUND_SERVICE",
      content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />',
      label: "Foreground Service"
    },
    wake_lock: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WAKE_LOCK",
      content: '<uses-permission android:name="android.permission.WAKE_LOCK" />',
      label: "Wake Lock"
    },
    boot_completed: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.RECEIVE_BOOT_COMPLETED",
      content: '<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />',
      label: "Boot Completed"
    },
    contacts_read: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_CONTACTS",
      content: '<uses-permission android:name="android.permission.READ_CONTACTS" />',
      label: "Read Contacts"
    },
    contacts_write: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WRITE_CONTACTS",
      content: '<uses-permission android:name="android.permission.WRITE_CONTACTS" />',
      label: "Write Contacts"
    },
    biometric: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.USE_BIOMETRIC",
      content: '<uses-permission android:name="android.permission.USE_BIOMETRIC" />',
      label: "Biometric Auth"
    },
    
    // Notification & Alarms
    post_notifications: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.POST_NOTIFICATIONS",
      content: '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
      label: "Post Notifications (A13+)"
    },
    schedule_exact_alarm: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.SCHEDULE_EXACT_ALARM",
      content: '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />',
      label: "Schedule Exact Alarm"
    },

    // Phone & SMS
    call_phone: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.CALL_PHONE",
      content: '<uses-permission android:name="android.permission.CALL_PHONE" />',
      label: "Call Phone"
    },
    // Call Logs
    read_call_log: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_CALL_LOG",
      content: '<uses-permission android:name="android.permission.READ_CALL_LOG" />',
      label: "Read Call Log"
    },
    write_call_log: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WRITE_CALL_LOG",
      content: '<uses-permission android:name="android.permission.WRITE_CALL_LOG" />',
      label: "Write Call Log"
    },
    read_phone_state: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_PHONE_STATE",
      content: '<uses-permission android:name="android.permission.READ_PHONE_STATE" />',
      label: "Read Phone State"
    },
    send_sms: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.SEND_SMS",
      content: '<uses-permission android:name="android.permission.SEND_SMS" />',
      label: "Send SMS"
    },
    receive_sms: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.RECEIVE_SMS",
      content: '<uses-permission android:name="android.permission.RECEIVE_SMS" />',
      label: "Receive SMS"
    },
    read_sms: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_SMS",
      content: '<uses-permission android:name="android.permission.READ_SMS" />',
      label: "Read SMS"
    },

    // Calendar
    read_calendar: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.READ_CALENDAR",
      content: '<uses-permission android:name="android.permission.READ_CALENDAR" />',
      label: "Read Calendar"
    },
    write_calendar: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WRITE_CALENDAR",
      content: '<uses-permission android:name="android.permission.WRITE_CALENDAR" />',
      label: "Write Calendar"
    },

    // NFC
    nfc: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.NFC",
      content: '<uses-permission android:name="android.permission.NFC" />',
      label: "NFC"
    },

    // Install Apps
    request_install_packages: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.REQUEST_INSTALL_PACKAGES",
      content: '<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />',
      label: "Install Packages"
    },
    // Sensors & Activity
    activity_recognition: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.ACTIVITY_RECOGNITION",
      content: '<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />',
      label: "Physical Activity"
    },
    body_sensors: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BODY_SENSORS",
      content: '<uses-permission android:name="android.permission.BODY_SENSORS" />',
      label: "Body Sensors"
    },
    body_sensors_background: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BODY_SENSORS_BACKGROUND",
      content: '<uses-permission android:name="android.permission.BODY_SENSORS_BACKGROUND" />',
      label: "Background Body Sensors"
    } ,
    // ===========================
  // 🛡️ PERMISSIONS (Add these under existing permissions)
  // ===========================

  // System Overlay (Draw over other apps)
  system_alert_window: {
    type: "permission",
    file: PATHS.MANIFEST,
    uniqueKey: "android.permission.SYSTEM_ALERT_WINDOW",
    content: '<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />',
    label: "Draw Over Apps"
  },

  // High Priority (Alarm/Call style full screen)
  use_full_screen_intent: {
    type: "permission",
    file: PATHS.MANIFEST,
    uniqueKey: "android.permission.USE_FULL_SCREEN_INTENT",
    content: '<uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />',
    label: "Full Screen Intent"
  },

    // Android 14 Specific (Must needed if you target API 34+)
    foreground_service_location: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.FOREGROUND_SERVICE_LOCATION",
      content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />',
      label: "FG Service (Location)"
    },
    foreground_service_media: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
      content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />',
      label: "FG Service (Media)"
    },
    
    // Android 14+ Foreground Service Types
    foreground_service_camera: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.FOREGROUND_SERVICE_CAMERA",
        content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_CAMERA" />',
        label: "FG Service Camera (A14+)"
      },
    foreground_service_microphone: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.FOREGROUND_SERVICE_MICROPHONE",
        content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />',
        label: "FG Service Microphone (A14+)"
      },
    foreground_service_data_sync: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.FOREGROUND_SERVICE_DATA_SYNC",
        content: '<uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />',
        label: "FG Service Data Sync (A14+)"
      },
    
      // WiFi & Network
    access_wifi_state: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.ACCESS_WIFI_STATE",
        content: '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />',
        label: "Access WiFi State"
      },
    change_wifi_state: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.CHANGE_WIFI_STATE",
        content: '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />',
        label: "Change WiFi State"
      },
    change_network_state: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.CHANGE_NETWORK_STATE",
      content: '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />',
      label: "Change Network State"
    },
    write_settings: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.WRITE_SETTINGS",
      content: '<uses-permission android:name="android.permission.WRITE_SETTINGS" />',
      label: "Write Settings"
    },

    // Storage
    manage_external_storage: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.MANAGE_EXTERNAL_STORAGE",
      content: '<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />',
      label: "Manage External Storage (All Files)"
    },

    // Audio
    modify_audio_settings: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.MODIFY_AUDIO_SETTINGS",
      content: '<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />',
      label: "Modify Audio Settings"
    },

    // System
    package_usage_stats: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.PACKAGE_USAGE_STATS",
      content: '<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />',
      label: "Package Usage Stats"
    },
    bind_wallpaper: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BIND_WALLPAPER",
      content: '<uses-permission android:name="android.permission.BIND_WALLPAPER" />',
      label: "Bind Wallpaper"
    },
    bind_device_admin: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.BIND_DEVICE_ADMIN",
      content: '<uses-permission android:name="android.permission.BIND_DEVICE_ADMIN" />',
      label: "Device Administrator"
    },
    query_all_packages: {
      type: "permission",
      file: PATHS.MANIFEST,
      uniqueKey: "android.permission.QUERY_ALL_PACKAGES",
      content: '<uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" />',
      label: "Query All Packages"
    },
    
    
  
    // Location (Extended)
    location_background: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.ACCESS_BACKGROUND_LOCATION",
        content: '<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />',
        label:'Location Background'
    },

    // Sensors
    high_sampling_rate: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.HIGH_SAMPLING_RATE_SENSORS",
        content: '<uses-permission android:name="android.permission.HIGH_SAMPLING_RATE_SENSORS" />',
        label:'High sampling rate'
    },

    receive_boot_completed: {
        type: "permission",
        file: PATHS.MANIFEST,
        uniqueKey: "android.permission.RECEIVE_BOOT_COMPLETED",
        content: '<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />',
        label: 'Receive Boot Completed'
    },
    
},

  // ===========================
  // 📦 DEPENDENCIES WITH VERSIONS
  // ===========================
  dependencies: {
    // --- Core & Architecture ---
    core_ktx: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.core:core-ktx:${version}'",
      label: "Core KTX",
      versions: ["1.13.1", "1.12.0", "1.10.1", "1.9.0"],
      defaultVersion: "1.13.1"
    },
    appcompat: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.appcompat:appcompat:${version}'",
      label: "AppCompat",
      versions: ["1.7.0", "1.6.1", "1.5.1", "1.4.2"],
      defaultVersion: "1.7.0"
    },
    material: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.material:material:${version}'",
      label: "Material Design 3",
      versions: ["1.12.0", "1.11.0", "1.10.0", "1.9.0"],
      defaultVersion: "1.12.0"
    },
    constraint: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.constraintlayout:constraintlayout:${version}'",
      label: "ConstraintLayout",
      versions: ["2.1.4", "2.1.3", "2.0.4"],
      defaultVersion: "2.1.4"
    },
    activity_ktx: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.activity:activity-ktx:${version}'",
      label: "Activity KTX",
      versions: ["1.9.0", "1.8.2", "1.7.2", "1.6.1"],
      defaultVersion: "1.9.0"
    },
    fragment_ktx: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.fragment:fragment-ktx:${version}'",
      label: "Fragment KTX",
      versions: ["1.7.0", "1.6.2", "1.5.7", "1.4.1"],
      defaultVersion: "1.7.0"
    },

    // --- Jetpack Compose ---
    compose_bom: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation platform('androidx.compose:compose-bom:${version}')",
      label: "Compose BOM",
      versions: ["2024.06.00", "2024.05.00", "2024.04.00", "2024.03.00", "2024.02.00", "2024.01.00", "2023.10.01"],
      defaultVersion: "2024.06.00"
    },
    compose_ui: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.compose.ui:ui'",
      label: "Compose UI",
      note: "Version managed by BOM"
    },
    compose_material3: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.compose.material3:material3'",
      label: "Compose Material3",
      note: "Version managed by BOM"
    },
    compose_material: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.compose.material:material'",
      label: "Compose Material2",
      note: "Version managed by BOM"
    },
    compose_preview: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.compose.ui:ui-tooling-preview'",
      label: "Compose Preview",
      note: "Version managed by BOM"
    },
    compose_tooling: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "debugImplementation 'androidx.compose.ui:ui-tooling'",
      label: "Compose Tooling",
      note: "Version managed by BOM"
    },
    compose_activity: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.activity:activity-compose:${version}'",
      label: "Activity Compose",
      versions: ["1.9.0", "1.8.2", "1.7.2", "1.6.1"],
      defaultVersion: "1.9.0"
    },
    compose_viewmodel: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-viewmodel-compose:${version}'",
      label: "ViewModel Compose",
      versions: ["2.8.0", "2.7.0", "2.6.2", "2.5.1"],
      defaultVersion: "2.8.0"
    },
    compose_runtime_livedata: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.compose.runtime:runtime-livedata'",
      label: "Compose LiveData",
      note: "Version managed by BOM"
    },
    compose_navigation: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.navigation:navigation-compose:${version}'",
      label: "Navigation Compose",
      versions: ["2.7.7", "2.7.6", "2.7.5", "2.6.0"],
      defaultVersion: "2.7.7"
    },

    // Navigation
    nav_fragment: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.navigation:navigation-fragment-ktx:${version}'",
      label: "Navigation Fragment",
      versions: ["2.7.7", "2.7.6", "2.7.5", "2.6.0", "2.5.3"],
      defaultVersion: "2.7.7"
    },
    nav_ui: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.navigation:navigation-ui-ktx:${version}'",
      label: "Navigation UI",
      versions: ["2.7.7", "2.7.6", "2.7.5", "2.6.0", "2.5.3"],
      defaultVersion: "2.7.7"
    },
    nav_dynamic_features: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.navigation:navigation-dynamic-features-fragment:${version}'",
      label: "Navigation Dynamic Features",
      versions: ["2.7.7", "2.7.6", "2.7.5"],
      defaultVersion: "2.7.7"
    },

    // Lifecycle & Coroutines
    lifecycle_viewmodel: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:${version}'",
      label: "ViewModel",
      versions: ["2.8.0", "2.7.0", "2.6.2", "2.5.1"],
      defaultVersion: "2.8.0"
    },
    lifecycle_livedata: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-livedata-ktx:${version}'",
      label: "LiveData",
      versions: ["2.8.0", "2.7.0", "2.6.2", "2.5.1"],
      defaultVersion: "2.8.0"
    },
    lifecycle_runtime: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-runtime-ktx:${version}'",
      label: "Lifecycle Runtime",
      versions: ["2.8.0", "2.7.0", "2.6.2", "2.5.1"],
      defaultVersion: "2.8.0"
    },
    lifecycle_service: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-service:${version}'",
      label: "Lifecycle Service",
      versions: ["2.8.0", "2.7.0", "2.6.2"],
      defaultVersion: "2.8.0"
    },
    lifecycle_process: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.lifecycle:lifecycle-process:${version}'",
      label: "Lifecycle Process",
      versions: ["2.8.0", "2.7.0", "2.6.2"],
      defaultVersion: "2.8.0"
    },
    coroutines_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:${version}'",
      label: "Coroutines Android",
      versions: ["1.8.0", "1.7.3", "1.7.1", "1.6.4"],
      defaultVersion: "1.8.0"
    },
    coroutines_core: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:${version}'",
      label: "Coroutines Core",
      versions: ["1.8.0", "1.7.3", "1.7.1", "1.6.4"],
      defaultVersion: "1.8.0"
    },
    coroutines_play_services: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-play-services:${version}'",
      label: "Coroutines Play Services",
      versions: ["1.8.0", "1.7.3", "1.7.1"],
      defaultVersion: "1.8.0"
    },

    // --- Networking ---
    retrofit: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.retrofit2:retrofit:${version}'",
      label: "Retrofit",
      versions: ["2.11.0", "2.10.0", "2.9.0", "2.8.1", "2.7.2"],
      defaultVersion: "2.11.0"
    },
    retrofit_gson: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.retrofit2:converter-gson:${version}'",
      label: "Gson Converter",
      versions: ["2.11.0", "2.10.0", "2.9.0", "2.8.1"],
      defaultVersion: "2.11.0"
    },
    retrofit_moshi: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.retrofit2:converter-moshi:${version}'",
      label: "Moshi Converter",
      versions: ["2.11.0", "2.10.0", "2.9.0", "2.8.1"],
      defaultVersion: "2.11.0"
    },
    retrofit_scalars: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.retrofit2:converter-scalars:${version}'",
      label: "Scalars Converter",
      versions: ["2.11.0", "2.10.0", "2.9.0"],
      defaultVersion: "2.11.0"
    },
    retrofit_rxjava3: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.retrofit2:adapter-rxjava3:${version}'",
      label: "RxJava3 Adapter",
      versions: ["2.11.0", "2.9.0"],
      defaultVersion: "2.11.0"
    },
    okhttp: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.okhttp3:okhttp:${version}'",
      label: "OkHttp",
      versions: ["4.12.0", "4.11.0", "4.10.0", "4.9.3"],
      defaultVersion: "4.12.0"
    },
    logging_interceptor: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.okhttp3:logging-interceptor:${version}'",
      label: "Logging Interceptor",
      versions: ["4.12.0", "4.11.0", "4.10.0", "4.9.3"],
      defaultVersion: "4.12.0"
    },
    okhttp_urlconnection: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.okhttp3:okhttp-urlconnection:${version}'",
      label: "OkHttp URLConnection",
      versions: ["4.12.0", "4.11.0"],
      defaultVersion: "4.12.0"
    },
    volley: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.android.volley:volley:${version}'",
      label: "Volley",
      versions: ["1.2.1", "1.2.0", "1.1.1"],
      defaultVersion: "1.2.1"
    },
    gson: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.code.gson:gson:${version}'",
      label: "Gson",
      versions: ["2.10.1", "2.10.0", "2.9.1", "2.8.9"],
      defaultVersion: "2.10.1"
    },
    moshi: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.moshi:moshi-kotlin:${version}'",
      label: "Moshi",
      versions: ["1.15.1", "1.15.0", "1.14.0", "1.13.0"],
      defaultVersion: "1.15.1"
    },
    moshi_codegen: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "kapt 'com.squareup.moshi:moshi-kotlin-codegen:${version}'",
      label: "Moshi Codegen",
      versions: ["1.15.1", "1.15.0", "1.14.0"],
      defaultVersion: "1.15.1"
    },

    // --- Image Loading ---
    glide: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.github.bumptech.glide:glide:${version}'",
      label: "Glide",
      versions: ["4.16.0", "4.15.1", "4.14.2", "4.13.2"],
      defaultVersion: "4.16.0"
    },
    glide_compiler: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "kapt 'com.github.bumptech.glide:compiler:${version}'",
      label: "Glide Compiler",
      versions: ["4.16.0", "4.15.1", "4.14.2"],
      defaultVersion: "4.16.0"
    },
    coil: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.coil-kt:coil:${version}'",
      label: "Coil",
      versions: ["2.6.0", "2.5.0", "2.4.0", "2.3.0"],
      defaultVersion: "2.6.0"
    },
    coil_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.coil-kt:coil-compose:${version}'",
      label: "Coil Compose",
      versions: ["2.6.0", "2.5.0", "2.4.0", "2.3.0"],
      defaultVersion: "2.6.0"
    },
    coil_svg: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.coil-kt:coil-svg:${version}'",
      label: "Coil SVG",
      versions: ["2.6.0", "2.5.0", "2.4.0"],
      defaultVersion: "2.6.0"
    },
    coil_gif: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.coil-kt:coil-gif:${version}'",
      label: "Coil GIF",
      versions: ["2.6.0", "2.5.0", "2.4.0"],
      defaultVersion: "2.6.0"
    },
    picasso: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.picasso:picasso:${version}'",
      label: "Picasso",
      versions: ["2.8", "2.71828"],
      defaultVersion: "2.8"
    },

    // --- Database & Storage ---
    room_runtime: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.room:room-runtime:${version}'",
      label: "Room Runtime",
      versions: ["2.6.1", "2.6.0", "2.5.2", "2.5.1"],
      defaultVersion: "2.6.1"
    },
    room_ktx: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.room:room-ktx:${version}'",
      label: "Room KTX",
      versions: ["2.6.1", "2.6.0", "2.5.2", "2.5.1"],
      defaultVersion: "2.6.1"
    },
    room_compiler: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "kapt 'androidx.room:room-compiler:${version}'",
      label: "Room Compiler",
      versions: ["2.6.1", "2.6.0", "2.5.2"],
      defaultVersion: "2.6.1"
    },
    room_paging: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.room:room-paging:${version}'",
      label: "Room Paging",
      versions: ["2.6.1", "2.6.0", "2.5.2"],
      defaultVersion: "2.6.1"
    },
    datastore_pref: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.datastore:datastore-preferences:${version}'",
      label: "DataStore Prefs",
      versions: ["1.1.1", "1.1.0", "1.0.0"],
      defaultVersion: "1.1.1"
    },
    datastore_core: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.datastore:datastore-core:${version}'",
      label: "DataStore Core",
      versions: ["1.1.1", "1.1.0", "1.0.0"],
      defaultVersion: "1.1.1"
    },
    datastore_proto: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.datastore:datastore:${version}'",
      label: "DataStore Proto",
      versions: ["1.1.1", "1.1.0", "1.0.0"],
      defaultVersion: "1.1.1"
    },

    // --- Background Work ---
    work_manager: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.work:work-runtime-ktx:${version}'",
      label: "WorkManager",
      versions: ["2.9.0", "2.8.1", "2.7.1"],
      defaultVersion: "2.9.0"
    },
    work_gcm: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.work:work-gcm:${version}'",
      label: "WorkManager GCM",
      versions: ["2.9.0", "2.8.1"],
      defaultVersion: "2.9.0"
    },

    // --- Dependency Injection ---
    hilt_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.dagger:hilt-android:${version}'",
      label: "Hilt Android",
      versions: ["2.51.1", "2.51", "2.50", "2.49", "2.48"],
      defaultVersion: "2.51.1"
    },
    hilt_compiler: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "kapt 'com.google.dagger:hilt-android-compiler:${version}'",
      label: "Hilt Compiler",
      versions: ["2.51.1", "2.51", "2.50", "2.49"],
      defaultVersion: "2.51.1"
    },
    hilt_navigation_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.hilt:hilt-navigation-compose:${version}'",
      label: "Hilt Navigation Compose",
      versions: ["1.2.0", "1.1.0", "1.0.0"],
      defaultVersion: "1.2.0"
    },
    hilt_work: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.hilt:hilt-work:${version}'",
      label: "Hilt WorkManager",
      versions: ["1.2.0", "1.1.0", "1.0.0"],
      defaultVersion: "1.2.0"
    },
    koin_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.insert-koin:koin-android:${version}'",
      label: "Koin Android",
      versions: ["3.5.6", "3.5.3", "3.5.0", "3.4.3"],
      defaultVersion: "3.5.6"
    },
    koin_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.insert-koin:koin-androidx-compose:${version}'",
      label: "Koin Compose",
      versions: ["3.5.6", "3.5.3", "3.5.0"],
      defaultVersion: "3.5.6"
    },
    koin_navigation: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.insert-koin:koin-androidx-navigation:${version}'",
      label: "Koin Navigation",
      versions: ["3.5.6", "3.5.3"],
      defaultVersion: "3.5.6"
    },
    koin_workmanager: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.insert-koin:koin-androidx-workmanager:${version}'",
      label: "Koin WorkManager",
      versions: ["3.5.6", "3.5.3"],
      defaultVersion: "3.5.6"
    },

    // --- Google Services ---
    maps_sdk: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-maps:${version}'",
      label: "Maps SDK",
      versions: ["18.2.0", "18.1.0", "18.0.2", "17.0.1"],
      defaultVersion: "18.2.0"
    },
    maps_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.maps.android:maps-compose:${version}'",
      label: "Maps Compose",
      versions: ["4.4.1", "4.4.0", "4.3.3", "4.3.0", "2.15.0"],
      defaultVersion: "4.4.1"
    },
    maps_utils: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.maps.android:android-maps-utils:${version}'",
      label: "Maps Utils",
      versions: ["3.8.2", "3.8.0", "3.4.0"],
      defaultVersion: "3.8.2"
    },
    location_services: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-location:${version}'",
      label: "Location Services",
      versions: ["21.3.0", "21.2.0", "21.1.0", "21.0.1", "20.0.0"],
      defaultVersion: "21.3.0"
    },
    admob: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-ads:${version}'",
      label: "AdMob",
      versions: ["23.1.0", "23.0.0", "22.6.0", "22.5.0", "22.4.0"],
      defaultVersion: "23.1.0"
    },
    auth_google: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-auth:${version}'",
      label: "Google Sign-In",
      versions: ["21.1.1", "21.1.0", "21.0.0", "20.7.0"],
      defaultVersion: "21.1.1"
    },

    // --- Firebase ---
    firebase_bom: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation platform('com.google.firebase:firebase-bom:${version}')",
      label: "Firebase BOM",
      versions: ["33.0.0", "32.8.1", "32.8.0", "32.7.4", "32.7.0", "32.6.0"],
      defaultVersion: "33.0.0"
    },
    firebase_analytics: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-analytics'",
      label: "Analytics",
      note: "Version managed by BOM"
    },
    firebase_auth: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-auth'",
      label: "Authentication",
      note: "Version managed by BOM"
    },
    firebase_firestore: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-firestore'",
      label: "Firestore",
      note: "Version managed by BOM"
    },
    firebase_database: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-database'",
      label: "Realtime Database",
      note: "Version managed by BOM"
    },
    firebase_storage: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-storage'",
      label: "Cloud Storage",
      note: "Version managed by BOM"
    },
    firebase_messaging: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-messaging'",
      label: "FCM (Messaging)",
      note: "Version managed by BOM"
    },
    firebase_crashlytics: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-crashlytics'",
      label: "Crashlytics",
      note: "Version managed by BOM"
    },
    firebase_performance: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-perf'",
      label: "Performance Monitoring",
      note: "Version managed by BOM"
    },
    firebase_config: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-config'",
      label: "Remote Config",
      note: "Version managed by BOM"
    },
    firebase_dynamic_links: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-dynamic-links'",
      label: "Dynamic Links",
      note: "Version managed by BOM"
    },
    firebase_functions: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-functions'",
      label: "Cloud Functions",
      note: "Version managed by BOM"
    },
    firebase_inappmessaging: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.firebase:firebase-inappmessaging-display'",
      label: "In-App Messaging",
      note: "Version managed by BOM"
    },

    // --- CameraX ---
    camerax_core: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-core:${version}'",
      label: "CameraX Core",
      versions: ["1.3.3", "1.3.2", "1.3.1", "1.3.0", "1.2.3"],
      defaultVersion: "1.3.3"
    },
    camerax_camera2: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-camera2:${version}'",
      label: "CameraX Camera2",
      versions: ["1.3.3", "1.3.2", "1.3.1", "1.3.0"],
      defaultVersion: "1.3.3"
    },
    camerax_lifecycle: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-lifecycle:${version}'",
      label: "CameraX Lifecycle",
      versions: ["1.3.3", "1.3.2", "1.3.1", "1.3.0"],
      defaultVersion: "1.3.3"
    },
    camerax_view: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-view:${version}'",
      label: "CameraX View",
      versions: ["1.3.3", "1.3.2", "1.3.1", "1.3.0"],
      defaultVersion: "1.3.3"
    },
    camerax_extensions: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-extensions:${version}'",
      label: "CameraX Extensions",
      versions: ["1.3.3", "1.3.2", "1.3.1"],
      defaultVersion: "1.3.3"
    },
    camerax_video: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.camera:camera-video:${version}'",
      label: "CameraX Video",
      versions: ["1.3.3", "1.3.2", "1.3.1"],
      defaultVersion: "1.3.3"
    },

    // --- Media ---
    exoplayer: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-exoplayer:${version}'",
      label: "ExoPlayer",
      versions: ["1.3.1", "1.3.0", "1.2.1", "1.2.0", "1.1.1"],
      defaultVersion: "1.3.1"
    },
    exoplayer_ui: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-ui:${version}'",
      label: "ExoPlayer UI",
      versions: ["1.3.1", "1.3.0", "1.2.1", "1.2.0"],
      defaultVersion: "1.3.1"
    },
    exoplayer_dash: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-exoplayer-dash:${version}'",
      label: "ExoPlayer DASH",
      versions: ["1.3.1", "1.3.0", "1.2.1"],
      defaultVersion: "1.3.1"
    },
    exoplayer_hls: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-exoplayer-hls:${version}'",
      label: "ExoPlayer HLS",
      versions: ["1.3.1", "1.3.0", "1.2.1"],
      defaultVersion: "1.3.1"
    },
    exoplayer_rtsp: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-exoplayer-rtsp:${version}'",
      label: "ExoPlayer RTSP",
      versions: ["1.3.1", "1.3.0", "1.2.1"],
      defaultVersion: "1.3.1"
    },

    // --- UI Utils ---
    lottie: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.airbnb.android:lottie:${version}'",
      label: "Lottie",
      versions: ["6.4.0", "6.3.0", "6.2.0", "6.1.0", "6.0.0"],
      defaultVersion: "6.4.0"
    },
    lottie_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.airbnb.android:lottie-compose:${version}'",
      label: "Lottie Compose",
      versions: ["6.4.0", "6.3.0", "6.2.0", "6.1.0"],
      defaultVersion: "6.4.0"
    },
    swiperefresh: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.swiperefreshlayout:swiperefreshlayout:${version}'",
      label: "SwipeRefresh",
      versions: ["1.1.0", "1.0.0"],
      defaultVersion: "1.1.0"
    },
    circleimageview: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'de.hdodenhof:circleimageview:${version}'",
      label: "CircleImageView",
      versions: ["3.1.0", "3.0.1", "2.2.0"],
      defaultVersion: "3.1.0"
    },
    shimmer: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.facebook.shimmer:shimmer:${version}'",
      label: "Facebook Shimmer",
      versions: ["0.5.0", "0.4.0"],
      defaultVersion: "0.5.0"
    },
    mpandroidchart: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.github.PhilJay:MPAndroidChart:${version}'",
      label: "MPAndroidChart",
      versions: ["v3.1.0", "v3.0.3"],
      defaultVersion: "v3.1.0"
    },
    viewpager2: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.viewpager2:viewpager2:${version}'",
      label: "ViewPager2",
      versions: ["1.1.0", "1.0.0"],
      defaultVersion: "1.1.0"
    },
    recyclerview: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.recyclerview:recyclerview:${version}'",
      label: "RecyclerView",
      versions: ["1.3.2", "1.3.1", "1.3.0", "1.2.1"],
      defaultVersion: "1.3.2"
    },
    cardview: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.cardview:cardview:${version}'",
      label: "CardView",
      versions: ["1.0.0"],
      defaultVersion: "1.0.0"
    },

    // --- Security & Biometric ---
    biometric: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.biometric:biometric:${version}'",
      label: "Biometric Auth",
      versions: ["1.2.0-alpha05", "1.1.0", "1.0.1"],
      defaultVersion: "1.2.0-alpha05"
    },
    security_crypto: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.security:security-crypto:${version}'",
      label: "Security Crypto",
      versions: ["1.1.0-alpha06", "1.0.0"],
      defaultVersion: "1.1.0-alpha06"
    },

    // --- Social Media SDKs ---
    facebook_login: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.facebook.android:facebook-login:${version}'",
      label: "Facebook Login",
      versions: ["16.3.0", "16.2.0", "16.1.3"],
      defaultVersion: "16.3.0"
    },
    facebook_share: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.facebook.android:facebook-share:${version}'",
      label: "Facebook Share",
      versions: ["16.3.0", "16.2.0", "16.1.3"],
      defaultVersion: "16.3.0"
    },

    // --- QR & Barcode ---
    zxing_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.journeyapps:zxing-android-embedded:${version}'",
      label: "ZXing QR/Barcode",
      versions: ["4.3.0", "4.2.0", "4.1.0"],
      defaultVersion: "4.3.0"
    },
    mlkit_barcode: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.mlkit:barcode-scanning:${version}'",
      label: "ML Kit Barcode",
      versions: ["17.2.0", "17.1.0", "17.0.3"],
      defaultVersion: "17.2.0"
    },

    // --- PDF & Documents ---
    pdfbox: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.tom-roush:pdfbox-android:${version}'",
      label: "PDFBox Android",
      versions: ["2.0.27.0", "2.0.26.0", "2.0.25.0"],
      defaultVersion: "2.0.27.0"
    },
    itext_pdf: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.itextpdf:itext7-core:${version}'",
      label: "iText PDF",
      versions: ["7.2.5", "7.2.4", "7.2.3"],
      defaultVersion: "7.2.5"
    },

    // --- WebView ---
    webkit: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.webkit:webkit:${version}'",
      label: "WebKit (WebView)",
      versions: ["1.11.0", "1.10.0", "1.9.0", "1.8.0"],
      defaultVersion: "1.11.0"
    },
    browser: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.browser:browser:${version}'",
      label: "Chrome Custom Tabs",
      versions: ["1.8.0", "1.7.0", "1.6.0"],
      defaultVersion: "1.8.0"
    },

    // --- In-App Billing & Play Services ---
    billing: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.android.billingclient:billing-ktx:${version}'",
      label: "Google Billing",
      versions: ["7.0.0", "6.2.1", "6.1.0", "6.0.1"],
      defaultVersion: "7.0.0"
    },
    play_review: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.play:review:${version}'",
      label: "In-App Review",
      versions: ["2.0.1", "2.0.0", "1.2.0"],
      defaultVersion: "2.0.1"
    },
    play_update: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.play:app-update:${version}'",
      label: "In-App Update",
      versions: ["2.1.0", "2.0.1", "2.0.0"],
      defaultVersion: "2.1.0"
    },
    play_integrity: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.play:integrity:${version}'",
      label: "Play Integrity API",
      versions: ["1.3.0", "1.2.0", "1.1.0"],
      defaultVersion: "1.3.0"
    },

    // --- Payment Gateways ---
    stripe_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.stripe:stripe-android:${version}'",
      label: "Stripe Android",
      versions: ["20.48.0", "20.47.0", "20.45.0", "20.40.0", "20.37.2"],
      defaultVersion: "20.48.0"
    },
    razorpay: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.razorpay:checkout:${version}'",
      label: "Razorpay",
      versions: ["1.6.40", "1.6.38", "1.6.33"],
      defaultVersion: "1.6.40"
    },

    // --- Testing ---
    junit: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'junit:junit:${version}'",
      label: "JUnit",
      versions: ["4.13.2", "4.13.1", "4.12"],
      defaultVersion: "4.13.2"
    },
    junit5: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'org.junit.jupiter:junit-jupiter:${version}'",
      label: "JUnit 5",
      versions: ["5.10.2", "5.10.0", "5.9.3"],
      defaultVersion: "5.10.2"
    },
    espresso: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "androidTestImplementation 'androidx.test.espresso:espresso-core:${version}'",
      label: "Espresso",
      versions: ["3.5.1", "3.5.0", "3.4.0"],
      defaultVersion: "3.5.1"
    },
    mockito: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'org.mockito:mockito-core:${version}'",
      label: "Mockito",
      versions: ["5.11.0", "5.10.0", "5.8.0", "4.11.0"],
      defaultVersion: "5.11.0"
    },
    mockk: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'io.mockk:mockk:${version}'",
      label: "MockK",
      versions: ["1.13.10", "1.13.9", "1.13.8", "1.13.5"],
      defaultVersion: "1.13.10"
    },
    coroutines_test: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'org.jetbrains.kotlinx:kotlinx-coroutines-test:${version}'",
      label: "Coroutines Test",
      versions: ["1.8.0", "1.7.3", "1.7.1"],
      defaultVersion: "1.8.0"
    },
    androidx_test_core: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'androidx.test:core:${version}'",
      label: "AndroidX Test Core",
      versions: ["1.5.0", "1.4.0"],
      defaultVersion: "1.5.0"
    },
    androidx_test_runner: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "androidTestImplementation 'androidx.test:runner:${version}'",
      label: "Test Runner",
      versions: ["1.5.2", "1.5.1", "1.4.0"],
      defaultVersion: "1.5.2"
    },
    androidx_test_rules: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "androidTestImplementation 'androidx.test:rules:${version}'",
      label: "Test Rules",
      versions: ["1.5.0", "1.4.0"],
      defaultVersion: "1.5.0"
    },
    turbine: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "testImplementation 'app.cash.turbine:turbine:${version}'",
      label: "Turbine (Flow Testing)",
      versions: ["1.1.0", "1.0.0", "0.13.0"],
      defaultVersion: "1.1.0"
    },

    // --- Utilities ---
    timber: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.jakewharton.timber:timber:${version}'",
      label: "Timber Logging",
      versions: ["5.0.1", "5.0.0", "4.7.1"],
      defaultVersion: "5.0.1"
    },
    leakcanary: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "debugImplementation 'com.squareup.leakcanary:leakcanary-android:${version}'",
      label: "LeakCanary",
      versions: ["2.14", "2.13", "2.12"],
      defaultVersion: "2.14"
    },
    eventbus: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.greenrobot:eventbus:${version}'",
      label: "EventBus",
      versions: ["3.3.1", "3.3.0", "3.2.0"],
      defaultVersion: "3.3.1"
    },

    // --- Splash Screen ---
    splash_screen: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.core:core-splashscreen:${version}'",
      label: "Splash Screen API",
      versions: ["1.0.1", "1.0.0"],
      defaultVersion: "1.0.1"
    },

    // --- Paging ---
    paging_runtime: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.paging:paging-runtime-ktx:${version}'",
      label: "Paging 3",
      versions: ["3.3.0", "3.2.1", "3.2.0", "3.1.1"],
      defaultVersion: "3.3.0"
    },
    paging_compose: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.paging:paging-compose:${version}'",
      label: "Paging Compose",
      versions: ["3.3.0", "3.2.1", "3.2.0"],
      defaultVersion: "3.3.0"
    },

    // --- Accompanist (Compose Utilities) ---
    accompanist_permissions: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.accompanist:accompanist-permissions:${version}'",
      label: "Accompanist Permissions",
      versions: ["0.34.0", "0.33.2-alpha", "0.32.0"],
      defaultVersion: "0.34.0"
    },
    accompanist_systemuicontroller: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.accompanist:accompanist-systemuicontroller:${version}'",
      label: "Accompanist SystemUI Controller",
      versions: ["0.34.0", "0.33.2-alpha", "0.32.0"],
      defaultVersion: "0.34.0"
    },
    accompanist_placeholder: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.accompanist:accompanist-placeholder-material:${version}'",
      label: "Accompanist Placeholder",
      versions: ["0.34.0", "0.33.2-alpha"],
      defaultVersion: "0.34.0"
    },
    accompanist_swiperefresh: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.accompanist:accompanist-swiperefresh:${version}'",
      label: "Accompanist SwipeRefresh",
      versions: ["0.34.0", "0.33.2-alpha"],
      defaultVersion: "0.34.0"
    },
    accompanist_navigation_material: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.accompanist:accompanist-navigation-material:${version}'",
      label: "Accompanist Navigation Material",
      versions: ["0.34.0", "0.33.2-alpha"],
      defaultVersion: "0.34.0"
    },

    // --- Additional Popular Libraries ---
    rxjava3: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.reactivex.rxjava3:rxjava:${version}'",
      label: "RxJava 3",
      versions: ["3.1.8", "3.1.7", "3.1.6"],
      defaultVersion: "3.1.8"
    },
    rxandroid: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.reactivex.rxjava3:rxandroid:${version}'",
      label: "RxAndroid",
      versions: ["3.0.2", "3.0.0"],
      defaultVersion: "3.0.2"
    },
    gson_fire: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.gsonfire:gson-fire:${version}'",
      label: "Gson Fire",
      versions: ["1.9.0", "1.8.5"],
      defaultVersion: "1.9.0"
    },
    preferences: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.preference:preference-ktx:${version}'",
      label: "Preferences KTX",
      versions: ["1.2.1", "1.2.0", "1.1.1"],
      defaultVersion: "1.2.1"
    },
    startup_runtime: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.startup:startup-runtime:${version}'",
      label: "Startup Runtime",
      versions: ["1.1.1", "1.1.0", "1.0.0"],
      defaultVersion: "1.1.1"
    },
    window: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.window:window:${version}'",
      label: "Window Manager",
      versions: ["1.3.0", "1.2.0", "1.1.0"],
      defaultVersion: "1.3.0"
    } ,
    
    
    // ML Kit
    mlkit_text_recognition: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.mlkit:text-recognition:${version}'",
      label: "ML Kit Text Recognition",
      versions: ["16.0.0", "16.0.0-beta6"],
      defaultVersion: "16.0.0"
    },
    mlkit_face_detection: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.mlkit:face-detection:${version}'",
      label: "ML Kit Face Detection",
      versions: ["16.1.6", "16.1.5"],
      defaultVersion: "16.1.6"
    },
    mlkit_image_labeling: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.mlkit:image-labeling:${version}'",
      label: "ML Kit Image Labeling",
      versions: ["17.0.8", "17.0.7"],
      defaultVersion: "17.0.8"
    },

    // TensorFlow Lite
    tensorflow_lite: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.tensorflow:tensorflow-lite:${version}'",
      label: "TensorFlow Lite",
      versions: ["2.15.0", "2.14.0", "2.13.0"],
      defaultVersion: "2.15.0"
    },
    tensorflow_lite_support: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.tensorflow:tensorflow-lite-support:${version}'",
      label: "TensorFlow Lite Support",
      versions: ["0.4.4", "0.4.3"],
      defaultVersion: "0.4.4"
    },
    tensorflow_lite_gpu: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'org.tensorflow:tensorflow-lite-gpu:${version}'",
      label: "TensorFlow Lite GPU",
      versions: ["2.15.0", "2.14.0"],
      defaultVersion: "2.15.0"
    },

    // AR/VR
    arcore: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.ar:core:${version}'",
      label: "ARCore",
      versions: ["1.42.0", "1.41.0", "1.40.0"],
      defaultVersion: "1.42.0"
    },
    sceneform: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.ar.sceneform.ux:sceneform-ux:${version}'",
      label: "Sceneform (ARCore UI)",
      versions: ["1.17.1"],
      defaultVersion: "1.17.1"
    },
    cardboard: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.vr:sdk-base:${version}'",
      label: "Google Cardboard VR",
      versions: ["1.210.0", "1.200.0"],
      defaultVersion: "1.210.0"
    },

    // Audio/Media
    media_compat: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media:media:${version}'",
      label: "Media Compat",
      versions: ["1.7.0", "1.6.0"],
      defaultVersion: "1.7.0"
    },
    media3_common: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.media3:media3-common:${version}'",
      label: "Media3 Common",
      versions: ["1.3.1", "1.3.0"],
      defaultVersion: "1.3.1"
    },

    // GraphQL & gRPC
    apollo_runtime: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.apollographql.apollo3:apollo-runtime:${version}'",
      label: "Apollo GraphQL Runtime",
      versions: ["4.0.0", "3.8.4"],
      defaultVersion: "4.0.0"
    },
    apollo_coroutines: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.apollographql.apollo3:apollo-normalized-cache:${version}'",
      label: "Apollo Cache",
      versions: ["4.0.0", "3.8.4"],
      defaultVersion: "4.0.0"
    },
    grpc_okhttp: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.grpc:grpc-okhttp:${version}'",
      label: "gRPC OkHttp",
      versions: ["1.62.2", "1.60.0"],
      defaultVersion: "1.62.2"
    },
    grpc_protobuf: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.grpc:grpc-protobuf-lite:${version}'",
      label: "gRPC Protobuf",
      versions: ["1.62.2", "1.60.0"],
      defaultVersion: "1.62.2"
    },

    // Analytics
    mixpanel: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.mixpanel.android:mixpanel-android:${version}'",
      label: "Mixpanel",
      versions: ["7.5.0", "7.4.0"],
      defaultVersion: "7.5.0"
    },
    amplitude: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.amplitude:analytics-android:${version}'",
      label: "Amplitude",
      versions: ["1.16.5", "1.16.0"],
      defaultVersion: "1.16.5"
    },

    // Payments
    paypal: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.paypal.checkout:android-sdk:${version}'",
      label: "PayPal SDK",
      versions: ["1.3.1", "1.3.0"],
      defaultVersion: "1.3.1"
    },
    paytm: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.paytm:pgplussdk:${version}'",
      label: "Paytm SDK",
      versions: ["1.4.7", "1.4.6"],
      defaultVersion: "1.4.7"
    },
    square: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.squareup.sdk:in-app-payments-sdk:${version}'",
      label: "Square In-App Payments",
      versions: ["1.5.4", "1.5.3"],
      defaultVersion: "1.5.4"
    },

    // Push Notifications
    onesignal: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.onesignal:OneSignal:${version}'",
      label: "OneSignal",
      versions: ["5.1.13", "5.1.10"],
      defaultVersion: "5.1.13"
    },
    pusher_beams: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.pusher:push-notifications-android:${version}'",
      label: "Pusher Beams",
      versions: ["1.9.1", "1.9.0"],
      defaultVersion: "1.9.1"
    },

    // Database Alternatives
    realm: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.realm.kotlin:library-base:${version}'",
      label: "Realm Kotlin",
      versions: ["1.16.0", "1.15.0"],
      defaultVersion: "1.16.0"
    },
    objectbox: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.objectbox:objectbox-android:${version}'",
      label: "ObjectBox",
      versions: ["3.8.0", "3.7.1"],
      defaultVersion: "3.8.0"
    },
    sqldelight_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'app.cash.sqldelight:android-driver:${version}'",
      label: "SQLDelight Android",
      versions: ["2.0.1", "2.0.0"],
      defaultVersion: "2.0.1"
    },

    // Reactive
    rxkotlin: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.reactivex.rxjava3:rxkotlin:${version}'",
      label: "RxKotlin",
      versions: ["3.0.1", "3.0.0"],
      defaultVersion: "3.0.1"
    },

    // Crash Reporting
    sentry_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'io.sentry:sentry-android:${version}'",
      label: "Sentry",
      versions: ["7.6.0", "7.5.0"],
      defaultVersion: "7.6.0"
    },
    bugsnag: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.bugsnag:bugsnag-android:${version}'",
      label: "Bugsnag",
      versions: ["5.33.0", "5.32.0"],
      defaultVersion: "5.33.0"
    },

    // UI
    preference: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.preference:preference-ktx:${version}'",
      label: "Preferences",
      versions: ["1.2.1", "1.2.0"],
      defaultVersion: "1.2.1"
    },
    shortcuts: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.core:core-google-shortcuts:${version}'",
      label: "App Shortcuts",
      versions: ["1.1.0", "1.0.1"],
      defaultVersion: "1.1.0"
    },
    vectordrawable: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.vectordrawable:vectordrawable:${version}'",
      label: "Vector Drawable",
      versions: ["1.2.0", "1.1.0"],
      defaultVersion: "1.2.0"
    },
    animated_vector_drawable: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.vectordrawable:vectordrawable-animated:${version}'",
      label: "Animated Vector",
      versions: ["1.2.0", "1.1.0"],
      defaultVersion: "1.2.0"
    },

    // Performance
    benchmark_junit4: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "androidTestImplementation 'androidx.benchmark:benchmark-junit4:${version}'",
      label: "Benchmark JUnit4",
      versions: ["1.2.3", "1.2.2"],
      defaultVersion: "1.2.3"
    },
    tracing: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'androidx.tracing:tracing-ktx:${version}'",
      label: "Tracing KTX",
      versions: ["1.2.0", "1.1.0"],
      defaultVersion: "1.2.0"
    },

    // Video
    youtube_player: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.pierfrancescosoffritti.androidyoutubeplayer:core:${version}'",
      label: "YouTube Player",
      versions: ["12.1.0", "12.0.0"],
      defaultVersion: "12.1.0"
    },
    ffmpeg_android: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.arthenica:mobile-ffmpeg-full:${version}'",
      label: "FFmpeg Android",
      versions: ["4.4.LTS"],
      defaultVersion: "4.4.LTS"
    },

    // Music
    spotify_auth: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.spotify.android:auth:${version}'",
      label: "Spotify Auth",
      versions: ["2.1.1", "2.1.0"],
      defaultVersion: "2.1.1"
    },
    spotify_player: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.spotify.android:app-remote:${version}'",
      label: "Spotify App Remote",
      versions: ["0.8.0"],
      defaultVersion: "0.8.0"
    },

    // Gaming
    play_games: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-games:${version}'",
      label: "Play Games Services",
      versions: ["23.2.0", "23.1.0"],
      defaultVersion: "23.2.0"
    },
    unity_ads: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.unity3d.ads:unity-ads:${version}'",
      label: "Unity Ads",
      versions: ["4.10.0", "4.9.3"],
      defaultVersion: "4.10.0"
    },

    // Security
    safetynet: {
      type: "dependency",
      file: PATHS.BUILD_GRADLE_APP,
      content: "implementation 'com.google.android.gms:play-services-safetynet:${version}'",
      label: "SafetyNet (Deprecated)",
      versions: ["18.0.1"],
      defaultVersion: "18.0.1"
    }
  
  }
};