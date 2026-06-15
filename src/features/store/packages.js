export const PACKAGES = {
    // ==========================================
    // NETWORKING PACKAGES
    // ==========================================
    
    "retrofit_setup": {
        "retrofit2": {
            description: "Type-safe HTTP client for Android and Java by Square.",
            classes: [
                { name: "Retrofit", desc: "Main class to create API interfaces. Use Retrofit.Builder() to configure." },
                { name: "Retrofit.Builder", desc: "Builder to configure and create Retrofit instances." },
                { name: "Response", desc: "HTTP response containing status code, headers, and body." }
            ],
            interfaces: [
                { name: "Call", desc: "An invocation of a Retrofit method that sends a request to a webserver." },
                { name: "Callback", desc: "Communicates responses from a server or offline requests." },
                { name: "Converter.Factory", desc: "Creates converters for types." }
            ],
            sub_packages: {
                "http": {
                    description: "HTTP method and header annotations.",
                    annotations: [
                        { name: "GET", desc: "Make a GET request to a REST path relative to base URL." },
                        { name: "POST", desc: "Make a POST request." },
                        { name: "PUT", desc: "Make a PUT request." },
                        { name: "DELETE", desc: "Make a DELETE request." },
                        { name: "PATCH", desc: "Make a PATCH request." },
                        { name: "HEAD", desc: "Make a HEAD request." },
                        { name: "OPTIONS", desc: "Make an OPTIONS request." },
                        { name: "Query", desc: "Query parameter appended to the URL." },
                        { name: "Path", desc: "Named replacement in a URL path segment." },
                        { name: "Body", desc: "Use this object as the request body." },
                        { name: "Header", desc: "Replaces the header with the value of its target." },
                        { name: "Headers", desc: "Adds headers literally supplied in the value." },
                        { name: "Field", desc: "Named form field in application/x-www-form-urlencoded requests." },
                        { name: "FieldMap", desc: "Named form field map for form-encoded requests." },
                        { name: "Part", desc: "Denotes a single part of a multi-part request." },
                        { name: "Multipart", desc: "Denotes that the request body is multi-part." },
                        { name: "FormUrlEncoded", desc: "Denotes that the request body will be form-encoded." },
                        { name: "Streaming", desc: "Treat the response body as a stream." },
                        { name: "Url", desc: "URL resolved against the base URL." }
                    ]
                },
                "converter.gson": {
                    description: "A Converter which uses Gson for JSON serialization/deserialization.",
                    classes: [
                        { name: "GsonConverterFactory", desc: "A Converter.Factory for JSON which uses Gson." }
                    ]
                },
                "converter.moshi": {
                    description: "A Converter which uses Moshi for JSON.",
                    classes: [
                        { name: "MoshiConverterFactory", desc: "A Converter.Factory for JSON which uses Moshi." }
                    ]
                }
            }
        }
    },

    "okhttp_client": {
        "okhttp3": {
            description: "An HTTP & HTTP/2 client for Android and Java applications by Square.",
            classes: [
                { name: "OkHttpClient", desc: "Factory for calls, which can be used to send HTTP requests and read responses." },
                { name: "OkHttpClient.Builder", desc: "Builder to configure OkHttpClient instances." },
                { name: "Request", desc: "An HTTP request with method, URL, headers, and body." },
                { name: "Request.Builder", desc: "Builder for HTTP requests." },
                { name: "Response", desc: "An HTTP response with status, headers, and body." },
                { name: "ResponseBody", desc: "A one-shot stream from the origin server to the client application." },
                { name: "RequestBody", desc: "An HTTP request body." },
                { name: "Call", desc: "A call is a request that has been prepared for execution." },
                { name: "Callback", desc: "Listener for async HTTP responses." },
                { name: "MediaType", desc: "An RFC 2045 Media Type, appropriate to describe the content type of an HTTP request or response body." },
                { name: "Headers", desc: "The header fields of a single HTTP message." },
                { name: "HttpUrl", desc: "A uniform resource locator (URL) with a scheme of either http or https." },
                { name: "HttpUrl.Builder", desc: "Builder for HTTP URLs." }
            ],
            interfaces: [
                { name: "Interceptor", desc: "Observes, modifies, and potentially short-circuits requests." },
                { name: "Authenticator", desc: "Responds to authentication challenges from the remote web server." },
                { name: "CookieJar", desc: "Provides policy and persistence for HTTP cookies." },
                { name: "EventListener", desc: "Listener for metrics events." }
            ],
            sub_packages: {
                "logging": {
                    description: "Logging interceptor for OkHttp.",
                    classes: [
                        { name: "HttpLoggingInterceptor", desc: "An OkHttp interceptor which logs HTTP request and response data." },
                        { name: "HttpLoggingInterceptor.Level", desc: "Controls the level of logging (NONE, BASIC, HEADERS, BODY)." }
                    ]
                }
            }
        }
    },

    "volley_setup": {
        "com.android.volley": {
            description: "Google's HTTP library that makes networking for Android apps easier and faster.",
            classes: [
                { name: "RequestQueue", desc: "A request dispatch queue with a thread pool of dispatchers." },
                { name: "Request", desc: "Base class for all network requests." },
                { name: "Response", desc: "Encapsulates a parsed response returned from the network." },
                { name: "VolleyError", desc: "Exception style class encapsulating Volley errors." },
                { name: "StringRequest", desc: "A request for retrieving a String response body." },
                { name: "JsonObjectRequest", desc: "A request for retrieving a JSONObject response body." },
                { name: "JsonArrayRequest", desc: "A request for retrieving a JSONArray response body." },
                { name: "ImageRequest", desc: "A request for retrieving an image." },
                { name: "NetworkImageView", desc: "An ImageView that can load images from URLs." }
            ],
            interfaces: [
                { name: "Response.Listener", desc: "Callback interface for delivering parsed responses." },
                { name: "Response.ErrorListener", desc: "Callback interface for delivering error responses." }
            ],
            sub_packages: {
                "toolbox": {
                    description: "Utility classes for Volley.",
                    classes: [
                        { name: "Volley", desc: "General utility class with helper methods for creating RequestQueues." },
                        { name: "BasicNetwork", desc: "A network performing Volley requests over an HttpStack." },
                        { name: "DiskBasedCache", desc: "Cache implementation that uses the hard disk for storage." },
                        { name: "ImageLoader", desc: "Helper that handles loading and caching images from remote URLs." }
                    ]
                }
            }
        }
    },

    // ==========================================
    //️ IMAGE LOADING PACKAGES
    // ==========================================

    "glide_setup": {
        "com.bumptech.glide": {
            description: "A fast and efficient image loading library for Android focused on smooth scrolling.",
            classes: [
                { name: "Glide", desc: "A singleton to present a simple static interface for building requests." },
                { name: "RequestManager", desc: "A class for managing and starting requests for Glide." },
                { name: "RequestBuilder", desc: "A generic class that can handle setting options and staring loads." },
                { name: "DrawableRequestBuilder", desc: "A class for creating load requests to load a resource into a view." }
            ],
            interfaces: [
                { name: "Target", desc: "A interface for Resource and Drawable loading." }
            ],
            sub_packages: {
                "request": {
                    description: "Classes for configuring loads with RequestBuilder.",
                    classes: [
                        { name: "RequestOptions", desc: "Contains all options for loading images with Glide." },
                        { name: "RequestListener", desc: "A class for monitoring the status of a request while images load." },
                        { name: "SingleRequest", desc: "A Request that loads a resource into a given Target." }
                    ],
                    enums: [
                        { name: "Priority", desc: "Priority for loading resources (LOW, NORMAL, HIGH, IMMEDIATE)." }
                    ]
                },
                "load.engine": {
                    description: "Classes responsible for loading resources.",
                    classes: [
                        { name: "DiskCacheStrategy", desc: "Set of available caching strategies for media." }
                    ]
                }
            }
        }
    },

    "coil_setup": {
        "coil": {
            description: "An image loading library for Android backed by Kotlin Coroutines.",
            classes: [
                { name: "ImageLoader", desc: "A service class that loads images using an Executor." },
                { name: "ImageRequest", desc: "An immutable value object that represents a request for an image." },
                { name: "ImageRequest.Builder", desc: "Builder for creating ImageRequests." }
            ],
            sub_packages: {
                "compose": {
                    description: "Coil integration for Jetpack Compose.",
                    functions: [
                        { name: "AsyncImage", desc: "A composable that loads and displays an image from a URL." },
                        { name: "rememberAsyncImagePainter", desc: "Returns an ImagePainter that executes an ImageRequest asynchronously." }
                    ]
                },
                "request": {
                    description: "Classes for building and executing image requests.",
                    classes: [
                        { name: "Disposable", desc: "Represents the work of an ImageRequest." },
                        { name: "ImageResult", desc: "The result of an executed ImageRequest." },
                        { name: "SuccessResult", desc: "Indicates that the request completed successfully." },
                        { name: "ErrorResult", desc: "Indicates that an error occurred while executing the request." }
                    ]
                },
                "transform": {
                    description: "Built-in Transformations for Coil.",
                    classes: [
                        { name: "CircleCropTransformation", desc: "A Transformation that crops an image using a centered circle." },
                        { name: "RoundedCornersTransformation", desc: "A Transformation that crops an image using a rounded rectangle." },
                        { name: "BlurTransformation", desc: "A Transformation that applies a Gaussian blur to an image." },
                        { name: "GrayscaleTransformation", desc: "A Transformation that converts an image to grayscale." }
                    ]
                }
            }
        }
    },

    "picasso_setup": {
        "com.squareup.picasso": {
            description: "A powerful image downloading and caching library for Android.",
            classes: [
                { name: "Picasso", desc: "Image downloading, transformation, and caching manager." },
                { name: "RequestCreator", desc: "Fluent API for creating image requests." }
            ],
            interfaces: [
                { name: "Target", desc: "Represents an arbitrary listener for image loading." },
                { name: "Callback", desc: "A callback for when an image request is completed." },
                { name: "Transformation", desc: "Image transformation." }
            ]
        }
    },

    // ==========================================
    //️ GOOGLE MAPS & LOCATION
    // ==========================================

    "google_maps": {
        "com.google.android.gms.maps": {
            description: "Contains the Google Maps Android API classes.",
            classes: [
                { name: "GoogleMap", desc: "The main class for interacting with a Google Map." },
                { name: "CameraUpdateFactory", desc: "Creates CameraUpdate objects for changing the camera position." },
                { name: "SupportMapFragment", desc: "A Map component in an app using the Android Support Library." },
                { name: "MapView", desc: "A View which displays a map (for custom layouts)." },
                { name: "CameraUpdate", desc: "Defines a camera move." },
                { name: "CameraPosition", desc: "An immutable class that aggregates all camera position parameters." },
                { name: "UiSettings", desc: "Settings for the user interface of a GoogleMap." },
                { name: "Projection", desc: "A projection is used to translate between on screen location and geographic coordinates." }
            ],
            interfaces: [
                { name: "OnMapReadyCallback", desc: "Callback interface for when the map is ready to be used." },
                { name: "OnMapClickListener", desc: "Interface for click events on the map." },
                { name: "OnMapLongClickListener", desc: "Interface for long click events on the map." },
                { name: "OnMarkerClickListener", desc: "Interface for click events on markers." },
                { name: "OnMarkerDragListener", desc: "Interface for drag events on markers." },
                { name: "OnCameraIdleListener", desc: "Interface for when the camera stops moving." },
                { name: "OnCameraMoveListener", desc: "Interface for when the camera moves." }
            ],
            sub_packages: {
                "model": {
                    description: "Contains classes representing features on the map.",
                    classes: [
                        { name: "LatLng", desc: "Represents a pair of latitude and longitude coordinates, stored as degrees." },
                        { name: "LatLngBounds", desc: "An immutable class representing a latitude/longitude aligned rectangle." },
                        { name: "Marker", desc: "An icon placed at a particular point on the map's surface." },
                        { name: "MarkerOptions", desc: "Defines options for a Marker." },
                        { name: "Polyline", desc: "A list of points on the earth's surface which are drawn as a line." },
                        { name: "PolylineOptions", desc: "Defines options for a Polyline." },
                        { name: "Polygon", desc: "A polygon on the earth's surface." },
                        { name: "PolygonOptions", desc: "Defines options for a Polygon." },
                        { name: "Circle", desc: "A circle on the earth's surface." },
                        { name: "CircleOptions", desc: "Defines options for a Circle." },
                        { name: "BitmapDescriptor", desc: "Defines a bitmap image." },
                        { name: "BitmapDescriptorFactory", desc: "Used to create a definition of a Bitmap image." },
                        { name: "GroundOverlay", desc: "A ground overlay is an image that is fixed to a map." },
                        { name: "GroundOverlayOptions", desc: "Defines options for a GroundOverlay." },
                        { name: "TileOverlay", desc: "A Tile Overlay is a set of images which are displayed on top of the base map tiles." },
                        { name: "TileOverlayOptions", desc: "Defines options for a TileOverlay." }
                    ]
                }
            }
        },
        "com.google.maps.android.compose": {
            description: "Jetpack Compose integration for Google Maps.",
            composables: [
                { name: "GoogleMap", desc: "A composable GoogleMap component." },
                { name: "Marker", desc: "A composable marker on the map." },
                { name: "Polyline", desc: "A composable polyline on the map." },
                { name: "Polygon", desc: "A composable polygon on the map." },
                { name: "Circle", desc: "A composable circle on the map." }
            ]
        }
    },

    "location_services": {
        "com.google.android.gms.location": {
            description: "Google Play services location APIs.",
            classes: [
                { name: "FusedLocationProviderClient", desc: "The main entry point for interacting with the fused location provider." },
                { name: "LocationRequest", desc: "A data object that contains quality of service parameters for requests to the FusedLocationProviderApi." },
                { name: "LocationResult", desc: "A data class representing a geographic location result from the fused location provider." },
                { name: "LocationCallback", desc: "Used for receiving notifications from the FusedLocationProviderApi." },
                { name: "LocationServices", desc: "Main entry point for location services integration." },
                { name: "SettingsClient", desc: "The main entry point for interacting with location settings." },
                { name: "LocationSettingsRequest", desc: "Specifies the types of location services the client is interested in using." },
                { name: "LocationSettingsResponse", desc: "Result of checking location settings." }
            ],
            interfaces: [
                { name: "LocationListener", desc: "Used for receiving notifications when the device location has changed." }
            ]
        }
    },

    // ==========================================
    // FIREBASE PACKAGES
    // ==========================================

    "firebase_analytics": {
        "com.google.firebase.analytics": {
            description: "Firebase Analytics for app measurement.",
            classes: [
                { name: "FirebaseAnalytics", desc: "The Firebase Analytics API." },
                { name: "FirebaseAnalytics.Event", desc: "Event name constants." },
                { name: "FirebaseAnalytics.Param", desc: "Parameter name constants." }
            ]
        }
    },

    "firebase_auth": {
        "com.google.firebase.auth": {
            description: "Firebase Authentication to manage users.",
            classes: [
                { name: "FirebaseAuth", desc: "The entry point of the Firebase Authentication SDK." },
                { name: "FirebaseUser", desc: "Represents a user profile information." },
                { name: "AuthResult", desc: "Result of authentication operations." },
                { name: "AuthCredential", desc: "Interface that wraps an identity provider's information." },
                { name: "EmailAuthProvider", desc: "Provides credentials for email/password authentication." },
                { name: "GoogleAuthProvider", desc: "Provides credentials for Google Sign-In." },
                { name: "FacebookAuthProvider", desc: "Provides credentials for Facebook Login." },
                { name: "PhoneAuthProvider", desc: "Provides credentials for phone number authentication." },
                { name: "PhoneAuthCredential", desc: "Wraps phone number verification data." },
                { name: "UserProfileChangeRequest", desc: "Represents a request to update a user profile." }
            ],
            interfaces: [
                { name: "AuthStateListener", desc: "Listener called when there is a change in the authentication state." },
                { name: "IdTokenListener", desc: "Listener called when the Firebase ID token changes." }
            ]
        }
    },

    "firebase_firestore": {
        "com.google.firebase.firestore": {
            description: "Cloud Firestore - flexible, scalable NoSQL cloud database.",
            classes: [
                { name: "FirebaseFirestore", desc: "Represents a Firestore Database and is the entry point for all Firestore operations." },
                { name: "CollectionReference", desc: "A reference to a collection in a Firestore database." },
                { name: "DocumentReference", desc: "A reference to a document in a Firestore database." },
                { name: "DocumentSnapshot", desc: "Contains data read from a document in your Firestore database." },
                { name: "QuerySnapshot", desc: "Contains the results of a query." },
                { name: "Query", desc: "Represents a query over the data at a particular location." },
                { name: "WriteBatch", desc: "Used for executing multiple writes as a single atomic operation." },
                { name: "Transaction", desc: "Provides the ability to execute a set of reads and writes atomically." },
                { name: "FieldValue", desc: "Contains static methods for creating FieldValue instances." },
                { name: "SetOptions", desc: "Options for DocumentReference.set() operations." }
            ],
            interfaces: [
                { name: "EventListener", desc: "An interface for event listeners." },
                { name: "DocumentSnapshot.ServerTimestampBehavior", desc: "Controls the return value for server timestamps." }
            ]
        }
    },

    "firebase_database": {
        "com.google.firebase.database": {
            description: "Firebase Realtime Database to store and sync data.",
            classes: [
                { name: "FirebaseDatabase", desc: "The entry point for accessing a Firebase Database." },
                { name: "DatabaseReference", desc: "A reference to a specific location in your Database." },
                { name: "DataSnapshot", desc: "Contains data from a Firebase Database location." },
                { name: "Query", desc: "Instances of Query are obtained by calling methods on DatabaseReference." },
                { name: "DatabaseError", desc: "Instances of DatabaseError are passed to callbacks when an operation failed." },
                { name: "MutableData", desc: "Instances contain data and priority at a location." },
                { name: "ServerValue", desc: "Contains placeholder values to use when writing data to the Firebase Realtime Database." },
                { name: "OnDisconnect", desc: "The OnDisconnect class is used to manage operations that will be run on the server." }
            ],
            interfaces: [
                { name: "ValueEventListener", desc: "Instances are used to read data once or listen for changes to data." },
                { name: "ChildEventListener", desc: "Classes implementing this interface can be used to receive events about changes in child locations." }
            ]
        }
    },

    "firebase_storage": {
        "com.google.firebase.storage": {
            description: "Cloud Storage for Firebase to store and serve user-generated content.",
            classes: [
                { name: "FirebaseStorage", desc: "The entry point of the Firebase Storage SDK." },
                { name: "StorageReference", desc: "Represents a reference to a Cloud Storage object." },
                { name: "UploadTask", desc: "Used to upload files to Cloud Storage." },
                { name: "FileDownloadTask", desc: "Used to download files from Cloud Storage to a local file." },
                { name: "StreamDownloadTask", desc: "Downloads byte data for a StorageReference." },
                { name: "StorageMetadata", desc: "Metadata for a StorageReference." },
                { name: "StorageTask", desc: "Represents an asynchronous operation that can be paused, resumed, and canceled." },
                { name: "ListResult", desc: "Result returned by a list operation." }
            ],
            interfaces: [
                { name: "OnProgressListener", desc: "Listener that receives progress updates." },
                { name: "OnPausedListener", desc: "Listener that is called when an operation is paused." }
            ]
        }
    },

    "firebase_messaging": {
        "com.google.firebase.messaging": {
            description: "Firebase Cloud Messaging (FCM) for push notifications.",
            classes: [
                { name: "FirebaseMessaging", desc: "Entry point for Firebase Cloud Messaging." },
                { name: "FirebaseMessagingService", desc: "Base class for receiving messages from Firebase Cloud Messaging." },
                { name: "RemoteMessage", desc: "A remote Firebase Message." },
                { name: "RemoteMessage.Notification", desc: "The notification part of the message." }
            ]
        }
    },

    "firebase_crashlytics": {
        "com.google.firebase.crashlytics": {
            description: "Firebase Crashlytics for crash reporting.",
            classes: [
                { name: "FirebaseCrashlytics", desc: "The Firebase Crashlytics API provides methods to annotate and manage fatal and non-fatal reports." },
                { name: "CustomKeysAndValues", desc: "An API for adding multiple key-value pairs." }
            ]
        }
    },

    // ==========================================
    //️ JETPACK COMPOSE PACKAGES
    // ==========================================

    "jetpack_compose": {
        "androidx.compose.ui": {
            description: "Compose UI primitives and building blocks.",
            composables: [
                { name: "Box", desc: "A layout composable that positions its children relative to its edges." },
                { name: "Column", desc: "A layout composable that places its children in a vertical sequence." },
                { name: "Row", desc: "A layout composable that places its children in a horizontal sequence." },
                { name: "LazyColumn", desc: "A vertically scrolling list that only composes visible items." },
                { name: "LazyRow", desc: "A horizontally scrolling list that only composes visible items." }
            ],
            modifiers: [
                { name: "Modifier.padding", desc: "Apply additional space along each edge of the content." },
                { name: "Modifier.fillMaxWidth", desc: "Size the element to fill the maximum width." },
                { name: "Modifier.fillMaxHeight", desc: "Size the element to fill the maximum height." },
                { name: "Modifier.fillMaxSize", desc: "Size the element to fill all available space." },
                { name: "Modifier.clickable", desc: "Configure component to receive clicks." },
                { name: "Modifier.background", desc: "Draw a background color or shape." }
            ]
        },
        "androidx.compose.material3": {
            description: "Material Design 3 components for Jetpack Compose.",
            composables: [
                { name: "Button", desc: "Material Design button." },
                { name: "Text", desc: "High level element that displays text." },
                { name: "TextField", desc: "Material Design filled text field." },
                { name: "OutlinedTextField", desc: "Material Design outlined text field." },
                { name: "Card", desc: "Material Design card." },
                { name: "Scaffold", desc: "Basic Material Design visual layout structure." },
                { name: "TopAppBar", desc: "Top app bar displays information and actions at the top of a screen." },
                { name: "FloatingActionButton", desc: "Material Design floating action button." },
                { name: "NavigationBar", desc: "Material Design bottom navigation bar." },
                { name: "Icon", desc: "Icon component that draws a vector icon." },
                { name: "IconButton", desc: "A clickable icon button." },
                { name: "Switch", desc: "Material Design switch." },
                { name: "Checkbox", desc: "Material Design checkbox." },
                { name: "RadioButton", desc: "Material Design radio button." },
                { name: "Slider", desc: "Material Design slider." },
                { name: "CircularProgressIndicator", desc: "A circular progress indicator." },
                { name: "LinearProgressIndicator", desc: "A linear progress indicator." },
                { name: "AlertDialog", desc: "Material Design alert dialog." },
                { name: "DropdownMenu", desc: "Material Design dropdown menu." },
                { name: "Divider", desc: "Material Design divider." }
            ]
        },
        "androidx.navigation.compose": {
            description: "Navigation component integration for Jetpack Compose.",
            composables: [
                { name: "NavHost", desc: "Hosts a navigation graph." },
                { name: "composable", desc: "Add a composable to the NavGraphBuilder." }
            ],
            classes: [
                { name: "NavController", desc: "Navigator that manages app navigation within a NavHost." },
                { name: "NavHostController", desc: "Subclass of NavController for use with NavHost." }
            ],
            functions: [
                { name: "rememberNavController", desc: "Create and remember a NavHostController." },
                { name: "navigate", desc: "Navigate to a route in the current NavGraph." }
            ]
        },
        "androidx.lifecycle.viewmodel.compose": {
            description: "Jetpack Compose integration with ViewModels.",
            functions: [
                { name: "viewModel", desc: "Returns an existing ViewModel or creates a new one." }
            ]
        }
    },

    // ==========================================
    //️ ARCHITECTURE COMPONENTS
    // ==========================================

    "mvvm_lifecycle": {
        "androidx.lifecycle": {
            description: "Android lifecycle-aware components.",
            classes: [
                { name: "ViewModel", desc: "Stores and manages UI-related data in a lifecycle conscious way." },
                { name: "LiveData", desc: "Observable data holder class that respects lifecycle." },
                { name: "MutableLiveData", desc: "LiveData subclass that exposes setValue and postValue methods." },
                { name: "MediatorLiveData", desc: "LiveData subclass which may observe other LiveData objects." },
                { name: "Transformations", desc: "Transformation methods for LiveData." },
                { name: "Observer", desc: "A simple callback that can receive data from LiveData." },
                { name: "LifecycleOwner", desc: "A class that has an Android Lifecycle." },
                { name: "Lifecycle", desc: "Defines an object that has an Android Lifecycle." },
                { name: "LifecycleObserver", desc: "Marks a class as a LifecycleObserver." },
                { name: "ViewModelProvider", desc: "Utility class to create ViewModels." }
            ],
            annotations: [
                { name: "OnLifecycleEvent", desc: "Marks a method as a lifecycle event observer." }
            ]
        }
    },

    "navigation_component": {
        "androidx.navigation": {
            description: "Navigation component for app navigation.",
            classes: [
                { name: "NavController", desc: "Manages app navigation within a NavHost." },
                { name: "NavHostFragment", desc: "NavHost for fragments." },
                { name: "NavGraph", desc: "A collection of destination nodes." },
                { name: "NavDestination", desc: "Represents a single node within a navigation graph." },
                { name: "NavOptions", desc: "NavOptions stores special options for navigation actions." },
                { name: "NavDeepLinkBuilder", desc: "Class used to construct deep links." }
            ],
            interfaces: [
                { name: "OnDestinationChangedListener", desc: "Listener for when navigation destination changes." }
            ]
        },
        "androidx.navigation.fragment": {
            description: "Navigation support for Fragments.",
            classes: [
                { name: "NavHostFragment", desc: "NavHost implementation for hosting fragment destinations." },
                { name: "FragmentNavigator", desc: "Navigator that uses FragmentManager to navigate between Fragment destinations." }
            ]
        },
        "androidx.navigation.ui": {
            description: "UI utilities for Navigation.",
            classes: [
                { name: "NavigationUI", desc: "Helper methods for navigation UI elements." },
                { name: "AppBarConfiguration", desc: "Configuration options for NavigationUI methods." }
            ]
        }
    },

    "room_db": {
        "androidx.room": {
            description: "Room persistence library for local databases.",
            classes: [
                { name: "RoomDatabase", desc: "Base class for all Room databases." },
                { name: "RoomDatabase.Builder", desc: "Builder for RoomDatabase." }
            ],
            annotations: [
                { name: "Database", desc: "Marks a class as a RoomDatabase." },
                { name: "Entity", desc: "Marks a class as a Room entity." },
                { name: "PrimaryKey", desc: "Marks a field as the primary key." },
                { name: "ColumnInfo", desc: "Allows specific customization about the column associated with a field." },
                { name: "Ignore", desc: "Marks a field or method to be ignored by Room." },
                { name: "Dao", desc: "Marks a class as a Data Access Object." },
                { name: "Insert", desc: "Marks a method as an insert method." },
                { name: "Update", desc: "Marks a method as an update method." },
                { name: "Delete", desc: "Marks a method as a delete method." },
                { name: "Query", desc: "Marks a method as a query method." },
                { name: "Transaction", desc: "Marks a method as a transaction method." },
                { name: "ForeignKey", desc: "Declares a foreign key on another Entity." },
                { name: "Index", desc: "Declares an index on an Entity." },
                { name: "TypeConverter", desc: "Marks a method as a type converter." }
            ]
        }
    },

    "work_manager": {
        "androidx.work": {
            description: "WorkManager schedules deferrable, guaranteed background work.",
            classes: [
                { name: "WorkManager", desc: "The main entry point for working with WorkManager." },
                { name: "Worker", desc: "The basic object that performs work." },
                { name: "CoroutineWorker", desc: "A Worker that runs on a Kotlin coroutine." },
                { name: "ListenableWorker", desc: "The basic class for all background workers." },
                { name: "WorkRequest", desc: "A request for work to be performed." },
                { name: "OneTimeWorkRequest", desc: "A WorkRequest that will execute exactly once." },
                { name: "PeriodicWorkRequest", desc: "A WorkRequest for repeating work." },
                { name: "Constraints", desc: "Requirements for when a WorkRequest should run." },
                { name: "Data", desc: "A persistable set of key/value pairs." },
                { name: "WorkInfo", desc: "Information about a particular WorkRequest." },
                { name: "Operation", desc: "Represents the result of an operation." }
            ],
            enums: [
                { name: "WorkInfo.State", desc: "The current lifecycle state of a WorkRequest (ENQUEUED, RUNNING, SUCCEEDED, FAILED, BLOCKED, CANCELLED)." },
                { name: "NetworkType", desc: "An enumeration of various network types." },
                { name: "BackoffPolicy", desc: "An enumeration of backoff policies when retrying work." }
            ]
        }
    },

    "data_store": {
        "androidx.datastore.preferences": {
            description: "Jetpack DataStore with support for Preferences.",
            classes: [
                { name: "PreferencesDataStore", desc: "DataStore implementation for Preferences." },
                { name: "Preferences", desc: "Read-only snapshot of preferences data." },
                { name: "MutablePreferences", desc: "Mutable container for preferences." }
            ],
            interfaces: [
                { name: "Preferences.Key", desc: "Type-safe key for Preferences." }
            ],
            functions: [
                { name: "preferencesDataStore", desc: "Creates a property delegate for a DataStore of Preferences." },
                { name: "intPreferencesKey", desc: "Creates a key for Int values." },
                { name: "stringPreferencesKey", desc: "Creates a key for String values." },
                { name: "booleanPreferencesKey", desc: "Creates a key for Boolean values." },
                { name: "floatPreferencesKey", desc: "Creates a key for Float values." },
                { name: "longPreferencesKey", desc: "Creates a key for Long values." }
            ]
        }
    },

    "coroutines": {
        "kotlinx.coroutines": {
            description: "Library support for Kotlin coroutines.",
            classes: [
                { name: "CoroutineScope", desc: "Defines a scope for new coroutines." },
                { name: "Job", desc: "A cancellable job with a lifecycle." },
                { name: "Deferred", desc: "A non-blocking cancellable future." },
                { name: "CoroutineDispatcher", desc: "Dispatches execution of a coroutine." }
            ],
            functions: [
                { name: "launch", desc: "Launches a new coroutine without blocking." },
                { name: "async", desc: "Creates a coroutine and returns its future result as Deferred." },
                { name: "withContext", desc: "Calls the specified suspending block with a given coroutine context." },
                { name: "delay", desc: "Delays coroutine for a given time without blocking a thread." },
                { name: "runBlocking", desc: "Runs a new coroutine and blocks the current thread." }
            ],
            objects: [
                { name: "Dispatchers.Main", desc: "Dispatcher for UI operations on the main thread." },
                { name: "Dispatchers.IO", desc: "Dispatcher optimized for IO operations." },
                { name: "Dispatchers.Default", desc: "Dispatcher optimized for CPU-intensive work." },
                { name: "Dispatchers.Unconfined", desc: "Dispatcher not confined to any specific thread." }
            ]
        }
    },

    "paging3": {
        "androidx.paging": {
            description: "Paging library for loading data gradually.",
            classes: [
                { name: "PagingData", desc: "Container for paginated data." },
                { name: "PagingSource", desc: "Base class for loading snapshots of data into a stream of PagingData." },
                { name: "Pager", desc: "Primary entry point into Paging." },
                { name: "PagingConfig", desc: "Configuration object for Paging behavior." },
                { name: "LoadState", desc: "Represents the load state of a single PagedList." }
            ]
        },
        "androidx.paging.compose": {
            description: "Paging integration for Jetpack Compose.",
            functions: [
                { name: "collectAsLazyPagingItems", desc: "Collects values from PagingData and represents them as LazyPagingItems." }
            ],
            classes: [
                { name: "LazyPagingItems", desc: "The items provided by a Flow of PagingData." }
            ]
        }
    },

    // ==========================================
    // CAMERA & MEDIA
    // ==========================================

    "camerax_full": {
        "androidx.camera.core": {
            description: "Core CameraX functionality.",
            classes: [
                { name: "CameraSelector", desc: "Used to select a camera." },
                { name: "Preview", desc: "Use case for providing a camera preview stream." },
                { name: "ImageCapture", desc: "Use case for taking pictures." },
                { name: "ImageAnalysis", desc: "Use case for providing CPU accessible images for analysis." },
                { name: "VideoCapture", desc: "Use case for video recording." },
                { name: "ImageProxy", desc: "Image returned from ImageAnalysis or ImageCapture." },
                { name: "Camera", desc: "An interface representing a logical camera." },
                { name: "CameraInfo", desc: "An interface for retrieving camera information." },
                { name: "CameraControl", desc: "An interface for controlling a camera." }
            ]
        },
        "androidx.camera.lifecycle": {
            description: "Lifecycle-aware CameraX components.",
            classes: [
                { name: "ProcessCameraProvider", desc: "Provides access to a camera." }
            ]
        },
        "androidx.camera.view": {
            description: "CameraX view components.",
            classes: [
                { name: "PreviewView", desc: "A View that displays a camera preview." }
            ]
        }
    },

    // ==========================================
    // SECURITY & AUTHENTICATION
    // ==========================================

    "biometric_auth": {
        "androidx.biometric": {
            description: "Biometric authentication components.",
            classes: [
                { name: "BiometricPrompt", desc: "A prompt for biometric authentication." },
                { name: "BiometricPrompt.PromptInfo", desc: "Contains information that will be displayed on the prompt." },
                { name: "BiometricPrompt.AuthenticationCallback", desc: "Callback for authentication events." },
                { name: "BiometricPrompt.AuthenticationResult", desc: "Result of a successful authentication attempt." },
                { name: "BiometricPrompt.CryptoObject", desc: "A crypto object to be authenticated." },
                { name: "BiometricManager", desc: "A class for checking the availability of biometric authentication." }
            ]
        }
    },

    "encrypted_storage": {
        "androidx.security.crypto": {
            description: "Security crypto utilities for encryption.",
            classes: [
                { name: "EncryptedSharedPreferences", desc: "An implementation of SharedPreferences that encrypts keys and values." },
                { name: "EncryptedFile", desc: "Class used to create and read encrypted files." },
                { name: "MasterKey", desc: "Wrapper for a master key used to encrypt and decrypt data." },
                { name: "MasterKey.Builder", desc: "Builder for creating MasterKey instances." }
            ],
            enums: [
                { name: "EncryptedSharedPreferences.PrefKeyEncryptionScheme", desc: "Encryption scheme for keys." },
                { name: "EncryptedSharedPreferences.PrefValueEncryptionScheme", desc: "Encryption scheme for values." }
            ]
        }
    },

    // ==========================================
    // DEPENDENCY INJECTION
    // ==========================================

    "hilt_di": {
        "dagger.hilt.android": {
            description: "Hilt - Dependency injection library built on Dagger.",
            annotations: [
                { name: "HiltAndroidApp", desc: "Annotation for the Application class that sets up Hilt." },
                { name: "AndroidEntryPoint", desc: "Marks an Android component class to be setup for injection." }
            ]
        },
        "dagger.hilt": {
            description: "Core Hilt annotations.",
            annotations: [
                { name: "InstallIn", desc: "Identifies which component(s) the annotated class should be included in." }
            ]
        },
        "javax.inject": {
            description: "JSR-330 dependency injection annotations.",
            annotations: [
                { name: "Inject", desc: "Identifies injectable constructors, methods, and fields." },
                { name: "Singleton", desc: "Identifies a type that the injector only instantiates once." },
                { name: "Named", desc: "String-based qualifier." }
            ]
        },
        "dagger": {
            description: "Dagger dependency injection.",
            annotations: [
                { name: "Module", desc: "Annotates a class that contributes to the object graph." },
                { name: "Provides", desc: "Annotates methods of a Module to create a provider method binding." },
                { name: "Binds", desc: "Annotates abstract methods of a Module to create bindings." }
            ]
        }
    },

    "koin_di": {
        "org.koin.android": {
            description: "Koin for Android - lightweight dependency injection.",
            functions: [
                { name: "startKoin", desc: "Start Koin container." }
            ]
        },
        "org.koin.core": {
            description: "Koin core functionality.",
            functions: [
                { name: "module", desc: "Create a Koin Module." },
                { name: "single", desc: "Declare a singleton definition." },
                { name: "factory", desc: "Declare a factory definition." },
                { name: "get", desc: "Resolve a dependency." }
            ]
        },
        "org.koin.androidx.viewmodel.dsl": {
            description: "Koin ViewModel DSL.",
            functions: [
                { name: "viewModel", desc: "Declare a ViewModel definition." }
            ]
        }
    },


    // ==========================================
    // QR & BARCODE
    // ==========================================

    "qr_code_scanner": {
        "com.journeyapps.barcodescanner": {
            description: "ZXing Android Embedded for barcode scanning.",
            classes: [
                { name: "BarcodeCallback", desc: "Callback for barcode results." },
                { name: "BarcodeResult", desc: "Result of a barcode scan." },
                { name: "DecoratedBarcodeView", desc: "Barcode scanner view with viewfinder and status." },
                { name: "BarcodeView", desc: "Core barcode scanner view." },
                { name: "CaptureActivity", desc: "Activity for scanning barcodes." },
                { name: "CaptureManager", desc: "Manager for barcode capture." }
            ]
        },
        "com.google.zxing": {
            description: "ZXing core library.",
            classes: [
                { name: "Result", desc: "Encapsulates the result of decoding a barcode." },
                { name: "BarcodeFormat", desc: "Enumerates barcode formats." }
            ]
        }
    },

    // ==========================================
    // UI COMPONENTS & LIBRARIES
    // ==========================================

    "material_design": {
        "com.google.android.material": {
            description: "Material Design components for Android.",
            sub_packages: {
                "button": {
                    description: "Material button components.",
                    classes: [
                        { name: "MaterialButton", desc: "A convenience class for creating a Material button." }
                    ]
                },
                "textfield": {
                    description: "Material text field components.",
                    classes: [
                        { name: "TextInputLayout", desc: "Layout which wraps an EditText to show a floating label." },
                        { name: "TextInputEditText", desc: "A special EditText to be used with TextInputLayout." }
                    ]
                },
                "card": {
                    description: "Material card components.",
                    classes: [
                        { name: "MaterialCardView", desc: "Provides a Material card." }
                    ]
                },
                "appbar": {
                    description: "App bar components.",
                    classes: [
                        { name: "MaterialToolbar", desc: "A Toolbar that supports Material themes." },
                        { name: "AppBarLayout", desc: "A vertical LinearLayout which implements scrolling effects." },
                        { name: "CollapsingToolbarLayout", desc: "A toolbar layout that collapses with scrolling." }
                    ]
                },
                "bottomnavigation": {
                    description: "Bottom navigation components.",
                    classes: [
                        { name: "BottomNavigationView", desc: "Represents a bottom navigation bar." }
                    ]
                },
                "tabs": {
                    description: "Tab components.",
                    classes: [
                        { name: "TabLayout", desc: "Provides a horizontal layout to display tabs." }
                    ]
                },
                "floatingactionbutton": {
                    description: "Floating action button components.",
                    classes: [
                        { name: "FloatingActionButton", desc: "A circular button made of paper that lifts and emits ink reactions." },
                        { name: "ExtendedFloatingActionButton", desc: "Extended FAB with icon and text." }
                    ]
                },
                "snackbar": {
                    description: "Snackbar components.",
                    classes: [
                        { name: "Snackbar", desc: "Provides lightweight feedback about an operation." }
                    ]
                },
                "chip": {
                    description: "Chip components.",
                    classes: [
                        { name: "Chip", desc: "Compact element that represents an attribute, text, entity, or action." },
                        { name: "ChipGroup", desc: "A group of Chip widgets." }
                    ]
                },
                "dialog": {
                    description: "Material dialog components.",
                    classes: [
                        { name: "MaterialAlertDialogBuilder", desc: "Builder for creating Material-themed AlertDialogs." }
                    ]
                }
            }
        }
    },

    "lottie_anim": {
        "com.airbnb.lottie": {
            description: "Lottie library for rendering After Effects animations.",
            classes: [
                { name: "LottieAnimationView", desc: "View for displaying Lottie animations." },
                { name: "LottieDrawable", desc: "Drawable for rendering Lottie animations." },
                { name: "LottieComposition", desc: "Represents the parsed Lottie animation." },
                { name: "LottieCompositionFactory", desc: "Factory for loading LottieCompositions." }
            ]
        },
        "com.airbnb.lottie.compose": {
            description: "Lottie for Jetpack Compose.",
            composables: [
                { name: "LottieAnimation", desc: "Composable for displaying Lottie animations." },
                { name: "rememberLottieComposition", desc: "Loads and remembers a LottieComposition." }
            ]
        }
    },

    "mp_android_chart": {
        "com.github.mikephil.charting": {
            description: "A powerful chart library for Android.",
            classes: [
                { name: "LineChart", desc: "Chart that draws lines, surfaces, circles, and more." },
                { name: "BarChart", desc: "Chart that draws bars." },
                { name: "PieChart", desc: "Chart that draws a pie chart." },
                { name: "RadarChart", desc: "Chart that draws a radar chart." },
                { name: "ScatterChart", desc: "Chart that draws scatter data." },
                { name: "CandleStickChart", desc: "Financial chart for displaying candlestick data." },
                { name: "BubbleChart", desc: "Chart that draws bubbles." }
            ],
            sub_packages: {
                "data": {
                    description: "Chart data classes.",
                    classes: [
                        { name: "LineData", desc: "Data for LineChart." },
                        { name: "BarData", desc: "Data for BarChart." },
                        { name: "PieData", desc: "Data for PieChart." },
                        { name: "Entry", desc: "Data point for charts." },
                        { name: "DataSet", desc: "Base class for all DataSet classes." }
                    ]
                },
                "components": {
                    description: "Chart component classes.",
                    classes: [
                        { name: "XAxis", desc: "Class representing the x-axis." },
                        { name: "YAxis", desc: "Class representing the y-axis." },
                        { name: "Legend", desc: "Class representing the legend." }
                    ]
                }
            }
        }
    },

    // ==========================================
    //️ UTILITIES
    // ==========================================

    "timber_logging": {
        "timber.log": {
            description: "A logger with a small, extensible API.",
            classes: [
                { name: "Timber", desc: "Logging for lazy people." }
            ],
            functions: [
                { name: "Timber.d", desc: "Log a debug message." },
                { name: "Timber.i", desc: "Log an info message." },
                { name: "Timber.w", desc: "Log a warning message." },
                { name: "Timber.e", desc: "Log an error message." },
                { name: "Timber.v", desc: "Log a verbose message." },
                { name: "Timber.plant", desc: "Set up a Tree for logging." }
            ],
            classes: [
                { name: "Timber.Tree", desc: "A Tree for logging." },
                { name: "Timber.DebugTree", desc: "A Tree for debug logging." }
            ]
        }
    },

    "event_bus": {
        "org.greenrobot.eventbus": {
            description: "Event bus for Android and Java.",
            classes: [
                { name: "EventBus", desc: "Main EventBus class." },
                { name: "Subscribe", desc: "Annotation to mark methods as event handlers." },
                { name: "ThreadMode", desc: "Defines the thread on which event handler methods are called." }
            ]
        }
    },

    // ==========================================
    // WEBVIEW
    // ==========================================

    "webview_advanced": {
        "androidx.webkit": {
            description: "AndroidX WebKit library.",
            classes: [
                { name: "WebViewCompat", desc: "Compatibility helper for WebView." },
                { name: "WebViewFeature", desc: "Utility class for checking WebView feature support." },
                { name: "WebSettingsCompat", desc: "Compatibility wrapper for WebSettings." },
                { name: "WebViewClientCompat", desc: "Compatibility version of WebViewClient." },
                { name: "WebResourceRequestCompat", desc: "Compatibility wrapper for WebResourceRequest." },
                { name: "WebResourceResponseCompat", desc: "Compatibility wrapper for WebResourceResponse." }
            ]
        },
        "android.webkit": {
            description: "Standard Android WebView classes.",
            classes: [
                { name: "WebView", desc: "A View that displays web pages." },
                { name: "WebSettings", desc: "Manages settings for a WebView." },
                { name: "WebViewClient", desc: "Handles various notifications and requests." },
                { name: "WebChromeClient", desc: "Handles JavaScript dialogs, favicons, titles, and progress." },
                { name: "CookieManager", desc: "Manages cookies used by WebView." },
                { name: "JavascriptInterface", desc: "Annotation to expose Java methods to JavaScript." }
            ]
        }
    },

    // ==========================================
    // ADDITIONAL COMMON PACKAGES
    // ==========================================

    "admob_ads": {
        "com.google.android.gms.ads": {
            description: "Google Mobile Ads SDK.",
            classes: [
                { name: "MobileAds", desc: "Entry point for the Google Mobile Ads SDK." },
                { name: "AdView", desc: "View to display banner ads." },
                { name: "AdRequest", desc: "An ad request used to load ads." },
                { name: "AdRequest.Builder", desc: "Builder for ad requests." },
                { name: "InterstitialAd", desc: "Full-screen ad." },
                { name: "AdListener", desc: "Listener for ad events." },
                { name: "LoadAdError", desc: "Error information for ad loading failures." }
            ],
            sub_packages: {
                "rewarded": {
                    description: "Rewarded ad classes.",
                    classes: [
                        { name: "RewardedAd", desc: "Rewarded ad that rewards users for watching video ads." },
                        { name: "RewardItem", desc: "Reward given to the user." }
                    ]
                },
                "nativead": {
                    description: "Native ad classes.",
                    classes: [
                        { name: "NativeAd", desc: "The base class for all native ads." }
                    ]
                }
            }
        }
    },

    "splash_screen_api": {
        "androidx.core.splashscreen": {
            description: "SplashScreen API for Android 12+.",
            classes: [
                { name: "SplashScreen", desc: "Represents a splash screen." },
                { name: "SplashScreenViewProvider", desc: "Provides access to the splash screen view." }
            ]
        }
    },

    "recyclerview": {
        "androidx.recyclerview.widget": {
            description: "RecyclerView and related classes.",
            classes: [
                { name: "RecyclerView", desc: "A flexible view for providing a limited window into a large data set." },
                { name: "RecyclerView.Adapter", desc: "Adapter provides a binding from data set to views." },
                { name: "RecyclerView.ViewHolder", desc: "ViewHolder describes an item view." },
                { name: "RecyclerView.LayoutManager", desc: "LayoutManager is responsible for measuring and positioning item views." },
                { name: "LinearLayoutManager", desc: "LayoutManager for linear layouts." },
                { name: "GridLayoutManager", desc: "LayoutManager for grid layouts." },
                { name: "StaggeredGridLayoutManager", desc: "LayoutManager for staggered grid layouts." },
                { name: "DiffUtil", desc: "Utility class to calculate the difference between two lists." },
                { name: "ItemDecoration", desc: "Allows custom drawing and layout offsets for items." }
            ]
        }
    } ,
    
      

    // ==========================================
    // ML KIT & AI
    // ==========================================

    "mlkit_text_recognition": {
        "com.google.mlkit.vision.text": {
            description: "ML Kit Text Recognition API for extracting text from images.",
            classes: [
                { name: "TextRecognition", desc: "Entry point for text recognition operations." },
                { name: "TextRecognizer", desc: "Client for text recognition in images." },
                { name: "Text", desc: "Represents text recognized in an image." },
                { name: "Text.TextBlock", desc: "A block of text in the recognized text." },
                { name: "Text.Line", desc: "A line of text in a text block." },
                { name: "Text.Element", desc: "An element (word) in a line of text." }
            ]
        },
        "com.google.mlkit.vision.common": {
            description: "Common classes for ML Kit Vision APIs.",
            classes: [
                { name: "InputImage", desc: "Wrapper of an input image for vision APIs." }
            ]
        }
    },

    "mlkit_face_detection": {
        "com.google.mlkit.vision.face": {
            description: "ML Kit Face Detection API.",
            classes: [
                { name: "FaceDetection", desc: "Entry point for face detection operations." },
                { name: "FaceDetector", desc: "Client for detecting faces in images." },
                { name: "Face", desc: "Represents a face detected in an image." },
                { name: "FaceContour", desc: "Represents a face contour." },
                { name: "FaceLandmark", desc: "Represents a face landmark (eye, nose, etc)." },
                { name: "FaceDetectorOptions", desc: "Options for configuring face detector." }
            ],
            enums: [
                { name: "FaceDetectorOptions.PerformanceMode", desc: "FAST or ACCURATE mode." },
                { name: "FaceDetectorOptions.LandmarkMode", desc: "ALL or NONE landmarks." },
                { name: "FaceDetectorOptions.ContourMode", desc: "ALL or NONE contours." },
                { name: "FaceDetectorOptions.ClassificationMode", desc: "ALL or NONE classifications." }
            ]
        }
    },

    "mlkit_barcode_scanner": {
        "com.google.mlkit.vision.barcode": {
            description: "ML Kit Barcode Scanning API.",
            classes: [
                { name: "BarcodeScanning", desc: "Entry point for barcode scanning." },
                { name: "BarcodeScanner", desc: "Client for barcode scanning." },
                { name: "Barcode", desc: "Represents a barcode detected in an image." },
                { name: "Barcode.ContactInfo", desc: "Contact information from barcode." },
                { name: "Barcode.Email", desc: "Email address from barcode." },
                { name: "Barcode.Phone", desc: "Phone number from barcode." },
                { name: "Barcode.Sms", desc: "SMS information from barcode." },
                { name: "Barcode.Url", desc: "URL from barcode." },
                { name: "Barcode.WiFi", desc: "WiFi network info from barcode." },
                { name: "BarcodeScannerOptions", desc: "Options for configuring barcode scanner." }
            ],
            enums: [
                { name: "Barcode.BarcodeFormat", desc: "QR_CODE, CODE_128, EAN_13, etc." }
            ]
        },
        "com.google.mlkit.vision.common": {
            description: "Common ML Kit Vision classes.",
            classes: [
                { name: "InputImage", desc: "Wrapper of an input image for vision APIs." }
            ]
        }
    },

    "mlkit_image_labeling": {
        "com.google.mlkit.vision.label": {
            description: "ML Kit Image Labeling API.",
            classes: [
                { name: "ImageLabeling", desc: "Entry point for image labeling." },
                { name: "ImageLabeler", desc: "Client for labeling images." },
                { name: "ImageLabel", desc: "Represents a label for an image." },
                { name: "ImageLabelerOptions", desc: "Options for configuring image labeler." }
            ]
        }
    },

    // ==========================================
    // TENSORFLOW LITE
    // ==========================================

    "tensorflow_lite": {
        "org.tensorflow.lite": {
            description: "TensorFlow Lite library for on-device ML inference.",
            classes: [
                { name: "Interpreter", desc: "Driver for TensorFlow Lite model inference." },
                { name: "Interpreter.Options", desc: "Options for configuring interpreter." },
                { name: "Tensor", desc: "Represents a tensor in the model." }
            ],
            interfaces: [
                { name: "Delegate", desc: "Interface for accelerating inference with hardware." }
            ]
        },
        "org.tensorflow.lite.support.image": {
            description: "Image processing utilities for TensorFlow Lite.",
            classes: [
                { name: "TensorImage", desc: "Wrapper for image tensor operations." },
                { name: "ImageProcessor", desc: "Processor for image preprocessing." }
            ]
        },
        "org.tensorflow.lite.gpu": {
            description: "GPU acceleration for TensorFlow Lite.",
            classes: [
                { name: "GpuDelegate", desc: "Delegate for GPU acceleration." },
                { name: "GpuDelegateFactory", desc: "Factory for creating GPU delegates." }
            ]
        }
    },

    // ==========================================
    // AR & VR
    // ==========================================

    "arcore_augmented_reality": {
        "com.google.ar.core": {
            description: "ARCore library for augmented reality experiences.",
            classes: [
                { name: "Session", desc: "Main interface to ARCore API." },
                { name: "Frame", desc: "Represents a single frame of camera feed and AR data." },
                { name: "Camera", desc: "Provides information about the camera." },
                { name: "Anchor", desc: "Describes a fixed location in the real world." },
                { name: "Plane", desc: "Describes a detected flat surface." },
                { name: "Point", desc: "Represents a point in 3D space." },
                { name: "Pose", desc: "Represents a position and orientation in 3D space." },
                { name: "HitResult", desc: "Result of a ray cast intersection with real world geometry." },
                { name: "Config", desc: "Session configuration." },
                { name: "TrackingState", desc: "Describes the tracking state." }
            ],
            enums: [
                { name: "TrackingState", desc: "TRACKING, PAUSED, STOPPED." },
                { name: "Plane.Type", desc: "HORIZONTAL_UPWARD_FACING, HORIZONTAL_DOWNWARD_FACING, VERTICAL." }
            ]
        }
    },

    // ==========================================
    // AUDIO & MEDIA
    // ==========================================

    "media_session": {
        "androidx.media": {
            description: "Media compatibility library for media sessions.",
            classes: [
                { name: "MediaSessionCompat", desc: "A media session for interacting with media controllers." },
                { name: "MediaControllerCompat", desc: "Allows an app to interact with a media session." },
                { name: "MediaBrowserCompat", desc: "Connects to a MediaBrowserService." },
                { name: "MediaBrowserServiceCompat", desc: "Service for media browsing." },
                { name: "PlaybackStateCompat", desc: "Represents the playback state." },
                { name: "MediaMetadataCompat", desc: "Contains metadata about an item." }
            ]
        }
    },

    "exoplayer_full": {
        "androidx.media3.exoplayer": {
            description: "ExoPlayer - extensible media player library.",
            classes: [
                { name: "ExoPlayer", desc: "Media player interface and implementation." },
                { name: "ExoPlayer.Builder", desc: "Builder for ExoPlayer instances." },
                { name: "MediaItem", desc: "Representation of a media item." },
                { name: "MediaItem.Builder", desc: "Builder for MediaItem." },
                { name: "Player", desc: "Media player interface." },
                { name: "PlaybackException", desc: "Thrown when playback fails." }
            ],
            interfaces: [
                { name: "Player.Listener", desc: "Listener for player events." }
            ]
        },
        "androidx.media3.ui": {
            description: "UI components for ExoPlayer.",
            classes: [
                { name: "PlayerView", desc: "View for ExoPlayer playback." },
                { name: "PlayerControlView", desc: "Playback control view." }
            ]
        },
        "androidx.media3.common": {
            description: "Common classes for Media3.",
            classes: [
                { name: "C", desc: "Constants for media formats and types." },
                { name: "Format", desc: "Represents the format of media data." },
                { name: "Timeline", desc: "Defines media timeline structure." }
            ]
        }
    },

    // ==========================================
    // PAYMENT GATEWAYS
    // ==========================================

    "in_app_billing": {
        "com.android.billingclient.api": {
            description: "Google Play Billing Library for in-app purchases.",
            classes: [
                { name: "BillingClient", desc: "Main interface for communication between library and user code." },
                { name: "BillingClient.Builder", desc: "Builder for creating BillingClient instances." },
                { name: "Purchase", desc: "Represents an in-app billing purchase." },
                { name: "ProductDetails", desc: "Represents product information." },
                { name: "BillingResult", desc: "Result of a billing operation." },
                { name: "QueryProductDetailsParams", desc: "Parameters for querying product details." },
                { name: "BillingFlowParams", desc: "Parameters for launching billing flow." },
                { name: "AcknowledgePurchaseParams", desc: "Parameters for acknowledging a purchase." },
                { name: "ConsumeParams", desc: "Parameters for consuming a purchase." }
            ],
            interfaces: [
                { name: "PurchasesUpdatedListener", desc: "Listener for purchase updates." },
                { name: "BillingClientStateListener", desc: "Listener for billing client state." },
                { name: "ProductDetailsResponseListener", desc: "Callback for product details query." }
            ]
        }
    },

    "stripe_payment": {
        "com.stripe.android": {
            description: "Stripe Android SDK for payment processing.",
            classes: [
                { name: "PaymentConfiguration", desc: "Configuration for Stripe SDK." },
                { name: "Stripe", desc: "Entry point for Stripe integration." },
                { name: "PaymentIntent", desc: "Represents a payment intent." },
                { name: "SetupIntent", desc: "Represents a setup intent." },
                { name: "PaymentMethod", desc: "Represents a payment method." },
                { name: "Card", desc: "Represents a credit or debit card." }
            ]
        },
        "com.stripe.android.view": {
            description: "UI components for Stripe.",
            classes: [
                { name: "CardInputWidget", desc: "Widget for collecting card details." },
                { name: "CardMultilineWidget", desc: "Multi-line card input widget." }
            ]
        }
    },

    "paypal_sdk": {
        "com.paypal.checkout": {
            description: "PayPal Checkout SDK for Android.",
            classes: [
                { name: "PayPalCheckout", desc: "Main entry point for PayPal Checkout." },
                { name: "CreateOrder", desc: "Interface for creating orders." },
                { name: "OnApprove", desc: "Callback when payment is approved." },
                { name: "OnError", desc: "Callback when error occurs." },
                { name: "CheckoutConfig", desc: "Configuration for checkout." }
            ]
        }
    },

    // ==========================================
    // ANALYTICS
    // ==========================================

    "mixpanel_analytics": {
        "com.mixpanel.android.mpmetrics": {
            description: "Mixpanel analytics for product insights.",
            classes: [
                { name: "MixpanelAPI", desc: "Main interface for Mixpanel." },
                { name: "MixpanelAPI.People", desc: "Interface for user profile operations." }
            ]
        }
    },

    "amplitude_analytics": {
        "com.amplitude.android": {
            description: "Amplitude analytics SDK.",
            classes: [
                { name: "Amplitude", desc: "Main Amplitude client." },
                { name: "AmplitudeClient", desc: "Client for sending events." },
                { name: "Identify", desc: "Identify object for user properties." }
            ]
        }
    },

    // ==========================================
    // PUSH NOTIFICATIONS
    // ==========================================

    "onesignal_push": {
        "com.onesignal": {
            description: "OneSignal push notification SDK.",
            classes: [
                { name: "OneSignal", desc: "Main OneSignal SDK class." },
                { name: "OSNotification", desc: "Represents a notification." },
                { name: "OSNotificationOpenedResult", desc: "Result when notification is opened." }
            ],
            interfaces: [
                { name: "OSNotificationReceivedHandler", desc: "Handler for received notifications." },
                { name: "OSNotificationOpenedHandler", desc: "Handler for opened notifications." }
            ]
        }
    },

    // ==========================================
    //️ DATABASE ALTERNATIVES
    // ==========================================

    "realm_database": {
        "io.realm.kotlin": {
            description: "Realm Kotlin database SDK.",
            classes: [
                { name: "Realm", desc: "Main Realm instance." },
                { name: "RealmConfiguration", desc: "Configuration for Realm." },
                { name: "RealmObject", desc: "Base class for Realm objects." },
                { name: "RealmResults", desc: "Query results from Realm." },
                { name: "RealmQuery", desc: "Query builder for Realm." }
            ]
        }
    },

    "objectbox_db": {
        "io.objectbox": {
            description: "ObjectBox super-fast NoSQL database.",
            classes: [
                { name: "Box", desc: "Interface to a specific entity type." },
                { name: "BoxStore", desc: "Main entry point for ObjectBox." },
                { name: "Query", desc: "Query builder for ObjectBox." },
                { name: "QueryBuilder", desc: "Builder for creating queries." }
            ],
            annotations: [
                { name: "Entity", desc: "Marks a class as ObjectBox entity." },
                { name: "Id", desc: "Marks a field as the ID." }
            ]
        }
    },

    "sqldelight": {
        "app.cash.sqldelight.db": {
            description: "SQLDelight type-safe SQL APIs.",
            interfaces: [
                { name: "SqlDriver", desc: "Interface for SQL database drivers." }
            ]
        },
        "app.cash.sqldelight.coroutines": {
            description: "Coroutine extensions for SQLDelight.",
            functions: [
                { name: "asFlow", desc: "Convert query to Kotlin Flow." },
                { name: "awaitAsList", desc: "Await query results as list." },
                { name: "awaitAsOne", desc: "Await single query result." }
            ]
        }
    },

    // ==========================================
    // ADVANCED NETWORKING
    // ==========================================

    "graphql_apollo": {
        "com.apollographql.apollo3": {
            description: "Apollo GraphQL client for Android.",
            classes: [
                { name: "ApolloClient", desc: "Main Apollo client." },
                { name: "ApolloClient.Builder", desc: "Builder for ApolloClient." },
                { name: "ApolloCall", desc: "Represents a GraphQL call." }
            ]
        },
        "com.apollographql.apollo3.cache.normalized": {
            description: "Normalized cache for Apollo.",
            classes: [
                { name: "NormalizedCacheFactory", desc: "Factory for creating normalized cache." }
            ]
        }
    },

    "grpc_client": {
        "io.grpc": {
            description: "gRPC framework for RPC calls.",
            classes: [
                { name: "ManagedChannel", desc: "Channel for RPC calls." },
                { name: "ManagedChannelBuilder", desc: "Builder for channels." },
                { name: "CallOptions", desc: "Options for RPC calls." }
            ],
            interfaces: [
                { name: "Channel", desc: "Interface for communication channel." }
            ]
        }
    },

    // ==========================================
    // TESTING
    // ==========================================

    "unit_testing": {
        "org.junit": {
            description: "JUnit testing framework.",
            annotations: [
                { name: "Test", desc: "Marks a method as a test method." },
                { name: "Before", desc: "Run before each test method." },
                { name: "After", desc: "Run after each test method." },
                { name: "BeforeClass", desc: "Run once before all tests." },
                { name: "AfterClass", desc: "Run once after all tests." }
            ]
        },
        "org.mockito": {
            description: "Mockito mocking framework.",
            classes: [
                { name: "Mockito", desc: "Main mocking class." }
            ],
            functions: [
                { name: "mock", desc: "Create a mock object." },
                { name: "when", desc: "Stub a method call." },
                { name: "verify", desc: "Verify method invocation." }
            ]
        },
        "io.mockk": {
            description: "MockK - Kotlin mocking library.",
            functions: [
                { name: "mockk", desc: "Create a mock object." },
                { name: "every", desc: "Stub behavior." },
                { name: "verify", desc: "Verify calls." },
                { name: "coEvery", desc: "Stub suspend functions." },
                { name: "coVerify", desc: "Verify suspend calls." }
            ]
        }
    },

    "ui_testing": {
        "androidx.test.espresso": {
            description: "Espresso UI testing framework.",
            classes: [
                { name: "Espresso", desc: "Entry point for Espresso." },
                { name: "ViewInteraction", desc: "Interaction with a view." },
                { name: "ViewAction", desc: "Action to perform on a view." },
                { name: "ViewAssertion", desc: "Assertion on a view." }
            ],
            functions: [
                { name: "onView", desc: "Select a view for interaction." },
                { name: "onData", desc: "Select data in AdapterView." }
            ]
        },
        "androidx.test.espresso.matcher": {
            description: "Matchers for Espresso.",
            classes: [
                { name: "ViewMatchers", desc: "Collection of view matchers." }
            ]
        }
    },

    // ==========================================
    // GAMING
    // ==========================================

    "play_games": {
        "com.google.android.gms.games": {
            description: "Google Play Games Services.",
            classes: [
                { name: "PlayGames", desc: "Entry point for Play Games." },
                { name: "AchievementsClient", desc: "Client for achievements." },
                { name: "LeaderboardsClient", desc: "Client for leaderboards." },
                { name: "PlayersClient", desc: "Client for player information." }
            ]
        }
    },

    // ==========================================
    // DEPENDENCY INJECTION
    // ==========================================

    "hilt_di": {
        "dagger.hilt.android": {
            description: "Hilt dependency injection for Android.",
            annotations: [
                { name: "HiltAndroidApp", desc: "Marks Application class for Hilt setup." },
                { name: "AndroidEntryPoint", desc: "Marks Android components for injection." }
            ]
        },
        "javax.inject": {
            description: "JSR-330 dependency injection annotations.",
            annotations: [
                { name: "Inject", desc: "Marks injectable constructors, methods, fields." },
                { name: "Singleton", desc: "Singleton scope." },
                { name: "Named", desc: "String-based qualifier." }
            ]
        },
        "dagger": {
            description: "Dagger dependency injection.",
            annotations: [
                { name: "Module", desc: "Marks a module class." },
                { name: "Provides", desc: "Marks provider methods." },
                { name: "Binds", desc: "Binds an implementation to interface." }
            ]
        }
    },

    "koin_di": {
        "org.koin.core": {
            description: "Koin dependency injection core.",
            functions: [
                { name: "module", desc: "Create a Koin module." },
                { name: "single", desc: "Declare singleton." },
                { name: "factory", desc: "Declare factory." },
                { name: "get", desc: "Resolve dependency." }
            ]
        },
        "org.koin.android": {
            description: "Koin Android extensions.",
            functions: [
                { name: "startKoin", desc: "Start Koin container." }
            ]
        },
        "org.koin.androidx.viewmodel.dsl": {
            description: "Koin ViewModel DSL.",
            functions: [
                { name: "viewModel", desc: "Declare ViewModel." }
            ]
        }
    },

    // ==========================================
    // PAGING
    // ==========================================

    "paging3": {
        "androidx.paging": {
            description: "Paging library for gradual data loading.",
            classes: [
                { name: "PagingData", desc: "Container for paginated data." },
                { name: "PagingSource", desc: "Base class for loading data pages." },
                { name: "Pager", desc: "Primary entry point into Paging." },
                { name: "PagingConfig", desc: "Configuration for paging behavior." },
                { name: "LoadState", desc: "Represents load state." }
            ]
        },
        "androidx.paging.compose": {
            description: "Paging integration for Compose.",
            functions: [
                { name: "collectAsLazyPagingItems", desc: "Collect PagingData as LazyPagingItems." }
            ],
            classes: [
                { name: "LazyPagingItems", desc: "Items from PagingData Flow." }
            ]
        }
    },

    // ==========================================
    // ACCOMPANIST (COMPOSE UTILITIES)
    // ==========================================

    "accompanist_permissions": {
        "com.google.accompanist.permissions": {
            description: "Permission handling for Compose.",
            composables: [
                { name: "PermissionRequired", desc: "Composable for handling permissions." },
                { name: "rememberPermissionState", desc: "Remember permission state." },
                { name: "rememberMultiplePermissionsState", desc: "Remember multiple permissions." }
            ]
        }
    },

    "accompanist_systemuicontroller": {
        "com.google.accompanist.systemuicontroller": {
            description: "System UI controller for Compose.",
            composables: [
                { name: "rememberSystemUiController", desc: "Remember SystemUiController." }
            ],
            classes: [
                { name: "SystemUiController", desc: "Control system UI (status bar, nav bar)." }
            ]
        }
    },

    // ==========================================
    // REACTIVE PROGRAMMING
    // ==========================================

    "rxjava3_full": {
        "io.reactivex.rxjava3.core": {
            description: "RxJava 3 reactive programming.",
            classes: [
                { name: "Observable", desc: "Observable stream of data." },
                { name: "Single", desc: "Observable that emits single value." },
                { name: "Flowable", desc: "Observable with backpressure." },
                { name: "Maybe", desc: "Observable that emits 0 or 1 item." },
                { name: "Completable", desc: "Observable without value, only completion." }
            ],
            interfaces: [
                { name: "Observer", desc: "Observer of Observable." },
                { name: "SingleObserver", desc: "Observer of Single." }
            ]
        },
        "io.reactivex.rxjava3.schedulers": {
            description: "Schedulers for RxJava.",
            classes: [
                { name: "Schedulers", desc: "Factory for scheduler instances." }
            ]
        }
    },

    // ==========================================
    //️ CRASH REPORTING
    // ==========================================

    "sentry_crash": {
        "io.sentry": {
            description: "Sentry error tracking and performance monitoring.",
            classes: [
                { name: "Sentry", desc: "Main Sentry SDK class." },
                { name: "SentryOptions", desc: "Configuration for Sentry." },
                { name: "SentryEvent", desc: "Represents an event sent to Sentry." },
                { name: "Breadcrumb", desc: "Breadcrumb for debugging context." }
            ]
        },
        "io.sentry.android": {
            description: "Sentry Android integration.",
            classes: [
                { name: "AndroidOptions", desc: "Android-specific options." }
            ]
        }
    },

    "bugsnag": {
        "com.bugsnag.android": {
            description: "Bugsnag error monitoring.",
            classes: [
                { name: "Bugsnag", desc: "Main Bugsnag client." },
                { name: "Configuration", desc: "Bugsnag configuration." },
                { name: "ErrorTypes", desc: "Types of errors to capture." }
            ]
        }
    },
    
    // ==========================================
    // HARDWARE
    // ==========================================
    
    "flashlight_control": {
        "android.hardware.camera2": {
            description: "Camera2 API for controlling camera devices and flashlight.",
            classes: [
                { name: "CameraManager", desc: "System service for managing camera devices and torch mode." },
                { name: "CameraCharacteristics", desc: "Properties of a CameraDevice." }
            ]
        }
    },

};