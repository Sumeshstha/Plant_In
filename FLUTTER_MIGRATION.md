# PlantIn Code Migration: Flutter & Dart Mobile App Blueprint 🌱

This guide details the step-by-step procedure to migrate your existing **PlantIn** full-stack web application structure to a native mobile application (iOS/Android) built in **Flutter & Dart**. 

We have generated an entire production-ready Flutter workspace scaffolding complete with custom state providers, data models, layout indices, and API bridges directly in your `/flutter_project` directory! You can download this entire package as a `.ZIP` directly from the AI Studio **Settings** menu at any time.

---

## Part 1: Initial Local Environment Setup (From Scratch) 🛠️

If you do not have the Flutter SDK configured on your local machine, perform these commands:

### 1. Install Flutter SDK
- Download the stable Flutter SDK from [flutter.dev/docs/get-started](https://flutter.dev/get-started/install).
- Extract the zip file and add the `flutter/bin` folder to your system environment `PATH`.
- Verify your local environment and toolings (Android Studio, Xcode, VS Code plugins) by running:
  ```bash
  flutter doctor
  ```

### 2. Scaffold a Fresh Flutter Project Template
If initializing empty, create your shell template:
```bash
flutter create plant_in --org com.yourdomain.plantin
cd plant_in
```
*(Alternatively, copy and paste the generated `/flutter_project` codebase folder we created directly inside your workstation!)*

### 3. Add Pub Dependencies
Modify your local `pubspec.yaml` using the configured packages or execute the command:
```bash
flutter pub add provider google_fonts http intl camera webview_flutter shared_preferences
```

---

## Part 2: Folder Structure Overview 📂

Ensure your target `/lib` folder represents this clean MVVM structural paradigm:

```text
lib/
├── main.dart                 # App Entry Point & Tab Controller Setup
├── models/
│   └── plant_models.dart     # Matches types.ts (Plant, Space, Task, Tip, JournalEntry)
├── services/
│   ├── garden_state.dart     # Central ChangeNotifier managing State Flows
│   └── api_service.dart      # HTTP Bridge to secure port 3000 Node.js backend
└── pages/
    ├── home_page.dart        # Plant Overview, Daily Tasks, and Carousel Tips
    ├── garden_page.dart      # Interactive Plant Grid (Watering, Feeding, Vitality)
    ├── calendar_page.dart    # Dual Scheduler (Gregorian Calendar & Nepalese B.S. Patro)
    ├── scan_page.dart        # Camera scanner proxying /api/identify-plant
    └── chat_page.dart        # Expert AI Botanist Chat powered by Gemini
```

---

## Part 3: Deep-Dive Implementation Breakdown 🚀

### 1. Main Entrypoint (`lib/main.dart`)
Sets up the Material 3 design palette initialized with an **Emerald Green seed color**. Wraps the application inside a multi-provider framework and hosts an elegant `BottomNavigationBar` controller matching the layout tabs! (Available in `/flutter_project/lib/main.dart`)

### 2. Matching State Engine (`lib/services/garden_state.dart`)
Replicates the React context logic (`GardenContext.tsx`) perfectly. Tracks simulated UTC dates, logs daily accomplishments, handles custom operations, and increases plant health/vitality scales upon action. (Available in `/flutter_project/lib/services/garden_state.dart`)

### 3. Dual Traditional Calendar Selector (`lib/pages/calendar_page.dart`)
This implements the core requested feature of navigating between:
- **Classic Gregorian (A.D.) calendar**: Grouping tasks dynamically based on intervals/dates.
- **Traditional B.S. Nepalese Patro (नेपाली पात्रो)**: Day-strip navigation featuring Traditional Astronomical details, lunar days (Tithis), and planting schedules using translated Nepali digits. (Available in `/flutter_project/lib/pages/calendar_page.dart`)

### 4. Smart Scan Scanner (`lib/pages/scan_page.dart` & `api_service.dart`)
Allows local camera capture and uploads base64 binary content. Coordinates with your cloud hosting via HTTP REST to trigger the custom backend router `/api/identify-plant`, preserving the offline manual backup and Gemini AI fallback! (Available in `/flutter_project/lib/pages/scan_page.dart`)

---

## Part 4: Advanced Cross-Platform APIs Integrations ☁️

To achieve **free, scalable production-ready features** requested for Clerk, Algolia, SendGrid, and Firebase, follow these procedures directly in your Flutter + Server environment:

### 1. Clerk Authentication with Flutter
Clerk does not have a dedicated prepackaged SDK for Flutter yet, but you can integrate it seamlessly via standard JWT Token bearer headers:
- Set up a Clerk organization in your [Clerk Dashboard](https://dashboard.clerk.com).
- In Flutter, utilize a sleek `Webview` or custom OAuth launch redirector (e.g. `url_launcher`) to handle login securely.
- Store the returned JSON Web Token (JWT) locally inside `shared_preferences`.
- Attach the JWT into all proxy headers:
  ```dart
  headers: {
    'Authorization': 'Bearer $clerkToken',
    'Content-Type': 'application/json'
  }
  ```

### 2. Fast Aloglia Search Client
Instantly query your species collections:
- Import `algolia` package in `pubspec.yaml`:
  ```yaml
  algolia: ^1.1.2
  ```
- Initialize inside a dedicated search service:
  ```dart
  import 'package:algolia/algolia.dart';

  class SearchService {
    static const Algolia algolia = Algolia.init(
      applicationId: 'YOUR_ALGOLIA_APP_ID',
      apiKey: 'YOUR_SEARCH_ONLY_API_KEY',
    );
  }
  ```

### 3. SendGrid Email OTP
Keep secrets safe! **Never** invoke SendGrid API keys directly in Flutter. Instead, proxy them through an Express backend route:
- In `server.ts` / your cloud function, handle the OTP generation:
  ```javascript
  import sgMail from '@sendgrid/mail';
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  app.post('/api/auth/send-otp', async (req, res) => {
    const { email, otp } = req.body;
    await sgMail.send({
      to: email,
      from: 'assistant@plantin.com',
      subject: 'Your PlantIn OTP Verification',
      text: `Your OTP is: ${otp}`,
    });
    res.json({ success: true });
  });
  ```
- Trigger the REST endpoint from Dart inside `ScanPage` or login pages.

---

## Part 5: Deployment Steps 📱

When you are ready to compile and distribute your Flutter application for free:

1. **Android Build**:
   ```bash
   flutter build apk --split-per-abi
   ```
   Upload the resultant `.apk` directly to GitHub Releases or Google Play Console for unlimited free distributed testing.
2. **iOS Build**:
   ```bash
   flutter build ipa --export-method=ad-hoc
   ```
   Deploy directly to Apple TestFlight using your development credentials.
