// templates/login_views_activity/files.js

export const loginViewsFiles = {
  // 1. Login Activity Layout
  activityLogin: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true"
    android:background="?attr/colorPrimary">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="24dp">

        <ImageView
            android:id="@+id/logo"
            android:layout_width="120dp"
            android:layout_height="120dp"
            android:layout_marginTop="48dp"
            android:contentDescription="App Logo"
            android:src="@mipmap/ic_launcher"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <TextView
            android:id="@+id/title"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="Welcome Back"
            android:textColor="#FFFFFF"
            android:textSize="28sp"
            android:textStyle="bold"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/logo" />

        <TextView
            android:id="@+id/subtitle"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Sign in to continue"
            android:textColor="#E0E0E0"
            android:textSize="16sp"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/title" />

        <com.google.android.material.card.MaterialCardView
            android:id="@+id/login_card"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginTop="32dp"
            app:cardCornerRadius="16dp"
            app:cardElevation="8dp"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/subtitle">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="24dp">

                <com.google.android.material.textfield.TextInputLayout
                    android:id="@+id/email_layout"
                    style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="Email"
                    app:errorEnabled="true"
                    app:startIconDrawable="@android:drawable/ic_dialog_email">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/email_input"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textEmailAddress"
                        android:maxLines="1" />

                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:id="@+id/password_layout"
                    style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="16dp"
                    android:hint="Password"
                    app:endIconMode="password_toggle"
                    app:errorEnabled="true"
                    app:startIconDrawable="@android:drawable/ic_lock_lock">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/password_input"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPassword"
                        android:maxLines="1" />

                </com.google.android.material.textfield.TextInputLayout>

                <CheckBox
                    android:id="@+id/remember_me"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="Remember me" />

                <com.google.android.material.button.MaterialButton
                    android:id="@+id/login_button"
                    android:layout_width="match_parent"
                    android:layout_height="60dp"
                    android:layout_marginTop="24dp"
                    android:text="Sign In"
                    android:textSize="16sp"
                    app:cornerRadius="12dp" />

                <TextView
                    android:id="@+id/forgot_password"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_gravity="center"
                    android:layout_marginTop="16dp"
                    android:text="Forgot Password?"
                    android:textColor="?attr/colorPrimary"
                    android:textSize="14sp"
                    android:clickable="true"
                    android:focusable="true" />

            </LinearLayout>

        </com.google.android.material.card.MaterialCardView>

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:orientation="horizontal"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/login_card">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Don't have an account? "
                android:textColor="#E0E0E0"
                android:textSize="14sp" />

            <TextView
                android:id="@+id/sign_up"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Sign Up"
                android:textColor="#FFFFFF"
                android:textSize="14sp"
                android:textStyle="bold"
                android:clickable="true"
                android:focusable="true" />

        </LinearLayout>

        <ProgressBar
            android:id="@+id/progress_bar"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:visibility="gone"
            app:layout_constraintBottom_toBottomOf="@id/login_card"
            app:layout_constraintEnd_toEndOf="@id/login_card"
            app:layout_constraintStart_toStartOf="@id/login_card"
            app:layout_constraintTop_toTopOf="@id/login_card" />

    </androidx.constraintlayout.widget.ConstraintLayout>

</ScrollView>`,

  // 2. MainActivity (Home Screen after login)
  activityMain: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            app:popupTheme="@style/Theme.App" />

    </com.google.android.material.appbar.AppBarLayout>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <TextView
            android:id="@+id/welcome_text"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Welcome!"
            android:textSize="24sp"
            android:textStyle="bold"
            app:layout_constraintBottom_toTopOf="@id/user_email"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            app:layout_constraintVertical_chainStyle="packed" />

        <TextView
            android:id="@+id/user_email"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="user@example.com"
            android:textSize="16sp"
            app:layout_constraintBottom_toTopOf="@id/logout_button"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/welcome_text" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/logout_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:text="Logout"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/user_email" />

    </androidx.constraintlayout.widget.ConstraintLayout>

</androidx.coordinatorlayout.widget.CoordinatorLayout>`,

  // 3. LoginActivity - Java
  loginActivityJava: (pkgName) => `package ${pkgName};

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.CheckBox;
import android.widget.ProgressBar;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;

public class LoginActivity extends AppCompatActivity {

    private TextInputLayout emailLayout, passwordLayout;
    private TextInputEditText emailInput, passwordInput;
    private MaterialButton loginButton;
    private CheckBox rememberMe;
    private ProgressBar progressBar;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        prefs = getSharedPreferences("LoginPrefs", MODE_PRIVATE);

        // Check if already logged in
        if (prefs.getBoolean("isLoggedIn", false)) {
            navigateToMain();
            return;
        }

        initViews();
        setupListeners();
    }

    private void initViews() {
        emailLayout = findViewById(R.id.email_layout);
        passwordLayout = findViewById(R.id.password_layout);
        emailInput = findViewById(R.id.email_input);
        passwordInput = findViewById(R.id.password_input);
        loginButton = findViewById(R.id.login_button);
        rememberMe = findViewById(R.id.remember_me);
        progressBar = findViewById(R.id.progress_bar);

        // Load saved email if remember me was checked
        if (prefs.getBoolean("rememberMe", false)) {
            emailInput.setText(prefs.getString("email", ""));
            rememberMe.setChecked(true);
        }
    }

    private void setupListeners() {
        loginButton.setOnClickListener(v -> attemptLogin());

        TextView forgotPassword = findViewById(R.id.forgot_password);
        forgotPassword.setOnClickListener(v -> 
            Snackbar.make(v, "Forgot password clicked", Snackbar.LENGTH_SHORT).show()
        );

        TextView signUp = findViewById(R.id.sign_up);
        signUp.setOnClickListener(v -> 
            Snackbar.make(v, "Sign up clicked", Snackbar.LENGTH_SHORT).show()
        );
    }

    private void attemptLogin() {
        // Reset errors
        emailLayout.setError(null);
        passwordLayout.setError(null);

        String email = emailInput.getText().toString().trim();
        String password = passwordInput.getText().toString().trim();

        // Validate
        if (!validateEmail(email)) return;
        if (!validatePassword(password)) return;

        // Show progress
        setLoading(true);

        // Simulate network call (replace with actual authentication)
        loginButton.postDelayed(() -> {
            // Demo: Accept any valid email/password
            if (password.length() >= 6) {
                loginSuccess(email);
            } else {
                loginFailed("Invalid credentials");
            }
        }, 1500);
    }

    private boolean validateEmail(String email) {
        if (TextUtils.isEmpty(email)) {
            emailLayout.setError("Email is required");
            return false;
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailLayout.setError("Enter a valid email");
            return false;
        }
        return true;
    }

    private boolean validatePassword(String password) {
        if (TextUtils.isEmpty(password)) {
            passwordLayout.setError("Password is required");
            return false;
        }
        if (password.length() < 6) {
            passwordLayout.setError("Password must be at least 6 characters");
            return false;
        }
        return true;
    }

    private void loginSuccess(String email) {
        setLoading(false);

        // Save login state
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean("isLoggedIn", true);
        editor.putString("userEmail", email);
        
        if (rememberMe.isChecked()) {
            editor.putBoolean("rememberMe", true);
            editor.putString("email", email);
        } else {
            editor.putBoolean("rememberMe", false);
            editor.remove("email");
        }
        editor.apply();

        Snackbar.make(loginButton, "Login successful!", Snackbar.LENGTH_SHORT).show();
        
        navigateToMain();
    }

    private void loginFailed(String message) {
        setLoading(false);
        Snackbar.make(loginButton, message, Snackbar.LENGTH_LONG).show();
    }

    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        loginButton.setEnabled(!loading);
        emailInput.setEnabled(!loading);
        passwordInput.setEnabled(!loading);
    }

    private void navigateToMain() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
`,

  // 4. LoginActivity - Kotlin
  loginActivityKt: (pkgName) => `package ${pkgName}

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.util.Patterns
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import android.widget.CheckBox
import android.widget.ProgressBar
import android.widget.TextView

class LoginActivity : AppCompatActivity() {

    private lateinit var emailLayout: TextInputLayout
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var emailInput: TextInputEditText
    private lateinit var passwordInput: TextInputEditText
    private lateinit var loginButton: MaterialButton
    private lateinit var rememberMe: CheckBox
    private lateinit var progressBar: ProgressBar
    private lateinit var prefs: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        prefs = getSharedPreferences("LoginPrefs", Context.MODE_PRIVATE)

        // Check if already logged in
        if (prefs.getBoolean("isLoggedIn", false)) {
            navigateToMain()
            return
        }

        initViews()
        setupListeners()
    }

    private fun initViews() {
        emailLayout = findViewById(R.id.email_layout)
        passwordLayout = findViewById(R.id.password_layout)
        emailInput = findViewById(R.id.email_input)
        passwordInput = findViewById(R.id.password_input)
        loginButton = findViewById(R.id.login_button)
        rememberMe = findViewById(R.id.remember_me)
        progressBar = findViewById(R.id.progress_bar)

        // Load saved email if remember me was checked
        if (prefs.getBoolean("rememberMe", false)) {
            emailInput.setText(prefs.getString("email", ""))
            rememberMe.isChecked = true
        }
    }

    private fun setupListeners() {
        loginButton.setOnClickListener { attemptLogin() }

        findViewById<TextView>(R.id.forgot_password).setOnClickListener {
            Snackbar.make(it, "Forgot password clicked", Snackbar.LENGTH_SHORT).show()
        }

        findViewById<TextView>(R.id.sign_up).setOnClickListener {
            Snackbar.make(it, "Sign up clicked", Snackbar.LENGTH_SHORT).show()
        }
    }

    private fun attemptLogin() {
        // Reset errors
        emailLayout.error = null
        passwordLayout.error = null

        val email = emailInput.text.toString().trim()
        val password = passwordInput.text.toString().trim()

        // Validate
        if (!validateEmail(email)) return
        if (!validatePassword(password)) return

        // Show progress
        setLoading(true)

        // Simulate network call (replace with actual authentication)
        loginButton.postDelayed({
            // Demo: Accept any valid email/password
            if (password.length >= 6) {
                loginSuccess(email)
            } else {
                loginFailed("Invalid credentials")
            }
        }, 1500)
    }

    private fun validateEmail(email: String): Boolean {
        if (email.isEmpty()) {
            emailLayout.error = "Email is required"
            return false
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            emailLayout.error = "Enter a valid email"
            return false
        }
        return true
    }

    private fun validatePassword(password: String): Boolean {
        if (password.isEmpty()) {
            passwordLayout.error = "Password is required"
            return false
        }
        if (password.length < 6) {
            passwordLayout.error = "Password must be at least 6 characters"
            return false
        }
        return true
    }

    private fun loginSuccess(email: String) {
        setLoading(false)

        // Save login state
        prefs.edit().apply {
            putBoolean("isLoggedIn", true)
            putString("userEmail", email)
            
            if (rememberMe.isChecked) {
                putBoolean("rememberMe", true)
                putString("email", email)
            } else {
                putBoolean("rememberMe", false)
                remove("email")
            }
            apply()
        }

        Snackbar.make(loginButton, "Login successful!", Snackbar.LENGTH_SHORT).show()
        
        navigateToMain()
    }

    private fun loginFailed(message: String) {
        setLoading(false)
        Snackbar.make(loginButton, message, Snackbar.LENGTH_LONG).show()
    }

    private fun setLoading(loading: Boolean) {
        progressBar.visibility = if (loading) View.VISIBLE else View.GONE
        loginButton.isEnabled = !loading
        emailInput.isEnabled = !loading
        passwordInput.isEnabled = !loading
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
`,

  // 5. MainActivity - Java (Home screen)
  mainActivityJava: (pkgName) => `package ${pkgName};

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import com.google.android.material.button.MaterialButton;

public class MainActivity extends AppCompatActivity {

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences("LoginPrefs", MODE_PRIVATE);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        setTitle("Home");

        // Display user email
        TextView userEmail = findViewById(R.id.user_email);
        userEmail.setText(prefs.getString("userEmail", "user@example.com"));

        // Logout button
        MaterialButton logoutButton = findViewById(R.id.logout_button);
        logoutButton.setOnClickListener(v -> logout());
    }

    private void logout() {
        // Clear login state
        prefs.edit()
                .putBoolean("isLoggedIn", false)
                .remove("userEmail")
                .apply();

        // Navigate back to login
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
        finish();
    }
}
`,

  // 6. MainActivity - Kotlin (Home screen)
  mainActivityKt: (pkgName) => `package ${pkgName}

import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import com.google.android.material.button.MaterialButton

class MainActivity : AppCompatActivity() {

    private lateinit var prefs: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("LoginPrefs", Context.MODE_PRIVATE)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)
        title = "Home"

        // Display user email
        val userEmail = findViewById<TextView>(R.id.user_email)
        userEmail.text = prefs.getString("userEmail", "user@example.com")

        // Logout button
        val logoutButton = findViewById<MaterialButton>(R.id.logout_button)
        logoutButton.setOnClickListener { logout() }
    }

    private fun logout() {
        // Clear login state
        prefs.edit()
            .putBoolean("isLoggedIn", false)
            .remove("userEmail")
            .apply()

        // Navigate back to login
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }
}
`,

  // 7. Updated AndroidManifest - LoginActivity as launcher
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
            android:name=".LoginActivity"
            android:exported="true"
            android:theme="@style/Theme.App">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".MainActivity"
            android:exported="false"
            android:theme="@style/Theme.App" />

    </application>

</manifest>`
};