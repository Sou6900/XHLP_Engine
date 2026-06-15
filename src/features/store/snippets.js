// features/store/snippets.js

export const CODE_SNIPPETS = {
    // 1. Clipboard
    utils_clipboard: [
        {
            label: "Copy to Clipboard",
            description: "Copy text string to system clipboard.",
            java: {
                imports: ["android.content.Context", "android.content.ClipboardManager", "android.content.ClipData"],
                methods: `
    private void copyToClipboard(String text) {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Copied Text", text);
        clipboard.setPrimaryClip(clip);
    }`
            },
            kotlin: {
                imports: ["android.content.Context", "android.content.ClipboardManager", "android.content.ClipData"],
                methods: `
    private fun copyToClipboard(text: String) {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Copied Text", text)
        clipboard.setPrimaryClip(clip)
    }`
            }
        }
    ],

    // 2. Alert Dialog
    ui_alert: [
        {
            label: "Show Alert Dialog",
            description: "Simple alert dialog with OK button.",
            java: {
                imports: ["androidx.appcompat.app.AlertDialog", "android.content.DialogInterface"],
                methods: `
    private void showAlertDialog(String title, String message) {
        new AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show();
    }`
            },
            kotlin: {
                imports: ["androidx.appcompat.app.AlertDialog"],
                methods: `
    private fun showAlertDialog(title: String, message: String) {
        AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", null)
            .show()
    }`
            }
        }
    ],

    // 3. Permissions Helper
    utils_permission: [
        {
            label: "Check Permission",
            description: "Generic method to check permissions.",
            java: {
                imports: ["android.content.pm.PackageManager", "androidx.core.content.ContextCompat"],
                methods: `
    private boolean hasPermission(String permission) {
        return ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED;
    }`
            },
            kotlin: {
                imports: ["android.content.pm.PackageManager", "androidx.core.content.ContextCompat"],
                methods: `
    private fun hasPermission(permission: String): Boolean {
        return ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED
    }`
            }
        }
    ],

    // 4. Coroutines Scope
    kotlin_coroutines: [
        {
            label: "Launch Coroutine",
            description: "Launch a coroutine in lifecycle scope.",
            kotlin: {
                imports: ["androidx.lifecycle.lifecycleScope", "kotlinx.coroutines.launch"],
                lifecycle: {
                    onCreate: {
                        position: "after_setContentView",
                        code: `
        lifecycleScope.launch {
            // Do async work here
        }`
                    }
                }
            }
        }
    ],

    // 5. Navigation
    jetpack_nav: [
        {
            label: "Navigate to Fragment",
            description: "Navigate using NavController.",
            java: {
                imports: ["androidx.navigation.Navigation"],
                methods: `
    private void navigateTo(int actionId) {
        Navigation.findNavController(this, R.id.nav_host_fragment).navigate(actionId);
    }`
            },
            kotlin: {
                imports: ["androidx.navigation.findNavController"],
                methods: `
    private fun navigateTo(actionId: Int) {
        findNavController(R.id.nav_host_fragment).navigate(actionId)
    }`
            }
        }
    ],

    // 6. Fullscreen Toggle
    ui_fullscreen: [
        {
            label: "Hide System UI",
            description: "Enable fullscreen immersive mode.",
            java: {
                imports: ["android.view.View"],
                methods: `
    private void hideSystemUI() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN);
    }`
            },
            kotlin: {
                imports: ["android.view.View"],
                methods: `
    private fun hideSystemUI() {
        window.decorView.systemUiVisibility = (View.SYSTEM_UI_FLAG_IMMERSIVE
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_FULLSCREEN)
    }`
            }
        }
    ],

    // 7. Open URL
    utils_browser: [
        {
            label: "Open URL in Browser",
            description: "Intent to open a website.",
            java: {
                imports: ["android.content.Intent", "android.net.Uri"],
                methods: `
    private void openUrl(String url) {
        Intent i = new Intent(Intent.ACTION_VIEW);
        i.setData(Uri.parse(url));
        startActivity(i);
    }`
            },
            kotlin: {
                imports: ["android.content.Intent", "android.net.Uri"],
                methods: `
    private fun openUrl(url: String) {
        val i = Intent(Intent.ACTION_VIEW)
        i.data = Uri.parse(url)
        startActivity(i)
    }`
            }
        }
    ] ,

    // ============================================================
    // 🛠️ UTILITIES & HELPER CLASSES
    // ============================================================

    // 8. Internet Connection Check
    internet_check: {
        label: "Check Internet Connection",
        description: "Helper method to check network availability.",
        java: {
            imports: [
                "android.content.Context",
                "android.net.ConnectivityManager",
                "android.net.NetworkInfo"
            ],
            methods: `
    // [AID_START: internet_check]
    public boolean isInternetAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        }
        return false;
    }
    // [AID_END: internet_check]`
        },
        kotlin: {
            imports: [
                "android.content.Context",
                "android.net.ConnectivityManager"
            ],
            methods: `
    // [AID_START: internet_check]
    fun isInternetAvailable(context: Context): Boolean {
        val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager?
        val activeNetwork = cm?.activeNetworkInfo
        return activeNetwork != null && activeNetwork.isConnectedOrConnecting
    }
    // [AID_END: internet_check]`
        }
    },

    // 9. Shared Preferences Helper
    shared_pref_helper: {
        label: "Shared Preferences Manager",
        description: "Singleton class to manage App Preferences easily.",
        files: [
            {
                path: "app/src/main/java/{packagePath}/utils/PrefsManager.java",
                action: "create",
                content: `package {packageName}.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class PrefsManager {
    private static final String PREF_NAME = "MyAppPrefs";
    private SharedPreferences prefs;
    private SharedPreferences.Editor editor;
    private static PrefsManager instance;

    private PrefsManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    public static synchronized PrefsManager getInstance(Context context) {
        if (instance == null) {
            instance = new PrefsManager(context);
        }
        return instance;
    }

    public void setString(String key, String value) {
        editor.putString(key, value).apply();
    }

    public String getString(String key) {
        return prefs.getString(key, null);
    }
    
    public void setBoolean(String key, boolean value) {
        editor.putBoolean(key, value).apply();
    }

    public boolean getBoolean(String key) {
        return prefs.getBoolean(key, false);
    }
}`
            }
        ]
    },

    // 10. Hide Keyboard Utility
    keyboard_utils: {
        label: "Hide Keyboard",
        description: "Method to programmatically hide the soft keyboard.",
        java: {
            imports: [
                "android.app.Activity",
                "android.view.inputmethod.InputMethodManager",
                "android.view.View"
            ],
            methods: `
    // [AID_START: hide_keyboard]
    public void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        View view = activity.getCurrentFocus();
        if (view == null) {
            view = new View(activity);
        }
        if (imm != null) {
            imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }
    // [AID_END: hide_keyboard]`
        },
        kotlin: {
            imports: [
                "android.app.Activity",
                "android.view.inputmethod.InputMethodManager",
                "android.view.View"
            ],
            methods: `
    // [AID_START: hide_keyboard]
    fun hideKeyboard(activity: Activity) {
        val imm = activity.getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager?
        var view = activity.currentFocus
        if (view == null) {
            view = View(activity)
        }
        imm?.hideSoftInputFromWindow(view.windowToken, 0)
    }
    // [AID_END: hide_keyboard]`
        }
    },

    // 11. Clipboard Copy
    clipboard_copy: {
        label: "Copy to Clipboard",
        description: "Copy text to system clipboard.",
        java: {
            imports: [
                "android.content.Context",
                "android.content.ClipData",
                "android.content.ClipboardManager"
            ],
            methods: `
    // [AID_START: copy_clip]
    private void copyToClipboard(Context context, String text) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Copied Text", text);
        if (clipboard != null) {
            clipboard.setPrimaryClip(clip);
        }
    }
    // [AID_END: copy_clip]`
        },
        kotlin: {
            imports: [
                "android.content.Context",
                "android.content.ClipData",
                "android.content.ClipboardManager"
            ],
            methods: `
    // [AID_START: copy_clip]
    private fun copyToClipboard(context: Context, text: String) {
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager?
        val clip = ClipData.newPlainText("Copied Text", text)
        clipboard?.setPrimaryClip(clip)
    }
    // [AID_END: copy_clip]`
        }
    },

    // ============================================================
    // 🎨 UI COMPONENTS & DIALOGS
    // ============================================================

    // 12. Alert Dialog Builder
    alert_dialog: {
        label: "Simple Alert Dialog",
        description: "Shows a standard Material Alert Dialog.",
        java: {
            imports: [
                "androidx.appcompat.app.AlertDialog",
                "android.content.DialogInterface"
            ],
            methods: `
    // [AID_START: alert_dialog]
    private void showAlertDialog(String title, String message) {
        new AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK", (dialog, which) -> dialog.dismiss())
            .setNegativeButton("Cancel", null)
            .show();
    }
    // [AID_END: alert_dialog]`
        },
        kotlin: {
            imports: [
                "androidx.appcompat.app.AlertDialog"
            ],
            methods: `
    // [AID_START: alert_dialog]
    private fun showAlertDialog(title: String, message: String) {
        AlertDialog.Builder(this)
            .setTitle(title)
            .setMessage(message)
            .setPositiveButton("OK") { dialog, _ -> dialog.dismiss() }
            .setNegativeButton("Cancel", null)
            .show()
    }
    // [AID_END: alert_dialog]`
        }
    },

    // 13. Snackbar Helper
    snackbar_simple: {
        label: "Show Snackbar",
        description: "Displays a Snackbar message on the current view.",
        java: {
            imports: [
                "com.google.android.material.snackbar.Snackbar",
                "android.view.View"
            ],
            methods: `
    // [AID_START: show_snack]
    private void showSnackbar(View view, String message) {
        Snackbar.make(view, message, Snackbar.LENGTH_LONG).show();
    }
    // [AID_END: show_snack]`
        },
        kotlin: {
            imports: [
                "com.google.android.material.snackbar.Snackbar",
                "android.view.View"
            ],
            methods: `
    // [AID_START: show_snack]
    private fun showSnackbar(view: View, message: String) {
        Snackbar.make(view, message, Snackbar.LENGTH_LONG).show()
    }
    // [AID_END: show_snack]`
        }
    },

    // 14. Notification Channel Setup (Android 8.0+)
    notification_channel: {
        label: "Create Notification Channel",
        description: "Required for notifications on Android O and above.",
        java: {
            imports: [
                "android.app.NotificationChannel",
                "android.app.NotificationManager",
                "android.os.Build",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: notif_channel]
    private void createNotificationChannel(String channelId, String channelName, String description) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(channelId, channelName, importance);
            channel.setDescription(description);
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
    // [AID_END: notif_channel]`
        },
        kotlin: {
            imports: [
                "android.app.NotificationChannel",
                "android.app.NotificationManager",
                "android.os.Build"
            ],
            methods: `
    // [AID_START: notif_channel]
    private fun createNotificationChannel(channelId: String, channelName: String, description: String) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(channelId, channelName, importance)
            channel.description = description
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager?.createNotificationChannel(channel)
        }
    }
    // [AID_END: notif_channel]`
        }
    },

    // ============================================================
    // 📸 MEDIA & HARDWARE
    // ============================================================

    // 15. Camera Launcher (ActivityResult)
    camera_launcher: {
        label: "Camera Launcher",
        description: "Modern way to launch camera and get bitmap.",
        java: {
            imports: [
                "androidx.activity.result.ActivityResultLauncher",
                "androidx.activity.result.contract.ActivityResultContracts",
                "android.graphics.Bitmap",
                "android.widget.ImageView"
            ],
            fields: `
    // [AID_START: cam_field]
    private ImageView capturedImageView;
    private final ActivityResultLauncher<Void> cameraLauncher = registerForActivityResult(
            new ActivityResultContracts.TakePicturePreview(),
            bitmap -> {
                if (bitmap != null && capturedImageView != null) {
                    capturedImageView.setImageBitmap(bitmap);
                }
            }
    );
    // [AID_END: cam_field]`,
            methods: `
    // [AID_START: launch_cam]
    private void openCamera(ImageView targetView) {
        this.capturedImageView = targetView;
        cameraLauncher.launch(null);
    }
    // [AID_END: launch_cam]`
        },
        kotlin: {
            imports: [
                "androidx.activity.result.contract.ActivityResultContracts",
                "android.graphics.Bitmap",
                "android.widget.ImageView"
            ],
            fields: `
    // [AID_START: cam_field]
    private var capturedImageView: ImageView? = null
    private val cameraLauncher = registerForActivityResult(ActivityResultContracts.TakePicturePreview()) { bitmap ->
        if (bitmap != null) {
            capturedImageView?.setImageBitmap(bitmap)
        }
    }
    // [AID_END: cam_field]`,
            methods: `
    // [AID_START: launch_cam]
    private fun openCamera(targetView: ImageView) {
        this.capturedImageView = targetView
        cameraLauncher.launch(null)
    }
    // [AID_END: launch_cam]`
        }
    },

    // 16. Gallery Image Picker
    gallery_picker: {
        label: "Gallery Image Picker",
        description: "Select an image from gallery safely.",
        java: {
            imports: [
                "androidx.activity.result.ActivityResultLauncher",
                "androidx.activity.result.contract.ActivityResultContracts",
                "android.net.Uri"
            ],
            fields: `
    // [AID_START: gal_field]
    private final ActivityResultLauncher<String> galleryLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    // Handle the URI, e.g., load into ImageView
                }
            }
    );
    // [AID_END: gal_field]`,
            methods: `
    // [AID_START: open_gal]
    private void openGallery() {
        galleryLauncher.launch("image/*");
    }
    // [AID_END: open_gal]`
        },
        kotlin: {
            imports: [
                "androidx.activity.result.contract.ActivityResultContracts"
            ],
            fields: `
    // [AID_START: gal_field]
    private val galleryLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            // Handle the URI
        }
    }
    // [AID_END: gal_field]`,
            methods: `
    // [AID_START: open_gal]
    private fun openGallery() {
        galleryLauncher.launch("image/*")
    }
    // [AID_END: open_gal]`
        }
    },

    // 17. Biometric Authentication
    biometric_auth: {
        label: "Biometric Login",
        description: "Authenticate using Fingerprint or Face.",
        java: {
            imports: [
                "androidx.biometric.BiometricPrompt",
                "androidx.core.content.ContextCompat",
                "java.util.concurrent.Executor"
            ],
            methods: `
    // [AID_START: bio_auth]
    private void showBiometricPrompt() {
        Executor executor = ContextCompat.getMainExecutor(this);
        BiometricPrompt biometricPrompt = new BiometricPrompt(this, executor, new BiometricPrompt.AuthenticationCallback() {
            @Override
            public void onAuthenticationSucceeded(@androidx.annotation.NonNull BiometricPrompt.AuthenticationResult result) {
                super.onAuthenticationSucceeded(result);
                // Auth Success
            }
        });

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Biometric Login")
                .setSubtitle("Log in using your credential")
                .setNegativeButtonText("Cancel")
                .build();

        biometricPrompt.authenticate(promptInfo);
    }
    // [AID_END: bio_auth]`
        },
        kotlin: {
            imports: [
                "androidx.biometric.BiometricPrompt",
                "androidx.core.content.ContextCompat"
            ],
            methods: `
    // [AID_START: bio_auth]
    private fun showBiometricPrompt() {
        val executor = ContextCompat.getMainExecutor(this)
        val biometricPrompt = BiometricPrompt(this, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                // Auth Success
            }
        })

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Biometric Login")
                .setSubtitle("Log in using your credential")
                .setNegativeButtonText("Cancel")
                .build()

        biometricPrompt.authenticate(promptInfo)
    }
    // [AID_END: bio_auth]`
        }
    },

    // 18. Vibrate Phone
    vibrate_phone: {
        label: "Vibrate Device",
        description: "Vibrate the device for a short duration.",
        java: {
            imports: [
                "android.os.Vibrator",
                "android.os.VibrationEffect",
                "android.os.Build",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: vib_dev]
    private void vibrateDevice(Context context, long durationMs) {
        Vibrator v = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        if (v != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                v.vibrate(durationMs);
            }
        }
    }
    // [AID_END: vib_dev]`
        },
        kotlin: {
            imports: [
                "android.os.Vibrator",
                "android.os.VibrationEffect",
                "android.os.Build",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: vib_dev]
    private fun vibrateDevice(context: Context, durationMs: Long) {
        val v = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator?
        v?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                it.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                it.vibrate(durationMs)
            }
        }
    }
    // [AID_END: vib_dev]`
        }
    },

    // ============================================================
    // 🌐 GOOGLE & FIREBASE
    // ============================================================

    // 19. AdMob Init
    admob_init: {
        label: "Initialize AdMob",
        description: "Initialize MobileAds in onCreate.",
        java: {
            imports: ["com.google.android.gms.ads.MobileAds"],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: ads_init]
        MobileAds.initialize(this, initializationStatus -> {});
        // [AID_END: ads_init]`
                }
            }
        },
        kotlin: {
            imports: ["com.google.android.gms.ads.MobileAds"],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: ads_init]
        MobileAds.initialize(this) {}
        // [AID_END: ads_init]`
                }
            }
        }
    },

    // 20. AdMob Banner Load
    admob_banner: {
        label: "Load Banner Ad",
        description: "Loads an ad into AdView.",
        java: {
            imports: [
                "com.google.android.gms.ads.AdRequest",
                "com.google.android.gms.ads.AdView"
            ],
            methods: `
    // [AID_START: load_banner]
    private void loadBannerAd(AdView adView) {
        AdRequest adRequest = new AdRequest.Builder().build();
        adView.loadAd(adRequest);
    }
    // [AID_END: load_banner]`
        },
        kotlin: {
            imports: [
                "com.google.android.gms.ads.AdRequest",
                "com.google.android.gms.ads.AdView"
            ],
            methods: `
    // [AID_START: load_banner]
    private fun loadBannerAd(adView: AdView) {
        val adRequest = AdRequest.Builder().build()
        adView.loadAd(adRequest)
    }
    // [AID_END: load_banner]`
        }
    },

    // 21. Google Sign-In Client
    google_signin_client: {
        label: "Google Sign-In Setup",
        description: "Configures Google Sign-In options.",
        java: {
            imports: [
                "com.google.android.gms.auth.api.signin.GoogleSignInOptions",
                "com.google.android.gms.auth.api.signin.GoogleSignIn",
                "com.google.android.gms.auth.api.signin.GoogleSignInClient"
            ],
            fields: `
    // [AID_START: gsign_field]
    private GoogleSignInClient mGoogleSignInClient;
    // [AID_END: gsign_field]`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: gsign_init]
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
        // [AID_END: gsign_init]`
                }
            }
        },
        kotlin: {
            imports: [
                "com.google.android.gms.auth.api.signin.GoogleSignInOptions",
                "com.google.android.gms.auth.api.signin.GoogleSignIn",
                "com.google.android.gms.auth.api.signin.GoogleSignInClient"
            ],
            fields: `
    // [AID_START: gsign_field]
    private lateinit var mGoogleSignInClient: GoogleSignInClient
    // [AID_END: gsign_field]`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: gsign_init]
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build()
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso)
        // [AID_END: gsign_init]`
                }
            }
        }
    },

    // 22. Firestore Add Document
    firestore_add: {
        label: "Firestore Add Data",
        description: "Adds a HashMap to a Firestore collection.",
        java: {
            imports: [
                "com.google.firebase.firestore.FirebaseFirestore",
                "java.util.Map",
                "java.util.HashMap"
            ],
            methods: `
    // [AID_START: fs_add]
    private void addDataToFirestore(String collectionName, Map<String, Object> data) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection(collectionName)
            .add(data)
            .addOnSuccessListener(documentReference -> {
                // Success
            })
            .addOnFailureListener(e -> {
                // Failure
            });
    }
    // [AID_END: fs_add]`
        },
        kotlin: {
            imports: [
                "com.google.firebase.firestore.FirebaseFirestore"
            ],
            methods: `
    // [AID_START: fs_add]
    private fun addDataToFirestore(collectionName: String, data: Map<String, Any>) {
        val db = FirebaseFirestore.getInstance()
        db.collection(collectionName)
            .add(data)
            .addOnSuccessListener { documentReference ->
                // Success
            }
            .addOnFailureListener { e ->
                // Failure
            }
    }
    // [AID_END: fs_add]`
        }
    },

    // ============================================================
    // 🏗️ ARCHITECTURE & ROOM DB
    // ============================================================

    // 23. Room Entity (User)
    room_entity: {
        label: "Room Entity Class",
        description: "Creates a User entity table.",
        files: [
            {
                path: "app/src/main/java/{packagePath}/db/User.java",
                action: "create",
                content: `package {packageName}.db;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.ColumnInfo;

@Entity(tableName = "users")
public class User {
    @PrimaryKey(autoGenerate = true)
    public int uid;

    @ColumnInfo(name = "first_name")
    public String firstName;

    @ColumnInfo(name = "last_name")
    public String lastName;

    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}`
            }
        ]
    },

    // 24. Room DAO
    room_dao: {
        label: "Room DAO Interface",
        description: "Creates Data Access Object for User.",
        files: [
            {
                path: "app/src/main/java/{packagePath}/db/UserDao.java",
                action: "create",
                content: `package {packageName}.db;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import java.util.List;

@Dao
public interface UserDao {
    @Query("SELECT * FROM users")
    List<User> getAll();

    @Insert
    void insertAll(User... users);

    @Delete
    void delete(User user);
}`
            }
        ]
    },

    // 25. ViewModel Setup
    viewmodel_basic: {
        label: "Basic ViewModel",
        description: "Creates a simple ViewModel class.",
        files: [
            {
                path: "app/src/main/java/{packagePath}/ui/MainViewModel.java",
                action: "create",
                content: `package {packageName}.ui;

import androidx.lifecycle.ViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

public class MainViewModel extends ViewModel {
    private final MutableLiveData<String> textData = new MutableLiveData<>();

    public void setText(String input) {
        textData.setValue(input);
    }

    public LiveData<String> getText() {
        return textData;
    }
}`
            }
        ]
    },

    // ============================================================
    // 💾 FILE & I/O
    // ============================================================

    // 26. Write Text to File
    file_write: {
        label: "Write to File",
        description: "Save string data to internal storage.",
        java: {
            imports: [
                "android.content.Context",
                "java.io.FileOutputStream",
                "java.io.IOException"
            ],
            methods: `
    // [AID_START: file_write]
    private void writeToFile(Context context, String fileName, String data) {
        try (FileOutputStream fos = context.openFileOutput(fileName, Context.MODE_PRIVATE)) {
            fos.write(data.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // [AID_END: file_write]`
        },
        kotlin: {
            imports: [
                "android.content.Context",
                "java.io.IOException"
            ],
            methods: `
    // [AID_START: file_write]
    private fun writeToFile(context: Context, fileName: String, data: String) {
        try {
            context.openFileOutput(fileName, Context.MODE_PRIVATE).use { fos ->
                fos.write(data.toByteArray())
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
    // [AID_END: file_write]`
        }
    },

    // ============================================================
    // 📆 DATE & TIME
    // ============================================================

    // 27. Date Formatter
    date_format: {
        label: "Format Current Date",
        description: "Get current date in specified format.",
        java: {
            imports: [
                "java.text.SimpleDateFormat",
                "java.util.Date",
                "java.util.Locale"
            ],
            methods: `
    // [AID_START: date_fmt]
    private String getCurrentDate(String pattern) {
        return new SimpleDateFormat(pattern, Locale.getDefault()).format(new Date());
    }
    // [AID_END: date_fmt]`
        },
        kotlin: {
            imports: [
                "java.text.SimpleDateFormat",
                "java.util.Date",
                "java.util.Locale"
            ],
            methods: `
    // [AID_START: date_fmt]
    private fun getCurrentDate(pattern: String): String {
        return SimpleDateFormat(pattern, Locale.getDefault()).format(Date())
    }
    // [AID_END: date_fmt]`
        }
    },

    // ============================================================
    // 🚀 VOLLEY NETWORK REQUEST
    // ============================================================

    // 28. Volley String Request
    volley_request: {
        label: "Volley String Request",
        description: "Make a simple GET request using Volley.",
        java: {
            imports: [
                "com.android.volley.Request",
                "com.android.volley.RequestQueue",
                "com.android.volley.toolbox.StringRequest",
                "com.android.volley.toolbox.Volley",
                "android.util.Log"
            ],
            methods: `
    // [AID_START: volley_req]
    private void makeRequest(String url) {
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                response -> {
                    // Handle Response
                    Log.d("Volley", response);
                },
                error -> {
                    // Handle Error
                    Log.e("Volley", error.toString());
                });
        queue.add(stringRequest);
    }
    // [AID_END: volley_req]`
        },
        kotlin: {
            imports: [
                "com.android.volley.Request",
                "com.android.volley.toolbox.StringRequest",
                "com.android.volley.toolbox.Volley",
                "android.util.Log"
            ],
            methods: `
    // [AID_START: volley_req]
    private fun makeRequest(url: String) {
        val queue = Volley.newRequestQueue(this)
        val stringRequest = StringRequest(Request.Method.GET, url,
            { response ->
                // Handle Response
                Log.d("Volley", response)
            },
            { error ->
                // Handle Error
                Log.e("Volley", error.toString())
            })
        queue.add(stringRequest)
    }
    // [AID_END: volley_req]`
        }
    } ,
    
    // 29. Map Marker
    maps_marker: {
        label: "Add Map Marker",
        description: "Add a marker on the map with title and snippet.",
        java: {
            imports: [
                "com.google.android.gms.maps.model.MarkerOptions",
                "com.google.android.gms.maps.model.LatLng",
                "com.google.android.gms.maps.CameraUpdateFactory"
            ],
            methods: `
    // [AID_START: map_marker]
    private void addMapMarker(GoogleMap googleMapInstance) {
        LatLng location = new LatLng(-34, 151);
        googleMapInstance.addMarker(new MarkerOptions()
            .position(location)
            .title("Marker Title")
            .snippet("Marker Description"));
        googleMapInstance.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 12));
    }
    // [AID_END: map_marker]`
        },
        kotlin: {
            imports: [
                "com.google.android.gms.maps.model.MarkerOptions",
                "com.google.android.gms.maps.model.LatLng",
                "com.google.android.gms.maps.CameraUpdateFactory"
            ],
            methods: `
    // [AID_START: map_marker]
    private fun addMapMarker(googleMapInstance: GoogleMap) {
        val location = LatLng(-34.0, 151.0)
        googleMapInstance.addMarker(MarkerOptions()
            .position(location)
            .title("Marker Title")
            .snippet("Marker Description"))
        googleMapInstance.moveCamera(CameraUpdateFactory.newLatLngZoom(location, 12f))
    }
    // [AID_END: map_marker]`
        }
    },

    // 30. Firebase Auth Email
    firebase_auth_email: {
        label: "Firebase Email Auth",
        description: "Email/Password authentication with Firebase.",
        java: {
            imports: [
                "com.google.firebase.auth.FirebaseAuth",
                "com.google.firebase.auth.FirebaseUser"
            ],
            fields: `private FirebaseAuth firebaseAuthInstance;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: fb_auth_init]
        firebaseAuthInstance = FirebaseAuth.getInstance();
        // [AID_END: fb_auth_init]`
                }
            },
            methods: `
    // [AID_START: fb_auth_methods]
    private void signUpWithEmail(String email, String password) {
        firebaseAuthInstance.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = firebaseAuthInstance.getCurrentUser();
                }
            });
    }
    
    private void signInWithEmail(String email, String password) {
        firebaseAuthInstance.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(this, task -> {
                if (task.isSuccessful()) {
                    FirebaseUser user = firebaseAuthInstance.getCurrentUser();
                }
            });
    }
    // [AID_END: fb_auth_methods]`
        },
        kotlin: {
            imports: [
                "com.google.firebase.auth.FirebaseAuth",
                "com.google.firebase.auth.FirebaseUser"
            ],
            fields: `private lateinit var firebaseAuthInstance: FirebaseAuth`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: fb_auth_init]
        firebaseAuthInstance = FirebaseAuth.getInstance()
        // [AID_END: fb_auth_init]`
                }
            },
            methods: `
    // [AID_START: fb_auth_methods]
    private fun signUpWithEmail(email: String, password: String) {
        firebaseAuthInstance.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val user = firebaseAuthInstance.currentUser
                }
            }
    }
    
    private fun signInWithEmail(email: String, password: String) {
        firebaseAuthInstance.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val user = firebaseAuthInstance.currentUser
                }
            }
    }
    // [AID_END: fb_auth_methods]`
        }
    },

    // 31. Firestore Read
    firestore_read: {
        label: "Firestore Read Data",
        description: "Read documents from Firestore collection.",
        java: {
            imports: [
                "com.google.firebase.firestore.FirebaseFirestore",
                "com.google.firebase.firestore.QueryDocumentSnapshot"
            ],
            fields: `private FirebaseFirestore firestoreDb;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: firestore_init]
        firestoreDb = FirebaseFirestore.getInstance();
        // [AID_END: firestore_init]`
                }
            },
            methods: `
    // [AID_START: firestore_read]
    private void readFromFirestore() {
        firestoreDb.collection("users")
            .get()
            .addOnCompleteListener(task -> {
                if (task.isSuccessful()) {
                    for (QueryDocumentSnapshot document : task.getResult()) {
                        String name = document.getString("name");
                    }
                }
            });
    }
    // [AID_END: firestore_read]`
        },
        kotlin: {
            imports: [
                "com.google.firebase.firestore.FirebaseFirestore"
            ],
            fields: `private lateinit var firestoreDb: FirebaseFirestore`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: firestore_init]
        firestoreDb = FirebaseFirestore.getInstance()
        // [AID_END: firestore_init]`
                }
            },
            methods: `
    // [AID_START: firestore_read]
    private fun readFromFirestore() {
        firestoreDb.collection("users")
            .get()
            .addOnSuccessListener { result ->
                for (document in result) {
                    val name = document.getString("name")
                }
            }
    }
    // [AID_END: firestore_read]`
        }
    },

    // 32. ViewPager2 Setup
    viewpager2_setup: {
        label: "ViewPager2 Setup",
        description: "Setup ViewPager2 with adapter.",
        java: {
            imports: [
                "androidx.viewpager2.widget.ViewPager2"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: viewpager2_init]
        ViewPager2 viewPagerInstance = findViewById(R.id.viewPager);
        // viewPagerInstance.setAdapter(yourAdapter);
        // [AID_END: viewpager2_init]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.viewpager2.widget.ViewPager2"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: viewpager2_init]
        val viewPagerInstance = findViewById<ViewPager2>(R.id.viewPager)
        // viewPagerInstance.adapter = yourAdapter
        // [AID_END: viewpager2_init]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <androidx.viewpager2.widget.ViewPager2
        android:id="@+id/viewPager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />`
            }
        ]
    },

    // 33. Bottom Navigation
    bottom_navigation: {
        label: "Bottom Navigation",
        description: "Add bottom navigation bar.",
        java: {
            imports: [
                "com.google.android.material.bottomnavigation.BottomNavigationView",
                "androidx.navigation.NavController",
                "androidx.navigation.Navigation",
                "androidx.navigation.ui.NavigationUI"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: bottom_nav]
        BottomNavigationView bottomNavView = findViewById(R.id.bottom_navigation);
        NavController navController = Navigation.findNavController(this, R.id.nav_host_fragment);
        NavigationUI.setupWithNavController(bottomNavView, navController);
        // [AID_END: bottom_nav]`
                }
            }
        },
        kotlin: {
            imports: [
                "com.google.android.material.bottomnavigation.BottomNavigationView",
                "androidx.navigation.NavController",
                "androidx.navigation.Navigation",
                "androidx.navigation.ui.NavigationUI"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: bottom_nav]
        val bottomNavView = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        val navController = Navigation.findNavController(this, R.id.nav_host_fragment)
        NavigationUI.setupWithNavController(bottomNavView, navController)
        // [AID_END: bottom_nav]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <com.google.android.material.bottomnavigation.BottomNavigationView
        android:id="@+id/bottom_navigation"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        app:menu="@menu/bottom_nav_menu" />`
            }
        ]
    },

    // 34. SwipeRefreshLayout
    swipe_refresh: {
        label: "SwipeRefreshLayout",
        description: "Pull-to-refresh functionality.",
        java: {
            imports: [
                "androidx.swiperefreshlayout.widget.SwipeRefreshLayout"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: swipe_refresh]
        SwipeRefreshLayout swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        swipeRefreshLayout.setOnRefreshListener(() -> {
            // Refresh data
            swipeRefreshLayout.setRefreshing(false);
        });
        // [AID_END: swipe_refresh]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.swiperefreshlayout.widget.SwipeRefreshLayout"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: swipe_refresh]
        val swipeRefreshLayout = findViewById<SwipeRefreshLayout>(R.id.swipeRefreshLayout)
        swipeRefreshLayout.setOnRefreshListener {
            // Refresh data
            swipeRefreshLayout.isRefreshing = false
        }
        // [AID_END: swipe_refresh]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
        android:id="@+id/swipeRefreshLayout"
        android:layout_width="match_parent"
        android:layout_height="match_parent">
        
        <!-- Your content here -->
        
    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>`
            }
        ]
    },

    // 35. Floating Action Button
    floating_action_button: {
        label: "Floating Action Button",
        description: "Add FAB with click listener.",
        java: {
            imports: [
                "com.google.android.material.floatingactionbutton.FloatingActionButton"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: fab]
        FloatingActionButton fabButton = findViewById(R.id.fab);
        fabButton.setOnClickListener(view -> {
            // FAB clicked
        });
        // [AID_END: fab]`
                }
            }
        },
        kotlin: {
            imports: [
                "com.google.android.material.floatingactionbutton.FloatingActionButton"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: fab]
        val fabButton = findViewById<FloatingActionButton>(R.id.fab)
        fabButton.setOnClickListener {
            // FAB clicked
        }
        // [AID_END: fab]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"
        android:src="@android:drawable/ic_input_add" />`
            }
        ]
    },

    // 36. ExoPlayer Video
    exoplayer_video: {
        label: "ExoPlayer Video Playback",
        description: "Play videos using ExoPlayer.",
        java: {
            imports: [
                "androidx.media3.exoplayer.ExoPlayer",
                "androidx.media3.common.MediaItem",
                "androidx.media3.ui.PlayerView"
            ],
            fields: `private ExoPlayer exoPlayerInstance;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: exoplayer_init]
        PlayerView playerView = findViewById(R.id.playerView);
        exoPlayerInstance = new ExoPlayer.Builder(this).build();
        playerView.setPlayer(exoPlayerInstance);
        
        MediaItem mediaItem = MediaItem.fromUri("https://example.com/video.mp4");
        exoPlayerInstance.setMediaItem(mediaItem);
        exoPlayerInstance.prepare();
        // [AID_END: exoplayer_init]`
                },
                onDestroy: {
                    position: "end",
                    code: `
        // [AID_START: exoplayer_release]
        if (exoPlayerInstance != null) {
            exoPlayerInstance.release();
            exoPlayerInstance = null;
        }
        // [AID_END: exoplayer_release]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.media3.exoplayer.ExoPlayer",
                "androidx.media3.common.MediaItem",
                "androidx.media3.ui.PlayerView"
            ],
            fields: `private var exoPlayerInstance: ExoPlayer? = null`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: exoplayer_init]
        val playerView = findViewById<PlayerView>(R.id.playerView)
        exoPlayerInstance = ExoPlayer.Builder(this).build()
        playerView.player = exoPlayerInstance
        
        val mediaItem = MediaItem.fromUri("https://example.com/video.mp4")
        exoPlayerInstance?.setMediaItem(mediaItem)
        exoPlayerInstance?.prepare()
        // [AID_END: exoplayer_init]`
                },
                onDestroy: {
                    position: "end",
                    code: `
        // [AID_START: exoplayer_release]
        exoPlayerInstance?.release()
        exoPlayerInstance = null
        // [AID_END: exoplayer_release]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <androidx.media3.ui.PlayerView
        android:id="@+id/playerView"
        android:layout_width="match_parent"
        android:layout_height="300dp" />`
            }
        ]
    },

    // 37. Runtime Permission
    runtime_permission: {
        label: "Runtime Permission Check",
        description: "Check and request runtime permissions.",
        java: {
            imports: [
                "androidx.core.app.ActivityCompat",
                "androidx.core.content.ContextCompat",
                "android.Manifest",
                "android.content.pm.PackageManager"
            ],
            methods: `
    // [AID_START: runtime_permission]
    private void checkPermission(String permission, int requestCode) {
        if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{permission}, requestCode);
        }
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            // Permission granted
        }
    }
    // [AID_END: runtime_permission]`
        },
        kotlin: {
            imports: [
                "androidx.core.app.ActivityCompat",
                "androidx.core.content.ContextCompat",
                "android.Manifest",
                "android.content.pm.PackageManager"
            ],
            methods: `
    // [AID_START: runtime_permission]
    private fun checkPermission(permission: String, requestCode: Int) {
        if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(permission), requestCode)
        }
    }
    
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            // Permission granted
        }
    }
    // [AID_END: runtime_permission]`
        }
    },

    // 38. Get Current Location
    current_location: {
        label: "Get Current Location",
        description: "Get user's current location using Fused Location Provider.",
        java: {
            imports: [
                "com.google.android.gms.location.FusedLocationProviderClient",
                "com.google.android.gms.location.LocationServices",
                "android.location.Location",
                "androidx.core.app.ActivityCompat",
                "android.Manifest"
            ],
            fields: `private FusedLocationProviderClient fusedLocationClient;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: location_init]
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        // [AID_END: location_init]`
                }
            },
            methods: `
    // [AID_START: get_location]
    private void getCurrentLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, location -> {
                    if (location != null) {
                        double latitude = location.getLatitude();
                        double longitude = location.getLongitude();
                    }
                });
        }
    }
    // [AID_END: get_location]`
        },
        kotlin: {
            imports: [
                "com.google.android.gms.location.FusedLocationProviderClient",
                "com.google.android.gms.location.LocationServices",
                "androidx.core.app.ActivityCompat",
                "android.Manifest"
            ],
            fields: `private lateinit var fusedLocationClient: FusedLocationProviderClient`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: location_init]
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        // [AID_END: location_init]`
                }
            },
            methods: `
    // [AID_START: get_location]
    private fun getCurrentLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            fusedLocationClient.lastLocation
                .addOnSuccessListener { location ->
                    location?.let {
                        val latitude = it.latitude
                        val longitude = it.longitude
                    }
                }
        }
    }
    // [AID_END: get_location]`
        }
    },

    // 39. Text-to-Speech
    text_to_speech: {
        label: "Text-to-Speech",
        description: "Convert text to speech.",
        java: {
            imports: [
                "android.speech.tts.TextToSpeech",
                "java.util.Locale"
            ],
            fields: `private TextToSpeech textToSpeechInstance;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: tts_init]
        textToSpeechInstance = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                textToSpeechInstance.setLanguage(Locale.US);
            }
        });
        // [AID_END: tts_init]`
                },
                onDestroy: {
                    position: "end",
                    code: `
        // [AID_START: tts_shutdown]
        if (textToSpeechInstance != null) {
            textToSpeechInstance.stop();
            textToSpeechInstance.shutdown();
        }
        // [AID_END: tts_shutdown]`
                }
            },
            methods: `
    // [AID_START: tts_speak]
    private void speakText(String text) {
        if (textToSpeechInstance != null) {
            textToSpeechInstance.speak(text, TextToSpeech.QUEUE_FLUSH, null, null);
        }
    }
    // [AID_END: tts_speak]`
        },
        kotlin: {
            imports: [
                "android.speech.tts.TextToSpeech",
                "java.util.Locale"
            ],
            fields: `private var textToSpeechInstance: TextToSpeech? = null`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: tts_init]
        textToSpeechInstance = TextToSpeech(this) { status ->
            if (status == TextToSpeech.SUCCESS) {
                textToSpeechInstance?.language = Locale.US
            }
        }
        // [AID_END: tts_init]`
                },
                onDestroy: {
                    position: "end",
                    code: `
        // [AID_START: tts_shutdown]
        textToSpeechInstance?.stop()
        textToSpeechInstance?.shutdown()
        // [AID_END: tts_shutdown]`
                }
            },
            methods: `
    // [AID_START: tts_speak]
    private fun speakText(text: String) {
        textToSpeechInstance?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
    }
    // [AID_END: tts_speak]`
        }
    },

    // 40. Dark Mode Toggle
    dark_mode: {
        label: "Dark Mode Toggle",
        description: "Toggle between light and dark theme.",
        java: {
            imports: [
                "androidx.appcompat.app.AppCompatDelegate"
            ],
            methods: `
    // [AID_START: dark_mode]
    private void enableDarkMode() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
    }
    
    private void enableLightMode() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
    }
    
    private void useSystemTheme() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
    }
    // [AID_END: dark_mode]`
        },
        kotlin: {
            imports: [
                "androidx.appcompat.app.AppCompatDelegate"
            ],
            methods: `
    // [AID_START: dark_mode]
    private fun enableDarkMode() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
    }
    
    private fun enableLightMode() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
    }
    
    private fun useSystemTheme() {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
    }
    // [AID_END: dark_mode]`
        }
    },

    // 41. Make Phone Call
    phone_call: {
        label: "Make Phone Call",
        description: "Initiate a phone call.",
        java: {
            imports: [
                "android.content.Intent",
                "android.net.Uri",
                "androidx.core.app.ActivityCompat",
                "android.Manifest"
            ],
            methods: `
    // [AID_START: phone_call]
    private void makePhoneCall(String phoneNumber) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) 
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            Intent callIntent = new Intent(Intent.ACTION_CALL);
            callIntent.setData(Uri.parse("tel:" + phoneNumber));
            startActivity(callIntent);
        }
    }
    // [AID_END: phone_call]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.net.Uri",
                "androidx.core.app.ActivityCompat",
                "android.Manifest"
            ],
            methods: `
    // [AID_START: phone_call]
    private fun makePhoneCall(phoneNumber: String) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) 
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            val callIntent = Intent(Intent.ACTION_CALL)
            callIntent.data = Uri.parse("tel:$phoneNumber")
            startActivity(callIntent)
        }
    }
    // [AID_END: phone_call]`
        }
    },

    // 42. Send SMS
    send_sms: {
        label: "Send SMS",
        description: "Send SMS message.",
        java: {
            imports: [
                "android.telephony.SmsManager"
            ],
            methods: `
    // [AID_START: send_sms]
    private void sendSMS(String phoneNumber, String message) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            smsManager.sendTextMessage(phoneNumber, null, message, null, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    // [AID_END: send_sms]`
        },
        kotlin: {
            imports: [
                "android.telephony.SmsManager"
            ],
            methods: `
    // [AID_START: send_sms]
    private fun sendSMS(phoneNumber: String, message: String) {
        try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    // [AID_END: send_sms]`
        }
    },

    // 43. Share Content
    share_intent: {
        label: "Share Content",
        description: "Share text using share sheet.",
        java: {
            imports: [
                "android.content.Intent"
            ],
            methods: `
    // [AID_START: share_content]
    private void shareText(String text) {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_TEXT, text);
        startActivity(Intent.createChooser(shareIntent, "Share via"));
    }
    // [AID_END: share_content]`
        },
        kotlin: {
            imports: [
                "android.content.Intent"
            ],
            methods: `
    // [AID_START: share_content]
    private fun shareText(text: String) {
        val shareIntent = Intent(Intent.ACTION_SEND)
        shareIntent.type = "text/plain"
        shareIntent.putExtra(Intent.EXTRA_TEXT, text)
        startActivity(Intent.createChooser(shareIntent, "Share via"))
    }
    // [AID_END: share_content]`
        }
    },

    // 44. Deep Link Handler
    deep_link: {
        label: "Handle Deep Link",
        description: "Handle incoming deep links.",
        java: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: deep_link]
        Intent intentData = getIntent();
        Uri data = intentData.getData();
        if (data != null) {
            String scheme = data.getScheme();
            String host = data.getHost();
        }
        // [AID_END: deep_link]`
                }
            }
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: deep_link]
        val data: Uri? = intent?.data
        if (data != null) {
            val scheme = data.scheme
            val host = data.host
        }
        // [AID_END: deep_link]`
                }
            }
        }
    },

    // 45. Lottie Animation
    lottie_animation: {
        label: "Lottie Animation",
        description: "Play Lottie animations.",
        java: {
            imports: [
                "com.airbnb.lottie.LottieAnimationView"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: lottie]
        LottieAnimationView lottieView = findViewById(R.id.lottieAnimationView);
        lottieView.setAnimation("animation.json");
        lottieView.playAnimation();
        // [AID_END: lottie]`
                }
            }
        },
        kotlin: {
            imports: [
                "com.airbnb.lottie.LottieAnimationView"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: lottie]
        val lottieView = findViewById<LottieAnimationView>(R.id.lottieAnimationView)
        lottieView.setAnimation("animation.json")
        lottieView.playAnimation()
        // [AID_END: lottie]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <com.airbnb.lottie.LottieAnimationView
        android:id="@+id/lottieAnimationView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:lottie_autoPlay="true"
        app:lottie_loop="true" />`
            }
        ]
    },

    // 46. WebView Advanced
    webview_advanced: {
        label: "WebView Advanced",
        description: "WebView with JavaScript enabled.",
        java: {
            imports: [
                "android.webkit.WebView",
                "android.webkit.WebViewClient",
                "android.webkit.WebSettings"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: webview_advanced]
        WebView webViewInstance = findViewById(R.id.webView);
        webViewInstance.setWebViewClient(new WebViewClient());
        WebSettings webSettings = webViewInstance.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webViewInstance.loadUrl("https://www.example.com");
        // [AID_END: webview_advanced]`
                }
            }
        },
        kotlin: {
            imports: [
                "android.webkit.WebView",
                "android.webkit.WebViewClient"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: webview_advanced]
        val webViewInstance = findViewById<WebView>(R.id.webView)
        webViewInstance.webViewClient = WebViewClient()
        webViewInstance.settings.javaScriptEnabled = true
        webViewInstance.loadUrl("https://www.example.com")
        // [AID_END: webview_advanced]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />`
            }
        ]
    },

    // 47. WorkManager One-Time
    workmanager_onetime: {
        label: "WorkManager One-Time Task",
        description: "Schedule one-time background work.",
        java: {
            imports: [
                "androidx.work.OneTimeWorkRequest",
                "androidx.work.WorkManager"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: workmanager]
        OneTimeWorkRequest workRequest = new OneTimeWorkRequest.Builder(MyWorker.class).build();
        WorkManager.getInstance(this).enqueue(workRequest);
        // [AID_END: workmanager]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.work.OneTimeWorkRequestBuilder",
                "androidx.work.WorkManager"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: workmanager]
        val workRequest = OneTimeWorkRequestBuilder<MyWorker>().build()
        WorkManager.getInstance(this).enqueue(workRequest)
        // [AID_END: workmanager]`
                }
            }
        }
    },

    // 48. Splash Screen (Android 12+)
    splash_screen_modern: {
        label: "Splash Screen",
        description: "Modern splash screen for Android 12+.",
        java: {
            imports: [
                "androidx.core.splashscreen.SplashScreen"
            ],
            lifecycle: {
                onCreate: {
                    position: "before_super",
                    code: `
        // [AID_START: splash_screen]
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);
        // [AID_END: splash_screen]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.core.splashscreen.SplashScreen"
            ],
            lifecycle: {
                onCreate: {
                    position: "before_super",
                    code: `
        // [AID_START: splash_screen]
        val splashScreen = installSplashScreen()
        // [AID_END: splash_screen]`
                }
            }
        }
    },
    
        // ============================================================
    // 🗺️ GOOGLE MAPS (Matches 'google_maps' in data.js)
    // ============================================================
    // 49
    google_maps: [
        {
            label: "Basic Map Setup",
            description: "Initialize Google Maps in an Activity.",
            java: {
                imports: ["com.google.android.gms.maps.SupportMapFragment", "com.google.android.gms.maps.OnMapReadyCallback", "com.google.android.gms.maps.GoogleMap"],
                implements: ["OnMapReadyCallback"],
                lifecycle: {
                    onCreate: {
                        position: "after_setContentView",
                        code: `
        // [AID_START: map_init]
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        if (mapFragment != null) mapFragment.getMapAsync(this);
        // [AID_END: map_init]`
                    }
                },
                methods: `
    @Override
    public void onMapReady(GoogleMap googleMap) {
        // Map Ready
    }`
            },
            kotlin: {
                imports: ["com.google.android.gms.maps.SupportMapFragment", "com.google.android.gms.maps.OnMapReadyCallback", "com.google.android.gms.maps.GoogleMap"],
                implements: ["OnMapReadyCallback"],
                lifecycle: {
                    onCreate: {
                        position: "after_setContentView",
                        code: `
        val mapFragment = supportFragmentManager.findFragmentById(R.id.map) as SupportMapFragment?
        mapFragment?.getMapAsync(this)`
                    }
                },
                methods: `
    override fun onMapReady(googleMap: GoogleMap) {
        // Map Ready
    }`
            },
            files: [
                {
                    path: "{res}/layout/activity_main.xml",
                    action: "inject_xml",
                    content: `
    <fragment xmlns:map="http://schemas.android.com/apk/res-auto"
        android:id="@+id/map"
        android:name="com.google.android.gms.maps.SupportMapFragment"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />`
                }
            ]
        },
        {
            label: "Enable User Location",
            description: "Request permission and enable My Location layer.",
            java: {
                imports: ["androidx.core.app.ActivityCompat", "android.Manifest", "android.content.pm.PackageManager"],
                methods: `
    private void enableMyLocation(GoogleMap map) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
                == PackageManager.PERMISSION_GRANTED) {
            map.setMyLocationEnabled(true);
        } else {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1001);
        }
    }`
            },
            kotlin: {
                imports: ["androidx.core.app.ActivityCompat", "android.Manifest", "android.content.pm.PackageManager"],
                methods: `
    private fun enableMyLocation(map: GoogleMap) {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
                == PackageManager.PERMISSION_GRANTED) {
            map.isMyLocationEnabled = true
        } else {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1001)
        }
    }`
            }
        },
        {
            label: "Add Marker Click Listener",
            description: "Handle marker clicks on the map.",
            java: {
                imports: ["com.google.android.gms.maps.GoogleMap", "android.widget.Toast", "com.google.android.gms.maps.model.Marker"],
                methods: `
    private void setupMarkerClick(GoogleMap map) {
        map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                Toast.makeText(getApplicationContext(), "Clicked: " + marker.getTitle(), Toast.LENGTH_SHORT).show();
                return false;
            }
        });
    }`
            },
            kotlin: {
                imports: ["com.google.android.gms.maps.GoogleMap", "android.widget.Toast"],
                methods: `
    private fun setupMarkerClick(map: GoogleMap) {
        map.setOnMarkerClickListener { marker ->
            Toast.makeText(this, "Clicked: \${marker.title}", Toast.LENGTH_SHORT).show()
            false
        }
    }`
            }
        }
    ],

    // ============================================================
    // 🌐 RETROFIT (Matches 'retrofit_setup')
    // ============================================================
    // 50
    retrofit_setup: [
        {
            label: "Retrofit Client Singleton",
            description: "Singleton class for Retrofit instance.",
            files: [{
                path: "app/src/main/java/{packagePath}/network/RetrofitClient.java",
                action: "create",
                content: `package {packageName}.network;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static Retrofit retrofit;
    public static Retrofit getClient(String baseUrl) {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}`
            }]
        },
        {
            label: "API Interface (Sample)",
            description: "Interface with GET and POST methods.",
            files: [{
                path: "app/src/main/java/{packagePath}/network/ApiService.java",
                action: "create",
                content: `package {packageName}.network;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Body;
import java.util.List;

public interface ApiService {
    @GET("users")
    Call<List<Object>> getUsers();

    @POST("users")
    Call<Object> createUser(@Body Object user);
}`
            }]
        }
    ],

    // ============================================================
    // 🖼️ RECYCLER VIEW (Matches 'recyclerview')
    // ============================================================
    // 51
    recyclerview: [
        {
            label: "Setup RecyclerView",
            description: "Init RecyclerView in Activity.",
            java: {
                imports: ["androidx.recyclerview.widget.LinearLayoutManager", "androidx.recyclerview.widget.RecyclerView"],
                lifecycle: {
                    onCreate: {
                        position: "after_setContentView",
                        code: `
        RecyclerView rv = findViewById(R.id.recyclerView);
        rv.setLayoutManager(new LinearLayoutManager(this));
        // rv.setAdapter(new MyAdapter());`
                    }
                },
                files: [{
                    path: "{res}/layout/activity_main.xml",
                    action: "inject_xml",
                    content: `<androidx.recyclerview.widget.RecyclerView android:id="@+id/recyclerView" android:layout_width="match_parent" android:layout_height="match_parent"/>`
                }]
            },
            kotlin: {
                imports: ["androidx.recyclerview.widget.LinearLayoutManager", "androidx.recyclerview.widget.RecyclerView"],
                lifecycle: {
                    onCreate: {
                        position: "after_setContentView",
                        code: `
        val rv = findViewById<RecyclerView>(R.id.recyclerView)
        rv.layoutManager = LinearLayoutManager(this)`
                    }
                }
            }
        }
    ],

    // ============================================================
    // 🛠️ STANDALONE UTILITIES (New Auto-Added Features)
    // ============================================================
    
    // 52 Toast Utils
    utils_toast: [
        {
            label: "Toast Helper",
            description: "Simple method to show toasts.",
            java: {
                imports: ["android.widget.Toast"],
                methods: `
    private void showToast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
    }`
            },
            kotlin: {
                imports: ["android.widget.Toast"],
                methods: `
    private fun showToast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }`
            }
        }
    ],

    // 53 Keyboard Utils
    utils_keyboard: [
        {
            label: "Hide Keyboard",
            description: "Method to hide soft keyboard.",
            java: {
                imports: ["android.app.Activity", "android.view.inputmethod.InputMethodManager", "android.view.View"],
                methods: `
    public static void hideKeyboard(Activity activity) {
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Activity.INPUT_METHOD_SERVICE);
        View view = activity.getCurrentFocus();
        if (view == null) view = new View(activity);
        imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
    }`
            },
            kotlin: {
                imports: ["android.app.Activity", "android.view.inputmethod.InputMethodManager", "android.view.View"],
                methods: `
    fun hideKeyboard(activity: Activity) {
        val imm = activity.getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
        var view = activity.currentFocus
        if (view == null) view = View(activity)
        imm.hideSoftInputFromWindow(view.windowToken, 0)
    }`
            }
        }
    ],

    // 54 Network Utils
    utils_network: [
        {
            label: "Check Internet",
            description: "Check if network is available.",
            java: {
                imports: ["android.content.Context", "android.net.ConnectivityManager", "android.net.NetworkInfo"],
                methods: `
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }`
            },
            kotlin: {
                imports: ["android.content.Context", "android.net.ConnectivityManager"],
                methods: `
    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetworkInfo = connectivityManager.activeNetworkInfo
        return activeNetworkInfo != null && activeNetworkInfo.isConnected
    }`
            }
        }
    ],

    // 55 Shared Preferences
    utils_prefs: [
        {
            label: "SharedPrefs Helper",
            description: "Class for managing Shared Preferences.",
            files: [{
                path: "app/src/main/java/{packagePath}/utils/Prefs.java",
                action: "create",
                content: `package {packageName}.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class Prefs {
    private static final String PREF_NAME = "MyAppPrefs";
    private SharedPreferences prefs;

    public Prefs(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveString(String key, String value) {
        prefs.edit().putString(key, value).apply();
    }

    public String getString(String key) {
        return prefs.getString(key, "");
    }
}`
            }]
        }
    ],

    // 56 View Binding
    view_binding_setup: [
        {
            label: "ViewBinding in Activity",
            description: "Setup ViewBinding in onCreate.",
            java: {
                imports: ["{packageName}.databinding.ActivityMainBinding"],
                lifecycle: {
                    onCreate: {
                        position: "after_super",
                        code: `
        ActivityMainBinding binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());`
                    }
                }
            },
            kotlin: {
                imports: ["{packageName}.databinding.ActivityMainBinding"],
                lifecycle: {
                    onCreate: {
                        position: "after_super",
                        code: `
        val binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)`
                    }
                }
            }
        }
    ],

    // 57 Date Time
    utils_date: [
        {
            label: "Get Current Date",
            description: "Format current date as String.",
            java: {
                imports: ["java.text.SimpleDateFormat", "java.util.Date", "java.util.Locale"],
                methods: `
    public String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return sdf.format(new Date());
    }`
            },
            kotlin: {
                imports: ["java.text.SimpleDateFormat", "java.util.Date", "java.util.Locale"],
                methods: `
    fun getCurrentDate(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        return sdf.format(Date())
    }`
            }
        }
    ],
    

    // 58. Firebase Storage Download
    firebase_storage_download: {
        label: "Firebase Storage Download",
        description: "Download files from Firebase Storage.",
        java: {
            imports: [
                "com.google.firebase.storage.FirebaseStorage",
                "com.google.firebase.storage.StorageReference",
                "java.io.File"
            ],
            fields: `private FirebaseStorage firebaseStorageInstance;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: storage_init]
        firebaseStorageInstance = FirebaseStorage.getInstance();
        // [AID_END: storage_init]`
                }
            },
            methods: `
    // [AID_START: storage_download]
    private void downloadFromStorage(String filePath) {
        StorageReference storageRef = firebaseStorageInstance.getReference();
        StorageReference fileRef = storageRef.child(filePath);
        
        File localFile = new File(getExternalFilesDir(null), "downloaded_file.jpg");
        
        fileRef.getFile(localFile)
            .addOnSuccessListener(taskSnapshot -> {
                // Download success
            })
            .addOnFailureListener(e -> {
                // Download failed
            });
    }
    // [AID_END: storage_download]`
        },
        kotlin: {
            imports: [
                "com.google.firebase.storage.FirebaseStorage",
                "com.google.firebase.storage.StorageReference",
                "java.io.File"
            ],
            fields: `private lateinit var firebaseStorageInstance: FirebaseStorage`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: storage_init]
        firebaseStorageInstance = FirebaseStorage.getInstance()
        // [AID_END: storage_init]`
                }
            },
            methods: `
    // [AID_START: storage_download]
    private fun downloadFromStorage(filePath: String) {
        val storageRef = firebaseStorageInstance.reference
        val fileRef = storageRef.child(filePath)
        
        val localFile = File(getExternalFilesDir(null), "downloaded_file.jpg")
        
        fileRef.getFile(localFile)
            .addOnSuccessListener {
                // Download success
            }
            .addOnFailureListener { e ->
                // Download failed
            }
    }
    // [AID_END: storage_download]`
        }
    },

    // 59. Room Database Insert/Update/Delete
    room_operations: {
        label: "Room Database Operations",
        description: "Perform CRUD operations with Room.",
        java: {
            imports: [
                "{packageName}.database.AppDatabase",
                "{packageName}.database.User",
                "java.util.List"
            ],
            methods: `
    // [AID_START: room_operations]
    private void insertUser(String name, int age) {
        new Thread(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            User user = new User(name, age, "");
            db.userDao().insert(user);
        }).start();
    }
    
    private void getAllUsers() {
        new Thread(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            List<User> users = db.userDao().getAllUsers();
            // Update UI on main thread
        }).start();
    }
    
    private void deleteUser(User user) {
        new Thread(() -> {
            AppDatabase db = AppDatabase.getInstance(this);
            db.userDao().delete(user);
        }).start();
    }
    // [AID_END: room_operations]`
        },
        kotlin: {
            imports: [
                "{packageName}.database.AppDatabase",
                "{packageName}.database.User",
                "kotlinx.coroutines.Dispatchers",
                "kotlinx.coroutines.withContext",
                "androidx.lifecycle.lifecycleScope",
                "kotlinx.coroutines.launch"
            ],
            methods: `
    // [AID_START: room_operations]
    private fun insertUser(name: String, age: Int) {
        lifecycleScope.launch(Dispatchers.IO) {
            val db = AppDatabase.getInstance(this@MainActivity)
            val user = User(name, age, "")
            db.userDao().insert(user)
        }
    }
    
    private fun getAllUsers() {
        lifecycleScope.launch(Dispatchers.IO) {
            val db = AppDatabase.getInstance(this@MainActivity)
            val users = db.userDao().getAllUsers()
            withContext(Dispatchers.Main) {
                // Update UI
            }
        }
    }
    
    private fun deleteUser(user: User) {
        lifecycleScope.launch(Dispatchers.IO) {
            val db = AppDatabase.getInstance(this@MainActivity)
            db.userDao().delete(user)
        }
    }
    // [AID_END: room_operations]`
        }
    },

    // 60. Retrofit with Coroutines
    retrofit_coroutines: {
        label: "Retrofit with Coroutines",
        description: "Make API calls using Retrofit and Coroutines.",
        kotlin: {
            imports: [
                "kotlinx.coroutines.Dispatchers",
                "kotlinx.coroutines.withContext",
                "androidx.lifecycle.lifecycleScope",
                "kotlinx.coroutines.launch"
            ],
            methods: `
    // [AID_START: retrofit_coroutines]
    private fun makeApiCallWithCoroutines() {
        lifecycleScope.launch {
            try {
                // val response = withContext(Dispatchers.IO) {
                //     apiService.getData()
                // }
                // Update UI with response
            } catch (e: Exception) {
                // Handle error
            }
        }
    }
    // [AID_END: retrofit_coroutines]`
        },
        java: {
            imports: [],
            methods: `
    // [AID_START: retrofit_coroutines]
    // Use Kotlin for coroutines support
    // [AID_END: retrofit_coroutines]`
        }
    },

    // 61. RecyclerView with DiffUtil
    recyclerview_diffutil: {
        label: "RecyclerView with DiffUtil",
        description: "Efficient RecyclerView updates using DiffUtil.",
        java: {
            imports: [
                "androidx.recyclerview.widget.DiffUtil",
                "java.util.List"
            ],
            methods: `
    // [AID_START: diffutil]
    private void updateRecyclerViewData(List<String> newList) {
        // DiffUtil.DiffResult diffResult = DiffUtil.calculateDiff(new DiffUtil.Callback() {
        //     @Override
        //     public int getOldListSize() { return oldList.size(); }
        //     
        //     @Override
        //     public int getNewListSize() { return newList.size(); }
        //     
        //     @Override
        //     public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
        //         return oldList.get(oldItemPosition).equals(newList.get(newItemPosition));
        //     }
        //     
        //     @Override
        //     public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
        //         return oldList.get(oldItemPosition).equals(newList.get(newItemPosition));
        //     }
        // });
        // adapter.updateList(newList);
        // diffResult.dispatchUpdatesTo(adapter);
    }
    // [AID_END: diffutil]`
        },
        kotlin: {
            imports: [
                "androidx.recyclerview.widget.DiffUtil"
            ],
            methods: `
    // [AID_START: diffutil]
    private fun updateRecyclerViewData(newList: List<String>) {
        // val diffResult = DiffUtil.calculateDiff(object : DiffUtil.Callback() {
        //     override fun getOldListSize() = oldList.size
        //     override fun getNewListSize() = newList.size
        //     override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int) =
        //         oldList[oldItemPosition] == newList[newItemPosition]
        //     override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int) =
        //         oldList[oldItemPosition] == newList[newItemPosition]
        // })
        // adapter.updateList(newList)
        // diffResult.dispatchUpdatesTo(adapter)
    }
    // [AID_END: diffutil]`
        }
    },

    // 62. Image Compression
    image_compress: {
        label: "Image Compression",
        description: "Compress image to reduce file size.",
        java: {
            imports: [
                "android.graphics.Bitmap",
                "android.graphics.BitmapFactory",
                "java.io.ByteArrayOutputStream",
                "java.io.File",
                "java.io.FileOutputStream"
            ],
            methods: `
    // [AID_START: image_compress]
    private File compressImage(File originalFile, int quality) {
        try {
            Bitmap bitmap = BitmapFactory.decodeFile(originalFile.getAbsolutePath());
            File compressedFile = new File(getExternalFilesDir(null), "compressed_" + originalFile.getName());
            
            FileOutputStream fos = new FileOutputStream(compressedFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, quality, fos);
            fos.close();
            
            return compressedFile;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    // [AID_END: image_compress]`
        },
        kotlin: {
            imports: [
                "android.graphics.Bitmap",
                "android.graphics.BitmapFactory",
                "java.io.File",
                "java.io.FileOutputStream"
            ],
            methods: `
    // [AID_START: image_compress]
    private fun compressImage(originalFile: File, quality: Int): File? {
        return try {
            val bitmap = BitmapFactory.decodeFile(originalFile.absolutePath)
            val compressedFile = File(getExternalFilesDir(null), "compressed_\${originalFile.name}")
            
            FileOutputStream(compressedFile).use { fos ->
                bitmap.compress(Bitmap.CompressFormat.JPEG, quality, fos)
            }
            
            compressedFile
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    // [AID_END: image_compress]`
        }
    },

    // 63. Notification with Actions
    notification_actions: {
        label: "Notification with Actions",
        description: "Show notification with action buttons.",
        java: {
            imports: [
                "android.app.NotificationChannel",
                "android.app.NotificationManager",
                "android.app.PendingIntent",
                "android.content.Intent",
                "android.os.Build",
                "androidx.core.app.NotificationCompat"
            ],
            methods: `
    // [AID_START: notification_actions]
    private void showNotificationWithActions(String title, String message) {
        String channelId = "action_channel";
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                channelId, "Action Notifications", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }
        
        Intent acceptIntent = new Intent(this, MainActivity.class);
        acceptIntent.putExtra("action", "accept");
        PendingIntent acceptPendingIntent = PendingIntent.getActivity(this, 0, acceptIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .addAction(android.R.drawable.ic_input_add, "Accept", acceptPendingIntent)
            .addAction(android.R.drawable.ic_delete, "Decline", null)
            .setAutoCancel(true);
        
        notificationManager.notify(2, builder.build());
    }
    // [AID_END: notification_actions]`
        },
        kotlin: {
            imports: [
                "android.app.NotificationChannel",
                "android.app.NotificationManager",
                "android.app.PendingIntent",
                "android.content.Intent",
                "android.os.Build",
                "androidx.core.app.NotificationCompat"
            ],
            methods: `
    // [AID_START: notification_actions]
    private fun showNotificationWithActions(title: String, message: String) {
        val channelId = "action_channel"
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId, "Action Notifications", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }
        
        val acceptIntent = Intent(this, MainActivity::class.java).apply {
            putExtra("action", "accept")
        }
        val acceptPendingIntent = PendingIntent.getActivity(this, 0, acceptIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        
        val builder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .addAction(android.R.drawable.ic_input_add, "Accept", acceptPendingIntent)
            .addAction(android.R.drawable.ic_delete, "Decline", null)
            .setAutoCancel(true)
        
        notificationManager.notify(2, builder.build())
    }
    // [AID_END: notification_actions]`
        }
    },

    // 64. Download File with Progress
    download_file: {
        label: "Download File with Progress",
        description: "Download file from URL with progress tracking.",
        java: {
            imports: [
                "java.io.File",
                "java.io.FileOutputStream",
                "java.io.InputStream",
                "java.net.URL",
                "java.net.HttpURLConnection"
            ],
            methods: `
    // [AID_START: download_file]
    private void downloadFile(String fileUrl, String fileName) {
        new Thread(() -> {
            try {
                URL url = new URL(fileUrl);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.connect();
                
                int fileLength = connection.getContentLength();
                InputStream input = connection.getInputStream();
                
                File outputFile = new File(getExternalFilesDir(null), fileName);
                FileOutputStream output = new FileOutputStream(outputFile);
                
                byte[] buffer = new byte[4096];
                int total = 0;
                int count;
                
                while ((count = input.read(buffer)) != -1) {
                    total += count;
                    int progress = (int) ((total * 100) / fileLength);
                    // Update progress UI
                    output.write(buffer, 0, count);
                }
                
                output.close();
                input.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
    // [AID_END: download_file]`
        },
        kotlin: {
            imports: [
                "kotlinx.coroutines.Dispatchers",
                "kotlinx.coroutines.withContext",
                "androidx.lifecycle.lifecycleScope",
                "kotlinx.coroutines.launch",
                "java.io.File",
                "java.io.FileOutputStream",
                "java.net.URL"
            ],
            methods: `
    // [AID_START: download_file]
    private fun downloadFile(fileUrl: String, fileName: String) {
        lifecycleScope.launch(Dispatchers.IO) {
            try {
                val url = URL(fileUrl)
                val connection = url.openConnection()
                connection.connect()
                
                val fileLength = connection.contentLength
                val input = connection.getInputStream()
                
                val outputFile = File(getExternalFilesDir(null), fileName)
                val output = FileOutputStream(outputFile)
                
                val buffer = ByteArray(4096)
                var total = 0
                var count: Int
                
                while (input.read(buffer).also { count = it } != -1) {
                    total += count
                    val progress = (total * 100 / fileLength)
                    // Update progress UI on main thread
                    output.write(buffer, 0, count)
                }
                
                output.close()
                input.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    // [AID_END: download_file]`
        }
    },

    // 65. Pull-to-Refresh with Custom Colors
    swipe_refresh_custom: {
        label: "Custom SwipeRefresh Colors",
        description: "SwipeRefreshLayout with custom color scheme.",
        java: {
            imports: [
                "androidx.swiperefreshlayout.widget.SwipeRefreshLayout",
                "android.graphics.Color"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: swipe_refresh_custom]
        SwipeRefreshLayout swipeRefresh = findViewById(R.id.swipeRefreshLayout);
        swipeRefresh.setColorSchemeColors(
            Color.RED, Color.GREEN, Color.BLUE, Color.YELLOW
        );
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.WHITE);
        swipeRefresh.setOnRefreshListener(() -> {
            // Refresh logic
            swipeRefresh.setRefreshing(false);
        });
        // [AID_END: swipe_refresh_custom]`
                }
            }
        },
        kotlin: {
            imports: [
                "androidx.swiperefreshlayout.widget.SwipeRefreshLayout",
                "android.graphics.Color"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: swipe_refresh_custom]
        val swipeRefresh = findViewById<SwipeRefreshLayout>(R.id.swipeRefreshLayout)
        swipeRefresh.setColorSchemeColors(
            Color.RED, Color.GREEN, Color.BLUE, Color.YELLOW
        )
        swipeRefresh.setProgressBackgroundColorSchemeColor(Color.WHITE)
        swipeRefresh.setOnRefreshListener {
            // Refresh logic
            swipeRefresh.isRefreshing = false
        }
        // [AID_END: swipe_refresh_custom]`
                }
            }
        }
    },

    // 66. Image Picker with Multiple Selection
    image_picker_multiple: {
        label: "Multiple Image Picker",
        description: "Pick multiple images from gallery.",
        java: {
            imports: [
                "android.content.Intent",
                "android.net.Uri",
                "android.provider.MediaStore",
                "androidx.activity.result.ActivityResultLauncher",
                "androidx.activity.result.contract.ActivityResultContracts",
                "java.util.ArrayList"
            ],
            fields: `private ActivityResultLauncher<Intent> multipleImagePickerLauncher;`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: multiple_image_picker]
        multipleImagePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    if (result.getData().getClipData() != null) {
                        int count = result.getData().getClipData().getItemCount();
                        for (int i = 0; i < count; i++) {
                            Uri imageUri = result.getData().getClipData().getItemAt(i).getUri();
                            // Process each image
                        }
                    }
                }
            }
        );
        // [AID_END: multiple_image_picker]`
                }
            },
            methods: `
    // [AID_START: open_multiple_picker]
    private void openMultipleImagePicker() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        multipleImagePickerLauncher.launch(intent);
    }
    // [AID_END: open_multiple_picker]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.net.Uri",
                "androidx.activity.result.ActivityResultLauncher",
                "androidx.activity.result.contract.ActivityResultContracts"
            ],
            fields: `private lateinit var multipleImagePickerLauncher: ActivityResultLauncher<Intent>`,
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: multiple_image_picker]
        multipleImagePickerLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            if (result.resultCode == RESULT_OK && result.data != null) {
                result.data?.clipData?.let { clipData ->
                    for (i in 0 until clipData.itemCount) {
                        val imageUri = clipData.getItemAt(i).uri
                        // Process each image
                    }
                }
            }
        }
        // [AID_END: multiple_image_picker]`
                }
            },
            methods: `
    // [AID_START: open_multiple_picker]
    private fun openMultipleImagePicker() {
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "image/*"
            putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        }
        multipleImagePickerLauncher.launch(intent)
    }
    // [AID_END: open_multiple_picker]`
        }
    },

    // 67. Battery Status
    battery_status: {
        label: "Check Battery Status",
        description: "Get current battery level and charging status.",
        java: {
            imports: [
                "android.content.Intent",
                "android.content.IntentFilter",
                "android.os.BatteryManager"
            ],
            methods: `
    // [AID_START: battery_status]
    private int getBatteryLevel() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = registerReceiver(null, ifilter);
        
        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = batteryStatus.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        
        return (int) ((level / (float) scale) * 100);
    }
    
    private boolean isCharging() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = registerReceiver(null, ifilter);
        
        int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
        return status == BatteryManager.BATTERY_STATUS_CHARGING ||
               status == BatteryManager.BATTERY_STATUS_FULL;
    }
    // [AID_END: battery_status]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.content.IntentFilter",
                "android.os.BatteryManager"
            ],
            methods: `
    // [AID_START: battery_status]
    private fun getBatteryLevel(): Int {
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus = registerReceiver(null, ifilter)
        
        val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
        val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, -1) ?: -1
        
        return ((level / scale.toFloat()) * 100).toInt()
    }
    
    private fun isCharging(): Boolean {
        val ifilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        val batteryStatus = registerReceiver(null, ifilter)
        
        val status = batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        return status == BatteryManager.BATTERY_STATUS_CHARGING ||
               status == BatteryManager.BATTERY_STATUS_FULL
    }
    // [AID_END: battery_status]`
        }
    },

    // 68. Screen Brightness Control
    screen_brightness: {
        label: "Control Screen Brightness",
        description: "Get and set screen brightness.",
        java: {
            imports: [
                "android.provider.Settings",
                "android.view.WindowManager"
            ],
            methods: `
    // [AID_START: screen_brightness]
    private void setScreenBrightness(float brightness) {
        WindowManager.LayoutParams layoutParams = getWindow().getAttributes();
        layoutParams.screenBrightness = brightness; // 0.0f to 1.0f
        getWindow().setAttributes(layoutParams);
    }
    
    private float getScreenBrightness() {
        try {
            return Settings.System.getInt(
                getContentResolver(), 
                Settings.System.SCREEN_BRIGHTNESS
            ) / 255.0f;
        } catch (Settings.SettingNotFoundException e) {
            return 0.5f;
        }
    }
    // [AID_END: screen_brightness]`
        },
        kotlin: {
            imports: [
                "android.provider.Settings",
                "android.view.WindowManager"
            ],
            methods: `
    // [AID_START: screen_brightness]
    private fun setScreenBrightness(brightness: Float) {
        val layoutParams = window.attributes
        layoutParams.screenBrightness = brightness // 0.0f to 1.0f
        window.attributes = layoutParams
    }
    
    private fun getScreenBrightness(): Float {
        return try {
            Settings.System.getInt(
                contentResolver, 
                Settings.System.SCREEN_BRIGHTNESS
            ) / 255.0f
        } catch (e: Settings.SettingNotFoundException) {
            0.5f
        }
    }
    // [AID_END: screen_brightness]`
        }
    },

    // 69. Network Speed Monitor
    network_speed: {
        label: "Network Speed Monitor",
        description: "Monitor network upload/download speed.",
        java: {
            imports: [
                "android.net.TrafficStats"
            ],
            fields: `
    private long lastTotalRxBytes = 0;
    private long lastTotalTxBytes = 0;
    private long lastTimeStamp = 0;`,
            methods: `
    // [AID_START: network_speed]
    private void calculateNetworkSpeed() {
        long currentRxBytes = TrafficStats.getTotalRxBytes();
        long currentTxBytes = TrafficStats.getTotalTxBytes();
        long currentTime = System.currentTimeMillis();
        
        if (lastTimeStamp != 0) {
            long timeDiff = currentTime - lastTimeStamp;
            long downloadSpeed = ((currentRxBytes - lastTotalRxBytes) * 1000) / timeDiff; // bytes per second
            long uploadSpeed = ((currentTxBytes - lastTotalTxBytes) * 1000) / timeDiff;
            
            // Convert to KB/s or MB/s
            double downloadKBps = downloadSpeed / 1024.0;
            double uploadKBps = uploadSpeed / 1024.0;
        }
        
        lastTotalRxBytes = currentRxBytes;
        lastTotalTxBytes = currentTxBytes;
        lastTimeStamp = currentTime;
    }
    // [AID_END: network_speed]`
        },
        kotlin: {
            imports: [
                "android.net.TrafficStats"
            ],
            fields: `
    private var lastTotalRxBytes = 0L
    private var lastTotalTxBytes = 0L
    private var lastTimeStamp = 0L`,
            methods: `
    // [AID_START: network_speed]
    private fun calculateNetworkSpeed() {
        val currentRxBytes = TrafficStats.getTotalRxBytes()
        val currentTxBytes = TrafficStats.getTotalTxBytes()
        val currentTime = System.currentTimeMillis()
        
        if (lastTimeStamp != 0L) {
            val timeDiff = currentTime - lastTimeStamp
            val downloadSpeed = ((currentRxBytes - lastTotalRxBytes) * 1000) / timeDiff
            val uploadSpeed = ((currentTxBytes - lastTotalTxBytes) * 1000) / timeDiff
            
            val downloadKBps = downloadSpeed / 1024.0
            val uploadKBps = uploadSpeed / 1024.0
        }
        
        lastTotalRxBytes = currentRxBytes
        lastTotalTxBytes = currentTxBytes
        lastTimeStamp = currentTime
    }
    // [AID_END: network_speed]`
        }
    },

    // 70. QR Code Generator
    qr_generator: {
        label: "QR Code Generator",
        description: "Generate QR code from text.",
        java: {
            imports: [
                "com.google.zxing.BarcodeFormat",
                "com.google.zxing.MultiFormatWriter",
                "com.google.zxing.common.BitMatrix",
                "android.graphics.Bitmap",
                "android.graphics.Color"
            ],
            methods: `
    // [AID_START: qr_generator]
    private Bitmap generateQRCode(String text, int width, int height) {
        try {
            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                text, BarcodeFormat.QR_CODE, width, height
            );
            
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    bitmap.setPixel(x, y, bitMatrix.get(x, y) ? Color.BLACK : Color.WHITE);
                }
            }
            return bitmap;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    // [AID_END: qr_generator]`
        },
        kotlin: {
            imports: [
                "com.google.zxing.BarcodeFormat",
                "com.google.zxing.MultiFormatWriter",
                "com.google.zxing.common.BitMatrix",
                "android.graphics.Bitmap",
                "android.graphics.Color"
            ],
            methods: `
    // [AID_START: qr_generator]
    private fun generateQRCode(text: String, width: Int, height: Int): Bitmap? {
        return try {
            val bitMatrix = MultiFormatWriter().encode(
                text, BarcodeFormat.QR_CODE, width, height
            )
            
            val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565)
            for (x in 0 until width) {
                for (y in 0 until height) {
                    bitmap.setPixel(x, y, if (bitMatrix[x, y]) Color.BLACK else Color.WHITE)
                }
            }
            bitmap
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
    // [AID_END: qr_generator]`
        }
    },

    // 71. PDF Viewer
    pdf_viewer: {
        label: "PDF Viewer",
        description: "Display PDF file in app.",
        java: {
            imports: [
                "com.github.barteksc.pdfviewer.PDFView"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: pdf_viewer]
        PDFView pdfView = findViewById(R.id.pdfView);
        pdfView.fromAsset("sample.pdf").load();
        // Or from file: pdfView.fromFile(file).load();
        // Or from URI: pdfView.fromUri(uri).load();
        // [AID_END: pdf_viewer]`
                }
            }
        },
        kotlin: {
            imports: [
                "com.github.barteksc.pdfviewer.PDFView"
            ],
            lifecycle: {
                onCreate: {
                    position: "after_setContentView",
                    code: `
        // [AID_START: pdf_viewer]
        val pdfView = findViewById<PDFView>(R.id.pdfView)
        pdfView.fromAsset("sample.pdf").load()
        // Or from file: pdfView.fromFile(file).load()
        // Or from URI: pdfView.fromUri(uri).load()
        // [AID_END: pdf_viewer]`
                }
            }
        },
        files: [
            {
                path: "{res}/layout/activity_main.xml",
                action: "inject_xml",
                content: `
    <com.github.barteksc.pdfviewer.PDFView
        android:id="@+id/pdfView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />`
            }
        ]
    },

    // 72. In-App Review
    in_app_review: {
        label: "In-App Review",
        description: "Request app review without leaving the app.",
        java: {
            imports: [
                "com.google.android.play.core.review.ReviewInfo",
                "com.google.android.play.core.review.ReviewManager",
                "com.google.android.play.core.review.ReviewManagerFactory"
            ],
            methods: `
    // [AID_START: in_app_review]
    private void requestInAppReview() {
        ReviewManager reviewManager = ReviewManagerFactory.create(this);
        
        reviewManager.requestReviewFlow().addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                ReviewInfo reviewInfo = task.getResult();
                reviewManager.launchReviewFlow(this, reviewInfo).addOnCompleteListener(reviewTask -> {
                    // Review flow finished
                });
            }
        });
    }
    // [AID_END: in_app_review]`
        },
        kotlin: {
            imports: [
                "com.google.android.play.core.review.ReviewManagerFactory"
            ],
            methods: `
    // [AID_START: in_app_review]
    private fun requestInAppReview() {
        val reviewManager = ReviewManagerFactory.create(this)
        
        reviewManager.requestReviewFlow().addOnCompleteListener { task ->
            if (task.isSuccessful) {
                val reviewInfo = task.result
                reviewManager.launchReviewFlow(this, reviewInfo).addOnCompleteListener {
                    // Review flow finished
                }
            }
        }
    }
    // [AID_END: in_app_review]`
        }
    },

    // 73. App Update Manager
    app_update_check: {
        label: "Check for App Updates",
        description: "Check and prompt for app updates from Play Store.",
        java: {
            imports: [
                "com.google.android.play.core.appupdate.AppUpdateManager",
                "com.google.android.play.core.appupdate.AppUpdateManagerFactory",
                "com.google.android.play.core.install.model.AppUpdateType",
                "com.google.android.play.core.install.model.UpdateAvailability"
            ],
            methods: `
    // [AID_START: app_update]
    private void checkForAppUpdate() {
        AppUpdateManager appUpdateManager = AppUpdateManagerFactory.create(this);
        
        appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                // Request update
                try {
                    appUpdateManager.startUpdateFlowForResult(
                        appUpdateInfo,
                        AppUpdateType.IMMEDIATE,
                        this,
                        123
                    );
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
    // [AID_END: app_update]`
        },
        kotlin: {
            imports: [
                "com.google.android.play.core.appupdate.AppUpdateManagerFactory",
                "com.google.android.play.core.install.model.AppUpdateType",
                "com.google.android.play.core.install.model.UpdateAvailability"
            ],
            methods: `
    // [AID_START: app_update]
    private fun checkForAppUpdate() {
        val appUpdateManager = AppUpdateManagerFactory.create(this)
        
        appUpdateManager.appUpdateInfo.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                try {
                    appUpdateManager.startUpdateFlowForResult(
                        appUpdateInfo,
                        AppUpdateType.IMMEDIATE,
                        this,
                        123
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
        }
    }
    // [AID_END: app_update]`
        }
    },

    // 74. Screenshot Capture
    screenshot_capture: {
        label: "Capture Screenshot",
        description: "Take screenshot of current screen.",
        java: {
            imports: [
                "android.graphics.Bitmap",
                "android.view.View",
                "java.io.File",
                "java.io.FileOutputStream"
            ],
            methods: `
    // [AID_START: screenshot]
    private void captureScreenshot() {
        View rootView = getWindow().getDecorView().getRootView();
        rootView.setDrawingCacheEnabled(true);
        Bitmap bitmap = Bitmap.createBitmap(rootView.getDrawingCache());
        rootView.setDrawingCacheEnabled(false);
        
        File file = new File(getExternalFilesDir(null), "screenshot.png");
        try {
            FileOutputStream fos = new FileOutputStream(file);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    // [AID_END: screenshot]`
        },
        kotlin: {
            imports: [
                "android.graphics.Bitmap",
                "android.view.View",
                "java.io.File",
                "java.io.FileOutputStream"
            ],
            methods: `
    // [AID_START: screenshot]
    private fun captureScreenshot() {
        val rootView = window.decorView.rootView
        rootView.isDrawingCacheEnabled = true
        val bitmap = Bitmap.createBitmap(rootView.drawingCache)
        rootView.isDrawingCacheEnabled = false
        
        val file = File(getExternalFilesDir(null), "screenshot.png")
        try {
            FileOutputStream(file).use { fos ->
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    // [AID_END: screenshot]`
        }
    },

    // 75. Rate Limiter
    rate_limiter: {
        label: "Rate Limiter",
        description: "Limit action execution frequency.",
        java: {
            fields: `private long lastClickTime = 0;`,
            methods: `
    // [AID_START: rate_limiter]
    private boolean isClickAllowed(long minInterval) {
        long currentTime = System.currentTimeMillis();
        if (currentTime - lastClickTime < minInterval) {
            return false;
        }
        lastClickTime = currentTime;
        return true;
    }
    
    private void handleButtonClick() {
        if (isClickAllowed(1000)) { // 1 second interval
            // Perform action
        }
    }
    // [AID_END: rate_limiter]`
        },
        kotlin: {
            fields: `private var lastClickTime = 0L`,
            methods: `
    // [AID_START: rate_limiter]
    private fun isClickAllowed(minInterval: Long): Boolean {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastClickTime < minInterval) {
            return false
        }
        lastClickTime = currentTime
        return true
    }
    
    private fun handleButtonClick() {
        if (isClickAllowed(1000)) { // 1 second interval
            // Perform action
        }
    }
    // [AID_END: rate_limiter]`
        }
    },

    // 76. Email Intent
    send_email: {
        label: "Send Email",
        description: "Open email app with pre-filled data.",
        java: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            methods: `
    // [AID_START: send_email]
    private void sendEmail(String recipient, String subject, String body) {
        Intent emailIntent = new Intent(Intent.ACTION_SENDTO);
        emailIntent.setData(Uri.parse("mailto:"));
        emailIntent.putExtra(Intent.EXTRA_EMAIL, new String[]{recipient});
        emailIntent.putExtra(Intent.EXTRA_SUBJECT, subject);
        emailIntent.putExtra(Intent.EXTRA_TEXT, body);
        
        if (emailIntent.resolveActivity(getPackageManager()) != null) {
            startActivity(Intent.createChooser(emailIntent, "Send Email"));
        }
    }
    // [AID_END: send_email]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            methods: `
    // [AID_START: send_email]
    private fun sendEmail(recipient: String, subject: String, body: String) {
        val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
            data = Uri.parse("mailto:")
            putExtra(Intent.EXTRA_EMAIL, arrayOf(recipient))
            putExtra(Intent.EXTRA_SUBJECT, subject)
            putExtra(Intent.EXTRA_TEXT, body)
        }
        
        if (emailIntent.resolveActivity(packageManager) != null) {
            startActivity(Intent.createChooser(emailIntent, "Send Email"))
        }
    }
    // [AID_END: send_email]`
        }
    },

    // 77. Open Google Maps
    open_maps: {
        label: "Open Google Maps",
        description: "Open Google Maps with location or directions.",
        java: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            methods: `
    // [AID_START: open_maps]
    private void openMapsWithLocation(double latitude, double longitude, String label) {
        Uri gmmIntentUri = Uri.parse("geo:" + latitude + "," + longitude + "?q=" + latitude + "," + longitude + "(" + label + ")");
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");
        
        if (mapIntent.resolveActivity(getPackageManager()) != null) {
            startActivity(mapIntent);
        }
    }
    
    private void openMapsDirections(String origin, String destination) {
        Uri gmmIntentUri = Uri.parse("https://www.google.com/maps/dir/?api=1&origin=" + origin + "&destination=" + destination);
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");
        startActivity(mapIntent);
    }
    // [AID_END: open_maps]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.net.Uri"
            ],
            methods: `
    // [AID_START: open_maps]
    private fun openMapsWithLocation(latitude: Double, longitude: Double, label: String) {
        val gmmIntentUri = Uri.parse("geo:$latitude,$longitude?q=$latitude,$longitude($label)")
        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
        mapIntent.setPackage("com.google.android.apps.maps")
        
        if (mapIntent.resolveActivity(packageManager) != null) {
            startActivity(mapIntent)
        }
    }
    
    private fun openMapsDirections(origin: String, destination: String) {
        val gmmIntentUri = Uri.parse("https://www.google.com/maps/dir/?api=1&origin=$origin&destination=$destination")
        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
        mapIntent.setPackage("com.google.android.apps.maps")
        startActivity(mapIntent)
    }
    // [AID_END: open_maps]`
        }
    },
    // ============================================================
    // 👨‍💻 DEVELOPER MODE & DEBUGGING TOOLS
    // ============================================================

    // 78. Check Developer Options
    check_dev_mode: {
        label: "Check Developer Mode",
        description: "Check if Developer Options are enabled on device.",
        java: {
            imports: [
                "android.provider.Settings",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: check_dev_mode]
    private boolean isDevModeEnabled(Context context) {
        int devOptions = Settings.Secure.getInt(
            context.getContentResolver(), 
            Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0
        );
        return devOptions == 1;
    }
    // [AID_END: check_dev_mode]`
        },
        kotlin: {
            imports: [
                "android.provider.Settings",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: check_dev_mode]
    private fun isDevModeEnabled(context: Context): Boolean {
        val devOptions = Settings.Secure.getInt(
            context.contentResolver, 
            Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0
        )
        return devOptions == 1
    }
    // [AID_END: check_dev_mode]`
        }
    },

    // 79. Check USB Debugging
    check_usb_debug: {
        label: "Check USB Debugging",
        description: "Check if USB Debugging (ADB) is enabled.",
        java: {
            imports: [
                "android.provider.Settings",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: check_adb]
    private boolean isUsbDebuggingEnabled(Context context) {
        int adb = Settings.Global.getInt(
            context.getContentResolver(), 
            Settings.Global.ADB_ENABLED, 0
        );
        return adb == 1;
    }
    // [AID_END: check_adb]`
        },
        kotlin: {
            imports: [
                "android.provider.Settings",
                "android.content.Context"
            ],
            methods: `
    // [AID_START: check_adb]
    private fun isUsbDebuggingEnabled(context: Context): Boolean {
        val adb = Settings.Global.getInt(
            context.contentResolver, 
            Settings.Global.ADB_ENABLED, 0
        )
        return adb == 1
    }
    // [AID_END: check_adb]`
        }
    },

    // 80. Open Developer Settings
    open_dev_settings: {
        label: "Open Developer Settings",
        description: "Open the Developer Options screen directly.",
        java: {
            imports: [
                "android.content.Intent",
                "android.provider.Settings"
            ],
            methods: `
    // [AID_START: open_dev_settings]
    private void openDeveloperSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS);
        if (intent.resolveActivity(getPackageManager()) != null) {
            startActivity(intent);
        }
    }
    // [AID_END: open_dev_settings]`
        },
        kotlin: {
            imports: [
                "android.content.Intent",
                "android.provider.Settings"
            ],
            methods: `
    // [AID_START: open_dev_settings]
    private fun openDeveloperSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DEVELOPMENT_SETTINGS)
        if (intent.resolveActivity(packageManager) != null) {
            startActivity(intent)
        }
    }
    // [AID_END: open_dev_settings]`
        }
    },

    // 81. Strict Mode (Debugging)
    strict_mode_enable: {
        label: "Enable Strict Mode",
        description: "Enable StrictMode to detect main thread violations.",
        java: {
            imports: [
                "android.os.StrictMode"
            ],
            lifecycle: {
                onCreate: {
                    position: "before_super",
                    code: `
        // [AID_START: strict_mode]
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build());
            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                    .detectLeakedSqlLiteObjects()
                    .detectLeakedClosableObjects()
                    .penaltyLog()
                    .build());
        }
        // [AID_END: strict_mode]`
                }
            }
        },
        kotlin: {
            imports: [
                "android.os.StrictMode"
            ],
            lifecycle: {
                onCreate: {
                    position: "before_super",
                    code: `
        // [AID_START: strict_mode]
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(StrictMode.ThreadPolicy.Builder()
                    .detectAll()
                    .penaltyLog()
                    .build())
            StrictMode.setVmPolicy(StrictMode.VmPolicy.Builder()
                    .detectLeakedSqlLiteObjects()
                    .detectLeakedClosableObjects()
                    .penaltyLog()
                    .build())
        }
        // [AID_END: strict_mode]`
                }
            }
        }
    } ,
    
    // 82. Flashlight (Torch) Control
    flashlight_control: {
        label: "Flashlight Control",
        description: "Turn the device flashlight on or off.",
        java: {
            imports: [
                "android.content.Context",
                "android.hardware.camera2.CameraManager",
                "android.os.Build"
            ],
            methods: `
    // [AID_START: flashlight]
    private void toggleFlashlight(boolean enable) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            CameraManager camManager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
            try {
                String cameraId = camManager.getCameraIdList()[0];
                camManager.setTorchMode(cameraId, enable);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    // [AID_END: flashlight]`
        },
        kotlin: {
            imports: [
                "android.content.Context",
                "android.hardware.camera2.CameraManager",
                "android.os.Build"
            ],
            methods: `
    // [AID_START: flashlight]
    private fun toggleFlashlight(enable: Boolean) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val camManager = getSystemService(Context.CAMERA_SERVICE) as CameraManager
            try {
                val cameraId = camManager.cameraIdList[0]
                camManager.setTorchMode(cameraId, enable)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    // [AID_END: flashlight]`
        }
    }

};