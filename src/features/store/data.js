import { PATHS } from './paths.js';
import { CODE_SNIPPETS } from './snippets.js';


export const DATA = {
    // ==================
    // NETWORKING
    // ==================
    "internet_basic": {
        id: "internet_basic",
        title: "Internet Connectivity",
        category: "Networking",
        description: "Adds basic internet permissions and network state monitoring.",
        requirements: [
            "permissions.internet", 
            "permissions.network_state"
        ]
    },
    "retrofit_setup": {
        id: "retrofit_setup",
        title: "Retrofit Client",
        category: "Networking",
        description: "Complete setup for Retrofit with Gson converter and OkHttp logging.",
        requirements: [
            "permissions.internet",
            "dependencies.retrofit",
            "dependencies.retrofit_gson",
            "dependencies.okhttp",
            "dependencies.logging_interceptor"
        ] ,
    },
    "retrofit_moshi": {
        id: "retrofit_moshi",
        title: "Retrofit + Moshi",
        category: "Networking",
        description: "Retrofit with Moshi JSON converter (faster than Gson).",
        requirements: [
            "permissions.internet",
            "dependencies.retrofit",
            "dependencies.retrofit_moshi",
            "dependencies.moshi",
            "dependencies.okhttp",
            "dependencies.logging_interceptor"
        ]
    },
    "okhttp_client": {
        id: "okhttp_client",
        title: "OkHttp Client",
        category: "Networking",
        description: "Efficient HTTP client with logging interceptor support.",
        requirements: [
            "permissions.internet",
            "dependencies.okhttp",
            "dependencies.logging_interceptor"
        ]
    },
    "volley_setup": {
        id: "volley_setup",
        title: "Volley",
        category: "Networking",
        description: "Google's networking library for faster requests.",
        requirements: ["permissions.internet", "dependencies.volley"]
    },

    // ==================
    //️ IMAGE LOADING
    // ==================
    "glide_setup": {
        id: "glide_setup",
        title: "Glide Image Loader",
        category: "Images",
        description: "Fast and efficient image loading library by Google.",
        requirements: [
            "permissions.internet", 
            "dependencies.glide"
        ],
    },
    "coil_setup": {
        id: "coil_setup",
        title: "Coil (Kotlin First)",
        category: "Images",
        description: "Modern image loading library backed by Kotlin Coroutines.",
        requirements: [
            "permissions.internet", 
            "dependencies.coil"
        ]
    },
    "coil_compose": {
        id: "coil_compose",
        title: "Coil for Compose",
        category: "Images",
        description: "Image loading for Jetpack Compose.",
        requirements: [
            "permissions.internet",
            "dependencies.coil_compose"
        ]
    },
    "picasso_setup": {
        id: "picasso_setup",
        title: "Picasso",
        category: "Images",
        description: "A powerful image downloading and caching library for Android.",
        requirements: [
            "permissions.internet", 
            "dependencies.picasso"
        ]
    },

    // ==================
    //️ GOOGLE SERVICES
    // ==================
    "google_maps": {
        id: "google_maps",
        title: "Google Maps SDK",
        category: "Google",
        description: "Integrate Google Maps with API Key placeholder.",
        requirements: [
            "permissions.internet",
            "permissions.location_fine",
            "permissions.location_coarse",
            "dependencies.maps_sdk"
        ],
        custom_components: [
            {
                type: "meta-data",
                file: PATHS.MANIFEST,
                parent: "application",
                content: '<meta-data android:name="com.google.android.geo.API_KEY" android:value="@string/google_maps_key" />',
                uniqueKey: "com.google.android.geo.API_KEY",
                label: "Maps API Key Meta-data"
            },
            {
                type: "string",
                file: PATHS.STRINGS,
                key: "google_maps_key",
                content: '<string name="google_maps_key">YOUR_API_KEY_HERE</string>',
                label: "Maps API Key String"
            }
        ] ,
    },
    "google_maps_compose": {
        id: "google_maps_compose",
        title: "Google Maps for Compose",
        category: "Google",
        description: "Maps SDK optimized for Jetpack Compose.",
        requirements: [
            "permissions.internet",
            "permissions.location_fine",
            "permissions.location_coarse",
            "dependencies.maps_compose"
        ]
    },
    "location_services": {
        id: "location_services",
        title: "Location Services",
        category: "Google",
        description: "Access precise user location using Play Services.",
        requirements: [
            "permissions.location_fine",
            "permissions.location_coarse",
            "dependencies.location_services"
        ]
    },
    "admob_ads": {
        id: "admob_ads",
        title: "Google AdMob",
        category: "Monetization",
        description: "Monetize your app with Banner, Interstitial, and Rewarded ads.",
        requirements: [
            "permissions.internet",
            "dependencies.admob"
        ],
        custom_components: [
            {
                type: "meta-data",
                file: PATHS.MANIFEST,
                parent: "application",
                content: '<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-3940256099942544~3347511713"/>',
                uniqueKey: "com.google.android.gms.ads.APPLICATION_ID",
                label: "AdMob App ID (Test)"
            }
        ]
    },
    "google_signin": {
        id: "google_signin",
        title: "Google Sign-In",
        category: "Authentication",
        description: "Easy Google account authentication.",
        requirements: [
            "permissions.internet",
            "dependencies.auth_google"
        ]
    },

    // ==================
    // FIREBASE
    // ==================
    "firebase_analytics": {
        id: "firebase_analytics",
        title: "Firebase Analytics",
        category: "Firebase",
        description: "Basic Firebase setup with Analytics capabilities.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_analytics"
        ]
    },
    "firebase_messaging": {
        id: "firebase_messaging",
        title: "FCM (Push Notifications)",
        category: "Firebase",
        description: "Send push notifications to your users.",
        requirements: [
            "permissions.internet",
            "permissions.post_notifications",
            "dependencies.firebase_bom",
            "dependencies.firebase_messaging"
        ]
    },
    "firebase_firestore": {
        id: "firebase_firestore",
        title: "Cloud Firestore",
        category: "Firebase",
        description: "Scalable NoSQL cloud database.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_firestore"
        ]
    },
    "firebase_auth": {
        id: "firebase_auth",
        title: "Firebase Authentication",
        category: "Firebase",
        description: "Sign-in management (Email, Google, Phone, etc.).",
        requirements: [
            "dependencies.firebase_bom",
            "dependencies.firebase_auth",
            "permissions.internet"
        ]
    },
    "realtime_db": {
        id: "realtime_db",
        title: "Realtime Database",
        category: "Firebase",
        description: "Store and sync data with NoSQL database in realtime.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_database"
        ]
    },
    "firebase_storage": {
        id: "firebase_storage",
        title: "Cloud Storage",
        category: "Firebase",
        description: "Store images, videos, and files in the cloud.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_storage"
        ]
    },
    "firebase_crashlytics": {
        id: "firebase_crashlytics",
        title: "Crashlytics",
        category: "Firebase",
        description: "Real-time crash reporting and analytics.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_crashlytics"
        ]
    },
    "firebase_remote_config": {
        id: "firebase_remote_config",
        title: "Remote Config",
        category: "Firebase",
        description: "Change app behavior without publishing updates.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_config"
        ]
    },
    "firebase_dynamic_links": {
        id: "firebase_dynamic_links",
        title: "Dynamic Links",
        category: "Firebase",
        description: "Deep linking across platforms.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_dynamic_links"
        ]
    },
    "firebase_performance": {
        id: "firebase_performance",
        title: "Performance Monitoring",
        category: "Firebase",
        description: "Monitor app performance metrics.",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_performance"
        ]
    },

    // ==================
    // UI & DESIGN
    // ==================
    "material_design": {
        id: "material_design",
        title: "Material Design 3",
        category: "UI",
        description: "Google's latest design system components.",
        requirements: ["dependencies.material"]
    },
    "lottie_anim": {
        id: "lottie_anim",
        title: "Lottie Animations",
        category: "UI",
        description: "Render After Effects animations natively on Android.",
        requirements: ["dependencies.lottie"]
    },
    "lottie_compose_anim": {
        id: "lottie_compose_anim",
        title: "Lottie for Compose",
        category: "UI",
        description: "Lottie animations in Jetpack Compose.",
        requirements: ["dependencies.lottie_compose"]
    },
    "swipe_refresh": {
        id: "swipe_refresh",
        title: "Swipe Refresh Layout",
        category: "UI",
        description: "Standard pull-to-refresh gesture for lists.",
        requirements: ["dependencies.swiperefresh"]
    },
    "circular_image": {
        id: "circular_image",
        title: "Circular ImageView",
        category: "UI",
        description: "Easy circular images for profiles and avatars.",
        requirements: ["dependencies.circleimageview"]
    },
    "viewpager2": {
        id: "viewpager2",
        title: "ViewPager2",
        category: "UI",
        description: "Modern swipeable views with improved performance.",
        requirements: ["dependencies.viewpager2"]
    },
    "recyclerview": {
        id: "recyclerview",
        title: "RecyclerView",
        category: "UI",
        description: "Efficient list and grid display.",
        requirements: ["dependencies.recyclerview"],
    },
    "cardview": {
        id: "cardview",
        title: "CardView",
        category: "UI",
        description: "Material Design card component.",
        requirements: ["dependencies.cardview"]
    },
    "splash_screen_api": {
        id: "splash_screen_api",
        title: "Splash Screen API",
        category: "UI",
        description: "Modern splash screen implementation (Android 12+).",
        requirements: ["dependencies.splash_screen"]
    },

    // ==================
    //️ ARCHITECTURE
    // ==================
    "jetpack_compose": {
        id: "jetpack_compose",
        title: "Jetpack Compose Full",
        category: "Compose",
        description: "Complete Jetpack Compose UI toolkit setup.",
        requirements: [
            "dependencies.compose_bom",
            "dependencies.compose_ui",
            "dependencies.compose_material3",
            "dependencies.compose_preview",
            "dependencies.compose_activity"
        ]
    },
    "compose_navigation": {
        id: "compose_navigation",
        title: "Compose Navigation",
        category: "Compose",
        description: "Navigation component for Jetpack Compose.",
        requirements: [
            "dependencies.compose_navigation"
        ]
    },
    "compose_viewmodel": {
        id: "compose_viewmodel",
        title: "Compose ViewModel",
        category: "Compose",
        description: "ViewModel integration for Compose.",
        requirements: [
            "dependencies.compose_viewmodel"
        ]
    },
    "navigation_component": {
        id: "navigation_component",
        title: "Jetpack Navigation",
        category: "Architecture",
        description: "Modern single-activity navigation framework.",
        requirements: ["dependencies.nav_fragment", "dependencies.nav_ui"]
    },
    "mvvm_lifecycle": {
        id: "mvvm_lifecycle",
        title: "MVVM Lifecycle",
        category: "Architecture",
        description: "ViewModel, LiveData, and Lifecycle Runtime.",
        requirements: [
            "dependencies.lifecycle_viewmodel",
            "dependencies.lifecycle_livedata",
            "dependencies.lifecycle_runtime"
        ]
    },
    "work_manager": {
        id: "work_manager",
        title: "WorkManager",
        category: "Architecture",
        description: "Schedule deferrable, asynchronous tasks reliably.",
        requirements: ["dependencies.work_manager"]
    },
    "data_store": {
        id: "data_store",
        title: "Jetpack DataStore",
        category: "Architecture",
        description: "Modern replacement for SharedPreferences.",
        requirements: ["dependencies.datastore_pref"]
    },
    "room_db": {
        id: "room_db",
        title: "Room Database",
        category: "Architecture",
        description: "Local SQLite database abstraction layer.",
        requirements: [
            "dependencies.room_runtime",
            "dependencies.room_ktx"
        ]
    },
    "coroutines": {
        id: "coroutines",
        title: "Kotlin Coroutines",
        category: "Architecture",
        description: "Asynchronous programming support for Kotlin.",
        requirements: [
            "dependencies.coroutines_android",
            "dependencies.coroutines_core"
        ]
    },
    "hilt_di": {
        id: "hilt_di",
        title: "Hilt Dependency Injection",
        category: "Architecture",
        description: "Google's recommended DI framework for Android.",
        requirements: ["dependencies.hilt_android"]
    },
    "koin_di": {
        id: "koin_di",
        title: "Koin Dependency Injection",
        category: "Architecture",
        description: "Lightweight DI framework for Kotlin.",
        requirements: ["dependencies.koin_android"]
    },
    "paging3": {
        id: "paging3",
        title: "Paging 3",
        category: "Architecture",
        description: "Load data gradually and gracefully.",
        requirements: ["dependencies.paging_runtime"]
    },
    "paging_compose": {
        id: "paging_compose",
        title: "Paging for Compose",
        category: "Architecture",
        description: "Paging 3 library for Jetpack Compose.",
        requirements: ["dependencies.paging_compose"]
    },

    // ==================
    // HARDWARE & SENSORS
    // ==================
    "camera_features": {
        id: "camera_features",
        title: "Camera Access",
        category: "Hardware",
        description: "Permissions required to access device camera.",
        requirements: [
            "permissions.camera",
            "permissions.storage_write",
            "permissions.storage_read"
        ],
        custom_components: [
            {
                type: "uses-feature",
                file: PATHS.MANIFEST,
                content: '<uses-feature android:name="android.hardware.camera" android:required="true" />',
                uniqueKey: "android.hardware.camera",
                label: "Camera Feature Requirement"
            }
        ]
    },
    "camerax_full": {
        id: "camerax_full",
        title: "CameraX Full Suite",
        category: "Camera",
        description: "Modern camera development built on Camera2 API.",
        requirements: [
            "permissions.camera",
            "permissions.storage_write",
            "dependencies.camerax_core",
            "dependencies.camerax_camera2",
            "dependencies.camerax_lifecycle",
            "dependencies.camerax_view"
        ]
    },
    "audio_recording": {
        id: "audio_recording",
        title: "Audio Recording",
        category: "Hardware",
        description: "Permissions for microphone access and recording.",
        requirements: [
            "permissions.record_audio",
            "permissions.storage_write",
            "permissions.storage_read"
        ]
    },
    "bluetooth_basic": {
        id: "bluetooth_basic",
        title: "Bluetooth Basic",
        category: "Hardware",
        description: "Permissions for basic Bluetooth communication.",
        requirements: [
            "permissions.bluetooth",
            "permissions.bluetooth_admin"
        ]
    },
    "bluetooth_modern": {
        id: "bluetooth_modern",
        title: "Bluetooth Modern (Android 12+)",
        category: "Hardware",
        description: "Modern Bluetooth permissions for Android 12 and above.",
        requirements: [
            "permissions.bluetooth",
            "permissions.bluetooth_admin",
            "permissions.bluetooth_scan",
            "permissions.bluetooth_connect",
            "permissions.bluetooth_advertise"
        ]
    },
    "media_access_modern": {
        id: "media_access_modern",
        title: "Media Access (Android 13+)",
        category: "Hardware",
        description: "Granular media permissions for Android 13+.",
        requirements: [
            "permissions.media_images",
            "permissions.media_video",
            "permissions.media_audio"
        ]
    },
    "vibration_control": {
        id: "vibration_control",
        title: "Vibration Control",
        category: "Hardware",
        description: "Permission to control device vibration.",
        requirements: ["permissions.vibrate"]
    },
    "nfc_support": {
        id: "nfc_support",
        title: "NFC Support",
        category: "Hardware",
        description: "Near Field Communication for contactless data transfer.",
        requirements: ["permissions.nfc"]
    },
    "flashlight_control": {
        id: "flashlight_control",
        title: "Flashlight Control",
        category: "Hardware",
        description: "Turn the device flashlight on/off using CameraManager.",
        requirements: [
            "permissions.camera",
            "permissions.flashlight"
        ]
    },
    "biometric_hardware": {
        id: "biometric_hardware",
        title: "Biometric Sensors",
        category: "Hardware",
        description: "Access Fingerprint or Face Unlock hardware.",
        requirements: [
            "permissions.biometric",
            "dependencies.biometric"
        ]
    },
    "gps_hardware": {
        id: "gps_hardware",
        title: "GPS & Fine Location",
        category: "Hardware",
        description: "Access precise GPS hardware for location tracking.",
        requirements: [
            "permissions.location_fine",
            "permissions.location_coarse"
        ],
        custom_components: [
            {
                type: "uses-feature",
                file: PATHS.MANIFEST,
                content: '<uses-feature android:name="android.hardware.location.gps" android:required="true" />',
                uniqueKey: "android.hardware.location.gps",
                label: "Require GPS Hardware"
            }
        ]
    },
    "background_location": {
        id: "background_location",
        title: "Background Location",
        category: "Hardware",
        description: "Track GPS location even when app is closed (Android 10+).",
        requirements: [
            "permissions.location_fine",
            "permissions.location_background"
        ]
    },

    // ==================
    // 🏃 SENSORS & MOTION
    // ==================
    "activity_recognition": {
        id: "activity_recognition",
        title: "Step Counter & Motion",
        category: "Hardware",
        description: "Detect steps (Pedometer), walking, running, or driving.",
        requirements: [
            "permissions.activity_recognition"
        ]
    },
    "body_sensors": {
        id: "body_sensors",
        title: "Body Sensors (Health)",
        category: "Hardware",
        description: "Access Heart Rate monitor and other body sensors.",
        requirements: [
            "permissions.body_sensors"
        ]
    },
    "high_sampling_sensors": {
        id: "high_sampling_sensors",
        title: "High Refresh Rate Sensors",
        category: "Hardware",
        description: "Access sensors at >200Hz (Game/VR) on Android 12+.",
        requirements: [
            "permissions.high_sampling_rate"
        ]
    },

    // ==================
    // POWER & SYSTEM
    // ==================
    "wake_lock": {
        id: "wake_lock",
        title: "Wake Lock (Keep Screen On)",
        category: "Hardware",
        description: "Prevent processor from sleeping or screen from dimming.",
        requirements: [
            "permissions.wake_lock"
        ]
    },
    "boot_complete": {
        id: "boot_complete",
        title: "Run on Startup",
        category: "System",
        description: "Start services when device finishes booting.",
        requirements: [
            "permissions.receive_boot_completed"
        ]
    },

    // ==================
    // PERIPHERALS
    // ==================
    "usb_host": {
        id: "usb_host",
        title: "USB Host Mode",
        category: "Hardware",
        description: "Communicate with USB devices (Arduino, Serial, etc).",
        custom_components: [
            {
                type: "uses-feature",
                file: PATHS.MANIFEST,
                content: '<uses-feature android:name="android.hardware.usb.host" />',
                uniqueKey: "android.hardware.usb.host",
                label: "USB Host Feature"
            }
        ]
    },
    
    // ==================
    // NEARBY & CONNECTIVITY
    // ==================
    "nearby_devices": {
        id: "nearby_devices",
        title: "Nearby Devices",
        category: "Connectivity",
        description: "Permissions for Bluetooth & Wi-Fi discovery (Android 12+).",
        requirements: [
            "permissions.bluetooth_connect",
            "permissions.bluetooth_scan",
            "permissions.bluetooth_advertise",
            "permissions.nearby_wifi"
        ]
    },
    "wifi_management": {
        id: "wifi_management",
        title: "WiFi Management",
        category: "Connectivity",
        description: "Access and manage WiFi networks.",
        requirements: [
            "permissions.access_wifi_state",
            "permissions.change_wifi_state",
            "permissions.location_fine"
        ]
    },
    "hotspot_control": {
        id: "hotspot_control",
        title: "WiFi Hotspot",
        category: "Connectivity",
        description: "Create and manage WiFi hotspot.",
        requirements: [
            "permissions.change_wifi_state",
            "permissions.write_settings"
        ]
    },
    "network_monitoring": {
        id: "network_monitoring",
        title: "Network Monitoring",
        category: "Connectivity",
        description: "Monitor network usage and data consumption.",
        requirements: [
            "permissions.package_usage_stats"
        ]
    },

    // ==================
    // MEDIA & RECORDING xxxx
    // ==================
    "exoplayer_video": {
        id: "exoplayer_video",
        title: "ExoPlayer (Video)",
        category: "Media",
        description: "Advanced video player for Android.",
        requirements: [
            "permissions.internet",
            "dependencies.exoplayer",
            "dependencies.exoplayer_ui"
        ]
    },
    "exoplayer_full": {
        id: "exoplayer_full",
        title: "ExoPlayer Full (DASH/HLS)",
        category: "Media",
        description: "Complete ExoPlayer with streaming support.",
        requirements: [
            "permissions.internet",
            "dependencies.exoplayer",
            "dependencies.exoplayer_ui",
            "dependencies.exoplayer_dash",
            "dependencies.exoplayer_hls"
        ]
    },
    "screen_recording": {
        id: "screen_recording",
        title: "Screen Recording",
        category: "Media",
        description: "Record device screen using MediaProjection API.",
        requirements: [
            "permissions.foreground_service",
            "dependencies.media3_common"
        ]
    },

    // ==================
    // SECURITY & AUTH
    // ==================
    "biometric_auth": {
        id: "biometric_auth",
        title: "Biometric Login",
        category: "Security",
        description: "Fingerprint/Face unlock support.",
        requirements: [
            "permissions.biometric",
            "dependencies.biometric"
        ]
    },
    "encrypted_storage": {
        id: "encrypted_storage",
        title: "Encrypted Storage",
        category: "Security",
        description: "Securely encrypt SharedPreferences and files.",
        requirements: ["dependencies.security_crypto"]
    },
    "facebook_login": {
        id: "facebook_login",
        title: "Facebook Login",
        category: "Authentication",
        description: "Facebook SDK for user authentication.",
        requirements: [
            "permissions.internet",
            "dependencies.facebook_login"
        ]
    },

    // ==================
    // CHARTS & GRAPHS
    // ==================
    "mp_android_chart": {
        id: "mp_android_chart",
        title: "MPAndroidChart",
        category: "Charts",
        description: "Powerful chart/graph library.",
        requirements: ["dependencies.mpandroidchart"]
    },

    // ==================
    // ANIMATIONS & UI EFFECTS
    // ==================
    "shimmer_effect": {
        id: "shimmer_effect",
        title: "Facebook Shimmer",
        category: "UI Effects",
        description: "Loading effect for views.",
        requirements: ["dependencies.shimmer"]
    },

    // ==================
    // QR & BARCODE
    // ==================
    "qr_code_scanner": {
        id: "qr_code_scanner",
        title: "QR Code Scanner",
        category: "QR/Barcode",
        description: "ZXing library for QR and barcode scanning.",
        requirements: [
            "permissions.camera",
            "dependencies.zxing_android"
        ]
    },
    "mlkit_barcode_scanner": {
        id: "mlkit_barcode_scanner",
        title: "ML Kit Barcode Scanner",
        category: "QR/Barcode",
        description: "Google ML Kit for advanced barcode scanning.",
        requirements: [
            "permissions.camera",
            "dependencies.mlkit_barcode"
        ]
    },

    // ==================
    // PDF & DOCUMENTS
    // ==================
    "pdf_generation": {
        id: "pdf_generation",
        title: "PDF Generation",
        category: "Documents",
        description: "Create PDF documents from scratch.",
        requirements: [
            "permissions.storage_write",
            "dependencies.pdfbox"
        ]
    },
    "pdf_itext": {
        id: "pdf_itext",
        title: "iText PDF",
        category: "Documents",
        description: "Advanced PDF creation and manipulation.",
        requirements: [
            "permissions.storage_write",
            "dependencies.itext_pdf"
        ]
    },

    // ==================
    // WEBVIEW
    // ==================
    "webview_advanced": {
        id: "webview_advanced",
        title: "Advanced WebView",
        category: "WebView",
        description: "Enhanced WebView with WebKit support.",
        requirements: [
            "permissions.internet",
            "dependencies.webkit"
        ]
    },

    // ==================
    // PAYMENTS & BILLING
    // ==================
    "in_app_billing": {
        id: "in_app_billing",
        title: "In-App Billing",
        category: "Monetization",
        description: "Google Play Billing for in-app purchases.",
        requirements: [
            "permissions.internet",
            "dependencies.billing"
        ]
    },
    "stripe_payment": {
        id: "stripe_payment",
        title: "Stripe Payment",
        category: "Payments",
        description: "Stripe payment gateway integration.",
        requirements: [
            "permissions.internet",
            "dependencies.stripe_android"
        ]
    },
    "razorpay_payment": {
        id: "razorpay_payment",
        title: "Razorpay Payment",
        category: "Payments",
        description: "Razorpay payment gateway (India).",
        requirements: [
            "permissions.internet",
            "dependencies.razorpay"
        ]
    },

    // ==================
    // TESTING
    // ==================
    "unit_testing": {
        id: "unit_testing",
        title: "Unit Testing (JUnit + Mockito)",
        category: "Testing",
        description: "Complete unit testing setup.",
        requirements: [
            "dependencies.junit",
            "dependencies.mockito",
            "dependencies.coroutines_test"
        ]
    },
    "ui_testing": {
        id: "ui_testing",
        title: "UI Testing (Espresso)",
        category: "Testing",
        description: "Android UI testing framework.",
        requirements: ["dependencies.espresso"]
    },

    // ==================
    // UTILITIES
    // ==================
    "timber_logging": {
        id: "timber_logging",
        title: "Timber Logging",
        category: "Utilities",
        description: "Better logging library for Android.",
        requirements: ["dependencies.timber"]
    },
    "leak_detection": {
        id: "leak_detection",
        title: "LeakCanary",
        category: "Utilities",
        description: "Memory leak detection for Android.",
        requirements: ["dependencies.leakcanary"]
    },
    "event_bus": {
        id: "event_bus",
        title: "EventBus",
        category: "Utilities",
        description: "Event bus for component communication.",
        requirements: ["dependencies.eventbus"]
    },

    // ==================
    // PHONE & CONTACTS
    // ==================
    "call_logs": {
        id: "call_logs",
        title: "Call Logs",
        category: "Phone",
        description: "Read and write the device call log history.",
        requirements: [
            "permissions.read_call_log",
            "permissions.write_call_log"
        ]
    },
    "phone_calling": {
        id: "phone_calling",
        title: "Phone Calling",
        category: "Phone",
        description: "Make phone calls from your app.",
        requirements: [
            "permissions.call_phone",
            "permissions.read_phone_state"
        ]
    },
    "sms_features": {
        id: "sms_features",
        title: "SMS Features",
        category: "Phone",
        description: "Send and receive SMS messages.",
        requirements: [
            "permissions.send_sms",
            "permissions.receive_sms",
            "permissions.read_sms"
        ]
    },
    "contacts_access": {
        id: "contacts_access",
        title: "Contacts Access",
        category: "Phone",
        description: "Read and write device contacts.",
        requirements: [
            "permissions.contacts_read",
            "permissions.contacts_write"
        ]
    },

    // ==================
    // CALENDAR
    // ==================
    "calendar_integration": {
        id: "calendar_integration",
        title: "Calendar Integration",
        category: "Calendar",
        description: "Access and modify device calendar.",
        requirements: [
            "permissions.read_calendar",
            "permissions.write_calendar"
        ]
    },

    // ==================
    // NOTIFICATIONS
    // ==================
    "notification_basic": {
        id: "notification_basic",
        title: "Notifications (Android 13+)",
        category: "Notifications",
        description: "Post notifications with modern permission.",
        requirements: ["permissions.post_notifications"]
    },
    "alarm_scheduler": {
        id: "alarm_scheduler",
        title: "Exact Alarm Scheduler",
        category: "Notifications",
        description: "Schedule exact alarms and reminders.",
        requirements: ["permissions.schedule_exact_alarm"]
    },

    // ==================
    //️ BACKGROUND SERVICES
    // ==================
    "foreground_service": {
        id: "foreground_service",
        title: "Foreground Service",
        category: "Background",
        description: "Run tasks in foreground with notification.",
        requirements: [
            "permissions.foreground_service",
            "permissions.wake_lock"
        ]
    },
    "boot_receiver": {
        id: "boot_receiver",
        title: "Boot Receiver",
        category: "Background",
        description: "Start service on device boot.",
        requirements: ["permissions.boot_completed"]
    },
    // ==================
    // HEALTH & SENSORS (New Category)
    // ==================
    "physical_activity": {
        id: "physical_activity",
        title: "Physical Activity",
        category: "Sensors",
        description: "Detect walking, running, or step count (Activity Recognition).",
        requirements: ["permissions.activity_recognition"]
    },
    "body_sensors": {
        id: "body_sensors",
        title: "Body Sensors",
        category: "Sensors",
        description: "Access heart rate and other body sensors.",
        requirements: [
            "permissions.body_sensors"
        ]
    },
    
    // ==================
    // GRANULAR MEDIA
    // ==================
    "photos_videos_only": {
        id: "photos_videos_only",
        title: "Photos and Videos",
        category: "Hardware",
        description: "Access specifically to Photos and Videos (Android 13+).",
        requirements: [
            "permissions.media_images",
            "permissions.media_video",
            "permissions.storage_read" // Fallback for older Android
        ]
    },
    "music_audio_only": {
        id: "music_audio_only",
        title: "Music and Audio",
        category: "Hardware",
        description: "Access specifically to Music and Audio files (Android 13+).",
        requirements: [
            "permissions.media_audio",
            "permissions.storage_read" // Fallback for older Android
        ]
    } ,
    // ==================
    // GOOGLE PLAY & UTILS
    // ==================
    "in_app_browser": {
        id: "in_app_browser",
        title: "Chrome Custom Tabs",
        category: "Utilities",
        description: "Open web pages internally but with Chrome's power (better than WebView).",
        requirements: ["dependencies.browser"]
    },
    "play_features": {
        id: "play_features",
        title: "Google Play Core",
        category: "Google",
        description: "Add In-App Updates and In-App Review dialogs.",
        requirements: [
            "dependencies.play_review",
            "dependencies.play_update"
        ]
    },
    "apk_installer": {
        id: "apk_installer",
        title: "Install APKs",
        category: "System",
        description: "Permission to install other applications (APK) from your app.",
        requirements: [
            "permissions.request_install_packages"
        ]
    },

    // ==================
    // ADVANCED NOTIFICATIONS
    // ==================
    "overlay_widget": {
        id: "overlay_widget",
        title: "Draw Over Apps",
        category: "System",
        description: "Floating widgets or chat heads logic (System Alert Window).",
        requirements: [
            "permissions.system_alert_window"
        ]
    },
    "high_priority_alert": {
        id: "high_priority_alert",
        title: "Full Screen Alerts",
        category: "Notifications",
        description: "Show full-screen activity for incoming calls or alarms even when locked.",
        requirements: [
            "permissions.use_full_screen_intent"
        ]
    },

    // ==================
    // ⚙ANDROID 14 READY
    // ==================
    "fg_service_types": {
        id: "fg_service_types",
        title: "FG Service Types (A14)",
        category: "Background",
        description: "Required permissions for Location/Media Foreground Services on Android 14+.",
        requirements: [
            "permissions.foreground_service",
            "permissions.foreground_service_location",
            "permissions.foreground_service_media"
        ]
    } ,
    
    
    // ==================
    // GAMING & GRAPHICS
    // ==================
    "opengl_es": {
        id: "opengl_es",
        title: "OpenGL ES Graphics",
        category: "Graphics",
        description: "3D graphics rendering with OpenGL ES 2.0/3.0.",
        requirements: [],
        custom_components: [
            {
                type: "uses-feature",
                file: PATHS.MANIFEST,
                content: '<uses-feature android:glEsVersion="0x00020000" android:required="true" />',
                uniqueKey: "opengl_es_2",
                label: "OpenGL ES 2.0"
            }
        ]
    },
    "vulkan_graphics": {
        id: "vulkan_graphics",
        title: "Vulkan Graphics",
        category: "Graphics",
        description: "High-performance 3D graphics with Vulkan API.",
        requirements: [],
        custom_components: [
            {
                type: "uses-feature",
                file: PATHS.MANIFEST,
                content: '<uses-feature android:name="android.hardware.vulkan.level" android:version="1" android:required="true" />',
                uniqueKey: "vulkan_level",
                label: "Vulkan Level 1"
            }
        ]
    },

    // ==================
    // ADVANCED STORAGE
    // ==================
    "scoped_storage": {
        id: "scoped_storage",
        title: "Scoped Storage (Android 11+)",
        category: "Storage",
        description: "Modern scoped storage with MediaStore API.",
        requirements: [
            "permissions.storage_read",
            "permissions.storage_write"
        ],
        custom_components: [
            {
                type: "application-attribute",
                file: PATHS.MANIFEST,
                content: 'android:requestLegacyExternalStorage="true"',
                uniqueKey: "legacy_storage",
                label: "Legacy Storage (for Android 10)"
            }
        ]
    },
    "manage_external_storage": {
        id: "manage_external_storage",
        title: "All Files Access",
        category: "Storage",
        description: "Full file system access (file managers only).",
        requirements: [
            "permissions.manage_external_storage"
        ]
    },
    "download_manager": {
        id: "download_manager",
        title: "Download Manager",
        category: "Storage",
        description: "System download manager for files.",
        requirements: [
            "permissions.internet",
            "permissions.storage_write"
        ]
    },
    "storage_access": {
    id: "storage_access",
    title: "Storage Access",
    category: "Hardware",
    description: "Read and Write External Storage permissions.",
    requirements: [
        "permissions.storage_read",
        "permissions.storage_write"
      ]
    },
    // ==================
    // ML KIT & AI
    // ==================
    "mlkit_text_recognition": {
        id: "mlkit_text_recognition",
        title: "Text Recognition (OCR)",
        category: "ML Kit",
        description: "Extract text from images using ML Kit.",
        requirements: [
            "permissions.camera",
            "dependencies.mlkit_text_recognition"
        ]
    },
    "mlkit_face_detection": {
        id: "mlkit_face_detection",
        title: "Face Detection",
        category: "ML Kit",
        description: "Detect faces in images and video.",
        requirements: [
            "permissions.camera",
            "dependencies.mlkit_face_detection"
        ]
    },
    "mlkit_image_labeling": {
        id: "mlkit_image_labeling",
        title: "Image Labeling",
        category: "ML Kit",
        description: "Identify objects in images.",
        requirements: [
            "dependencies.mlkit_image_labeling"
        ]
    },
    "tensorflow_lite": {
        id: "tensorflow_lite",
        title: "TensorFlow Lite",
        category: "ML Kit",
        description: "Run ML models on-device with TensorFlow Lite.",
        requirements: [
            "dependencies.tensorflow_lite",
            "dependencies.tensorflow_lite_support"
        ]
    },

    // ==================
    // AUDIO FEATURES
    // ==================
    "audio_focus": {
        id: "audio_focus",
        title: "Audio Focus Management",
        category: "Audio",
        description: "Manage audio playback with proper focus handling.",
        requirements: [
            "dependencies.media_compat"
        ]
    },
    "media_session": {
        id: "media_session",
        title: "Media Session",
        category: "Audio",
        description: "Media controls and notification integration.",
        requirements: [
            "dependencies.media_compat",
            "permissions.foreground_service"
        ]
    },
    "audio_effects": {
        id: "audio_effects",
        title: "Audio Effects",
        category: "Audio",
        description: "Apply audio effects like equalizer, bass boost.",
        requirements: [
            "permissions.modify_audio_settings"
        ]
    },

    // ==================
    // AR & VR
    // ==================
    "arcore_augmented_reality": {
        id: "arcore_augmented_reality",
        title: "ARCore",
        category: "AR/VR",
        description: "Augmented reality experiences with ARCore.",
        requirements: [
            "permissions.camera",
            "dependencies.arcore"
        ],
        custom_components: [
            {
                type: "meta-data",
                file: PATHS.MANIFEST,
                parent: "application",
                content: '<meta-data android:name="com.google.ar.core" android:value="required" />',
                uniqueKey: "arcore_required",
                label: "ARCore Required"
            }
        ]
    },
    "cardboard_vr": {
        id: "cardboard_vr",
        title: "Google Cardboard VR",
        category: "AR/VR",
        description: "Virtual reality with Google Cardboard SDK.",
        requirements: [
            "dependencies.cardboard"
        ]
    },

    // ==================
    // ADVANCED UI
    // ==================
    "motion_layout": {
        id: "motion_layout",
        title: "MotionLayout Animations",
        category: "UI Animation",
        description: "Complex animations and transitions.",
        requirements: [
            "dependencies.constraint"
        ]
    },
    "preference_screen": {
        id: "preference_screen",
        title: "Settings Screen",
        category: "UI",
        description: "PreferenceScreen for app settings.",
        requirements: [
            "dependencies.preference"
        ]
    },
    "app_widgets": {
        id: "app_widgets",
        title: "Home Screen Widgets",
        category: "UI",
        description: "Create home screen widgets.",
        requirements: [],
        custom_components: [
            {
                type: "receiver",
                file: PATHS.MANIFEST,
                content: `<receiver android:name=".MyWidgetProvider" android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data android:name="android.appwidget.provider"
               android:resource="@xml/widget_info" />
</receiver>`,
                uniqueKey: "widget_receiver",
                label: "Widget Receiver"
            }
        ]
    },
    "live_wallpaper": {
        id: "live_wallpaper",
        title: "Live Wallpaper",
        category: "UI",
        description: "Create animated live wallpapers.",
        requirements: [
            "permissions.bind_wallpaper"
        ]
    },

    // ==================
    // ADVANCED SECURITY
    // ==================
    "safetynet_attestation": {
        id: "safetynet_attestation",
        title: "SafetyNet Attestation",
        category: "Security",
        description: "Verify device integrity (deprecated, use Play Integrity).",
        requirements: [
            "permissions.internet",
            "dependencies.safetynet"
        ]
    },
    "play_integrity": {
        id: "play_integrity",
        title: "Play Integrity API",
        category: "Security",
        description: "Verify app and device authenticity.",
        requirements: [
            "permissions.internet",
            "dependencies.play_integrity"
        ]
    },
    "app_signing": {
        id: "app_signing",
        title: "App Signature Verification",
        category: "Security",
        description: "Verify app hasn't been tampered with.",
        requirements: []
    },

    // ==================
    // DEVICE ADMIN
    // ==================
    "device_admin": {
        id: "device_admin",
        title: "Device Administrator",
        category: "System",
        description: "Device admin privileges for enterprise apps.",
        requirements: [
            "permissions.bind_device_admin"
        ]
    },
    "kiosk_mode": {
        id: "kiosk_mode",
        title: "Kiosk Mode (Lock Task)",
        category: "System",
        description: "Lock app to single-app mode (kiosk).",
        requirements: [
            "permissions.bind_device_admin"
        ]
    },

    // ==================
    // WEB TECHNOLOGIES
    // ==================
    "websocket_client": {
        id: "websocket_client",
        title: "WebSocket Client",
        category: "Networking",
        description: "Real-time bidirectional communication.",
        requirements: [
            "permissions.internet",
            "dependencies.okhttp"
        ]
    },
    "graphql_apollo": {
        id: "graphql_apollo",
        title: "GraphQL (Apollo)",
        category: "Networking",
        description: "GraphQL client with Apollo Android.",
        requirements: [
            "permissions.internet",
            "dependencies.apollo_runtime",
            "dependencies.apollo_coroutines"
        ]
    },
    "grpc_client": {
        id: "grpc_client",
        title: "gRPC Client",
        category: "Networking",
        description: "High-performance RPC framework.",
        requirements: [
            "permissions.internet",
            "dependencies.grpc_okhttp",
            "dependencies.grpc_protobuf"
        ]
    },

    // ==================
    // ANALYTICS
    // ==================
    "google_analytics": {
        id: "google_analytics",
        title: "Google Analytics 4",
        category: "Analytics",
        description: "Google Analytics for Firebase (GA4).",
        requirements: [
            "permissions.internet",
            "dependencies.firebase_bom",
            "dependencies.firebase_analytics"
        ]
    },
    "mixpanel_analytics": {
        id: "mixpanel_analytics",
        title: "Mixpanel Analytics",
        category: "Analytics",
        description: "Product analytics and A/B testing.",
        requirements: [
            "permissions.internet",
            "dependencies.mixpanel"
        ]
    },
    "amplitude_analytics": {
        id: "amplitude_analytics",
        title: "Amplitude Analytics",
        category: "Analytics",
        description: "Product analytics platform.",
        requirements: [
            "permissions.internet",
            "dependencies.amplitude"
        ]
    },

    // ==================
    // MESSAGING & SOCIAL
    // ==================
    "deep_links": {
        id: "deep_links",
        title: "Deep Links",
        category: "Navigation",
        description: "Handle app deep links and universal links.",
        requirements: [],
        custom_components: [
            {
                type: "intent-filter",
                file: PATHS.MANIFEST,
                content: `<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="example.com" />
</intent-filter>`,
                uniqueKey: "deep_link_https",
                label: "Deep Link (HTTPS)"
            }
        ]
    },
    "share_sheet": {
        id: "share_sheet",
        title: "Android Share Sheet",
        category: "Social",
        description: "Share content to other apps.",
        requirements: []
    },
    "shortcuts": {
        id: "shortcuts",
        title: "App Shortcuts",
        category: "Navigation",
        description: "Long-press app icon shortcuts.",
        requirements: [
            "dependencies.shortcuts"
        ]
    },

    // ==================
    // PERFORMANCE
    // ==================
    "jetpack_benchmark": {
        id: "jetpack_benchmark",
        title: "Jetpack Benchmark",
        category: "Performance",
        description: "Measure app performance accurately.",
        requirements: [
            "dependencies.benchmark_junit4"
        ]
    },
    "jetpack_tracing": {
        id: "jetpack_tracing",
        title: "Jetpack Tracing",
        category: "Performance",
        description: "Write trace events for debugging performance.",
        requirements: [
            "dependencies.tracing"
        ]
    },
    "profiler": {
        id: "profiler",
        title: "Android Profiler",
        category: "Performance",
        description: "Enable advanced profiling features.",
        requirements: [],
        custom_components: [
            {
                type: "application-attribute",
                file: PATHS.MANIFEST,
                content: 'tools:targetApi="28"',
                uniqueKey: "profiler_enabled",
                label: "Profiler Support"
            }
        ]
    },

    // ==================
    // MUSIC & AUDIO
    // ==================
    "spotify_sdk": {
        id: "spotify_sdk",
        title: "Spotify SDK",
        category: "Music",
        description: "Integrate Spotify streaming.",
        requirements: [
            "permissions.internet",
            "dependencies.spotify_auth",
            "dependencies.spotify_player"
        ]
    },
    "soundcloud_api": {
        id: "soundcloud_api",
        title: "SoundCloud API",
        category: "Music",
        description: "SoundCloud integration.",
        requirements: [
            "permissions.internet",
            "dependencies.retrofit"
        ]
    },

    // ==================
    // VIDEO FEATURES
    // ==================
    "youtube_player": {
        id: "youtube_player",
        title: "YouTube Player",
        category: "Video",
        description: "Embed YouTube videos in app.",
        requirements: [
            "permissions.internet",
            "dependencies.youtube_player"
        ]
    },
    "video_compression": {
        id: "video_compression",
        title: "Video Compression",
        category: "Video",
        description: "Compress videos with FFmpeg.",
        requirements: [
            "permissions.storage_read",
            "permissions.storage_write",
            "dependencies.ffmpeg_android"
        ]
    },

    // ==================
    //️ INDOOR POSITIONING
    // ==================
    "indoor_positioning": {
        id: "indoor_positioning",
        title: "Indoor Positioning",
        category: "Location",
        description: "Indoor location with WiFi RTT.",
        requirements: [
            "permissions.location_fine",
            "permissions.change_wifi_state",
            "permissions.access_wifi_state"
        ]
    },
    "geofencing": {
        id: "geofencing",
        title: "Geofencing",
        category: "Location",
        description: "Create location-based triggers.",
        requirements: [
            "permissions.location_fine",
            "permissions.location_coarse",
            "permissions.background_location",
            "dependencies.location_services"
        ]
    },

    // ==================
    // E-COMMERCE
    // ==================
    "paypal_sdk": {
        id: "paypal_sdk",
        title: "PayPal SDK",
        category: "Payments",
        description: "PayPal payment integration.",
        requirements: [
            "permissions.internet",
            "dependencies.paypal"
        ]
    },
    "paytm_sdk": {
        id: "paytm_sdk",
        title: "Paytm SDK",
        category: "Payments",
        description: "Paytm payment gateway (India).",
        requirements: [
            "permissions.internet",
            "dependencies.paytm"
        ]
    },
    "square_sdk": {
        id: "square_sdk",
        title: "Square SDK",
        category: "Payments",
        description: "Square payment processing.",
        requirements: [
            "permissions.internet",
            "dependencies.square"
        ]
    },

    // ==================
    // EMAIL & COMMUNICATION
    // ==================
    "send_email": {
        id: "send_email",
        title: "Send Email (Intent)",
        category: "Communication",
        description: "Send emails via Intent.",
        requirements: []
    },
    "twilio_sms": {
        id: "twilio_sms",
        title: "Twilio SMS",
        category: "Communication",
        description: "Send SMS via Twilio API.",
        requirements: [
            "permissions.internet",
            "dependencies.retrofit"
        ]
    },

    // ==================
    // GAME SERVICES
    // ==================
    "play_games": {
        id: "play_games",
        title: "Play Games Services",
        category: "Gaming",
        description: "Leaderboards, achievements, and multiplayer.",
        requirements: [
            "permissions.internet",
            "dependencies.play_games"
        ]
    },
    "unity_ads": {
        id: "unity_ads",
        title: "Unity Ads",
        category: "Gaming",
        description: "Monetization for games.",
        requirements: [
            "permissions.internet",
            "dependencies.unity_ads"
        ]
    },

    // ==================
    // PUSH NOTIFICATIONS
    // ==================
    "onesignal_push": {
        id: "onesignal_push",
        title: "OneSignal Push",
        category: "Notifications",
        description: "Cross-platform push notifications.",
        requirements: [
            "permissions.internet",
            "permissions.post_notifications",
            "dependencies.onesignal"
        ]
    },
    "pusher_beams": {
        id: "pusher_beams",
        title: "Pusher Beams",
        category: "Notifications",
        description: "Scalable push notifications.",
        requirements: [
            "permissions.internet",
            "permissions.post_notifications",
            "dependencies.pusher_beams"
        ]
    },

    // ==================
    // DATABASE ALTERNATIVES
    // ==================
    "realm_database": {
        id: "realm_database",
        title: "Realm Database",
        category: "Database",
        description: "Mobile-first database alternative to SQLite.",
        requirements: [
            "dependencies.realm"
        ]
    },
    "objectbox_db": {
        id: "objectbox_db",
        title: "ObjectBox Database",
        category: "Database",
        description: "Super fast NoSQL database.",
        requirements: [
            "dependencies.objectbox"
        ]
    },
    "sqldelight": {
        id: "sqldelight",
        title: "SQLDelight",
        category: "Database",
        description: "Type-safe Kotlin APIs for SQL.",
        requirements: [
            "dependencies.sqldelight_android"
        ]
    },

    // ==================
    // INTERNATIONALIZATION
    // ==================
    "multi_language": {
        id: "multi_language",
        title: "Multi-Language Support",
        category: "Localization",
        description: "Add multiple language resources.",
        requirements: []
    },
    "rtl_support": {
        id: "rtl_support",
        title: "RTL Layout Support",
        category: "Localization",
        description: "Right-to-left language support.",
        requirements: [],
        custom_components: [
            {
                type: "application-attribute",
                file: PATHS.MANIFEST,
                content: 'android:supportsRtl="true"',
                uniqueKey: "rtl_support",
                label: "RTL Support"
            }
        ]
    },

    // ==================
    // REACTIVE PROGRAMMING
    // ==================
    "rxjava3_full": {
        id: "rxjava3_full",
        title: "RxJava 3 Complete",
        category: "Reactive",
        description: "Reactive Extensions for JVM.",
        requirements: [
            "dependencies.rxjava3",
            "dependencies.rxandroid",
            "dependencies.rxkotlin"
        ]
    },
    "flow_kotlin": {
        id: "flow_kotlin",
        title: "Kotlin Flow",
        category: "Reactive",
        description: "Asynchronous data streams with Kotlin Flow.",
        requirements: [
            "dependencies.coroutines_core",
            "dependencies.coroutines_android"
        ]
    },

    // ==================
    //️ CRASH REPORTING
    // ==================
    "sentry_crash": {
        id: "sentry_crash",
        title: "Sentry Crash Reporting",
        category: "Monitoring",
        description: "Error tracking and performance monitoring.",
        requirements: [
            "permissions.internet",
            "dependencies.sentry_android"
        ]
    },
    "bugsnag": {
        id: "bugsnag",
        title: "Bugsnag",
        category: "Monitoring",
        description: "Error monitoring and crash reporting.",
        requirements: [
            "permissions.internet",
            "dependencies.bugsnag"
        ]
    },

    // ==================
    // VECTOR GRAPHICS
    // ==================
    "vector_drawable": {
        id: "vector_drawable",
        title: "Vector Drawables",
        category: "Graphics",
        description: "Scalable vector graphics support.",
        requirements: [
            "dependencies.vectordrawable"
        ]
    },
    "animated_vector": {
        id: "animated_vector",
        title: "Animated Vector Drawables",
        category: "Graphics",
        description: "Animated SVG graphics.",
        requirements: [
            "dependencies.animated_vector_drawable"
        ]
    },
    
};