// templates/fullscreen_views_activity/files.js

export const fullscreenViewsFiles = {
  // 1. Activity Fullscreen Layout
  activityFullscreen: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/black"
    tools:context=".FullscreenActivity">

    <VideoView
        android:id="@+id/fullscreen_content"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_gravity="center" />

    <FrameLayout
        android:id="@+id/fullscreen_content_controls"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fitsSystemWindows="true">

        <LinearLayout
            android:id="@+id/fullscreen_top_controls"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_gravity="top"
            android:background="@drawable/fullscreen_controls_bg"
            android:orientation="vertical"
            android:padding="16dp">

            <TextView
                android:id="@+id/fullscreen_title"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Fullscreen Video"
                android:textColor="#FFFFFF"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/fullscreen_subtitle"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:text="Tap to toggle controls"
                android:textColor="#CCCCCC"
                android:textSize="14sp" />

        </LinearLayout>

        <LinearLayout
            android:id="@+id/fullscreen_bottom_controls"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_gravity="bottom"
            android:background="@drawable/fullscreen_controls_bg"
            android:orientation="horizontal"
            android:padding="16dp"
            android:gravity="center">

            <ImageButton
                android:id="@+id/play_pause_button"
                android:layout_width="48dp"
                android:layout_height="48dp"
                android:background="?attr/selectableItemBackgroundBorderless"
                android:contentDescription="Play/Pause"
                android:src="@android:drawable/ic_media_play"
                android:tint="#FFFFFF" />

            <SeekBar
                android:id="@+id/seek_bar"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:layout_marginStart="16dp"
                android:layout_marginEnd="16dp" />

            <TextView
                android:id="@+id/time_text"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="0:00"
                android:textColor="#FFFFFF"
                android:textSize="14sp" />

        </LinearLayout>

    </FrameLayout>

</FrameLayout>`,

  // 2. Controls Background Gradient
  fullscreenControlsBg: `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <gradient
        android:angle="90"
        android:endColor="#00000000"
        android:startColor="#99000000"
        android:type="linear" />
</shape>`,

  // 3. Fullscreen Theme
  fullscreenTheme: `<resources>
    <style name="Theme.Fullscreen" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
    </style>
</resources>`,

  // 4. FullscreenActivity - Java
  fullscreenActivityJava: (pkgName) => `package ${pkgName};

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.widget.ImageButton;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.VideoView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.ActionBar;

public class FullscreenActivity extends AppCompatActivity {

    private static final int UI_ANIMATION_DELAY = 300;
    private static final int AUTO_HIDE_DELAY_MILLIS = 3000;

    private View mContentView;
    private View mControlsView;
    private boolean mVisible;
    private Handler mHideHandler = new Handler(Looper.myLooper());

    private final Runnable mHidePart2Runnable = new Runnable() {
        @SuppressLint("InlinedApi")
        @Override
        public void run() {
            if (android.os.Build.VERSION.SDK_INT >= 30) {
                mContentView.getWindowInsetsController().hide(
                    WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                mContentView.getWindowInsetsController().setSystemBarsBehavior(
                    WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            } else {
                mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LOW_PROFILE
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
            }
        }
    };

    private final Runnable mShowPart2Runnable = new Runnable() {
        @Override
        public void run() {
            ActionBar actionBar = getSupportActionBar();
            if (actionBar != null) {
                actionBar.show();
            }
            mControlsView.setVisibility(View.VISIBLE);
        }
    };

    private final Runnable mHideRunnable = new Runnable() {
        @Override
        public void run() {
            hide();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fullscreen);

        mVisible = true;
        mControlsView = findViewById(R.id.fullscreen_content_controls);
        mContentView = findViewById(R.id.fullscreen_content);

        // Set up touch listener to toggle UI visibility
        mContentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                toggle();
            }
        });

        // Setup controls
        setupControls();
    }

    private void setupControls() {
        ImageButton playPauseButton = findViewById(R.id.play_pause_button);
        SeekBar seekBar = findViewById(R.id.seek_bar);
        TextView timeText = findViewById(R.id.time_text);

        playPauseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Toggle play/pause
                boolean isPlaying = playPauseButton.getTag() != null && 
                                  (boolean) playPauseButton.getTag();
                if (isPlaying) {
                    playPauseButton.setImageResource(android.R.drawable.ic_media_play);
                    playPauseButton.setTag(false);
                } else {
                    playPauseButton.setImageResource(android.R.drawable.ic_media_pause);
                    playPauseButton.setTag(true);
                }
            }
        });

        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                if (fromUser) {
                    // Update video position
                    int minutes = progress / 60;
                    int seconds = progress % 60;
                    timeText.setText(String.format("%d:%02d", minutes, seconds));
                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {}

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {}
        });
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        delayedHide(100);
    }

    private void toggle() {
        if (mVisible) {
            hide();
        } else {
            show();
        }
    }

    private void hide() {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        mControlsView.setVisibility(View.GONE);
        mVisible = false;

        mHideHandler.removeCallbacks(mShowPart2Runnable);
        mHideHandler.postDelayed(mHidePart2Runnable, UI_ANIMATION_DELAY);
    }

    private void show() {
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            mContentView.getWindowInsetsController().show(
                WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
        } else {
            mContentView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
        mVisible = true;

        mHideHandler.removeCallbacks(mHidePart2Runnable);
        mHideHandler.postDelayed(mShowPart2Runnable, UI_ANIMATION_DELAY);
        delayedHide(AUTO_HIDE_DELAY_MILLIS);
    }

    private void delayedHide(int delayMillis) {
        mHideHandler.removeCallbacks(mHideRunnable);
        mHideHandler.postDelayed(mHideRunnable, delayMillis);
    }
}
`,

  // 5. FullscreenActivity - Kotlin
  fullscreenActivityKt: (pkgName) => `package ${pkgName}

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.widget.ImageButton
import android.widget.SeekBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class FullscreenActivity : AppCompatActivity() {

    private lateinit var mContentView: View
    private lateinit var mControlsView: View
    private var mVisible: Boolean = false
    private val mHideHandler = Handler(Looper.myLooper()!!)

    private val mHidePart2Runnable = Runnable {
        if (Build.VERSION.SDK_INT >= 30) {
            mContentView.windowInsetsController?.let {
                it.hide(WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars())
                it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            @Suppress("DEPRECATION")
            mContentView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LOW_PROFILE
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION)
        }
    }

    private val mShowPart2Runnable = Runnable {
        supportActionBar?.show()
        mControlsView.visibility = View.VISIBLE
    }

    private val mHideRunnable = Runnable { hide() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_fullscreen)

        mVisible = true
        mControlsView = findViewById(R.id.fullscreen_content_controls)
        mContentView = findViewById(R.id.fullscreen_content)

        mContentView.setOnClickListener { toggle() }

        setupControls()
    }

    private fun setupControls() {
        val playPauseButton = findViewById<ImageButton>(R.id.play_pause_button)
        val seekBar = findViewById<SeekBar>(R.id.seek_bar)
        val timeText = findViewById<TextView>(R.id.time_text)

        playPauseButton.setOnClickListener {
            val isPlaying = it.tag as? Boolean ?: false
            if (isPlaying) {
                playPauseButton.setImageResource(android.R.drawable.ic_media_play)
                it.tag = false
            } else {
                playPauseButton.setImageResource(android.R.drawable.ic_media_pause)
                it.tag = true
            }
        }

        seekBar.setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                if (fromUser) {
                    val minutes = progress / 60
                    val seconds = progress % 60
                    timeText.text = String.format("%d:%02d", minutes, seconds)
                }
            }

            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
    }

    override fun onPostCreate(savedInstanceState: Bundle?) {
        super.onPostCreate(savedInstanceState)
        delayedHide(100)
    }

    private fun toggle() {
        if (mVisible) {
            hide()
        } else {
            show()
        }
    }

    private fun hide() {
        supportActionBar?.hide()
        mControlsView.visibility = View.GONE
        mVisible = false

        mHideHandler.removeCallbacks(mShowPart2Runnable)
        mHideHandler.postDelayed(mHidePart2Runnable, UI_ANIMATION_DELAY.toLong())
    }

    private fun show() {
        if (Build.VERSION.SDK_INT >= 30) {
            mContentView.windowInsetsController?.show(
                WindowInsets.Type.statusBars() or WindowInsets.Type.navigationBars()
            )
        } else {
            @Suppress("DEPRECATION")
            mContentView.systemUiVisibility = (View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION)
        }
        mVisible = true

        mHideHandler.removeCallbacks(mHidePart2Runnable)
        mHideHandler.postDelayed(mShowPart2Runnable, UI_ANIMATION_DELAY.toLong())
        delayedHide(AUTO_HIDE_DELAY_MILLIS)
    }

    private fun delayedHide(delayMillis: Int) {
        mHideHandler.removeCallbacks(mHideRunnable)
        mHideHandler.postDelayed(mHideRunnable, delayMillis.toLong())
    }

    companion object {
        private const val UI_ANIMATION_DELAY = 300
        private const val AUTO_HIDE_DELAY_MILLIS = 3000
    }
}
`,

  // 6. Updated AndroidManifest with fullscreen theme
  androidManifest: (pkgName) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App"
        tools:targetApi="31">

        <activity
            android:name=".FullscreenActivity"
            android:exported="true"
            android:configChanges="orientation|keyboardHidden|screenSize"
            android:label="@string/app_name"
            android:theme="@style/Theme.Fullscreen">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>`
};