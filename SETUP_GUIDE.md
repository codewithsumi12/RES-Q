# RES-Q Emergency Response Platform
## Complete Setup Guide

---

## 📁 Project Structure

```
resq-app/
├── public/
│   ├── index.html              # App entry point
│   └── index-standalone.html  # 🚀 Fully working standalone demo
├── src/
│   ├── firebase/
│   │   ├── config.js           # Firebase credentials
│   │   └── firebase.js         # Firebase initialization
│   ├── context/
│   │   └── AuthContext.js      # Auth state management
│   ├── services/
│   │   ├── sosService.js       # SOS alert logic (Firestore + RTDB)
│   │   ├── locationService.js  # GPS + nearby places (Overpass API)
│   │   └── notificationService.js  # Push + audio + WhatsApp alerts
│   ├── pages/
│   │   ├── Login.js            # Authentication - sign in
│   │   ├── Signup.js           # 2-step registration
│   │   ├── Dashboard.js        # Main SOS interface
│   │   ├── MapPage.js          # Live Leaflet map
│   │   ├── Profile.js          # Profile + QR code
│   │   ├── Subscription.js     # Plans + Razorpay payment
│   │   ├── SOSHistory.js       # Alert history
│   │   └── AdminPanel.js       # Admin dashboard
│   ├── components/
│   │   └── Layout.js           # Sidebar + topbar shell
│   ├── App.js                  # Router + auth guards
│   └── index.js                # Entry point
├── firebase.json               # Firebase hosting config
├── firestore.rules             # Firestore security rules
├── database.rules.json         # Realtime DB security rules
└── package.json
```

---

## 🚀 Quick Start (Standalone Demo)

**No installation required!** Open the standalone HTML file directly:

```bash
# Open in browser directly
open public/index-standalone.html

# Or serve locally
npx serve public/
```

**Demo credentials:**
- Email: `demo@resq.app` | Password: `demo1234`
- Admin: Use any email containing "admin" (e.g. `admin@resq.app`)

---

## ⚙️ Full React App Setup

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd resq-app
npm install
```

### Step 2: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → name it `resq-app`
3. Enable **Google Analytics** (optional)
4. Click **"Create Project"**

### Step 3: Enable Firebase Services

In your Firebase project console:

#### Authentication
```
Firebase Console → Authentication → Sign-in method
→ Enable "Email/Password"
→ Enable "Phone" (for OTP, optional)
```

#### Firestore Database
```
Firebase Console → Firestore Database → Create database
→ Start in "production mode"
→ Choose your region (e.g., asia-south1 for India)
```

#### Realtime Database
```
Firebase Console → Realtime Database → Create database
→ Start in "locked mode"
→ Choose region
```

### Step 4: Get Firebase Config

```
Firebase Console → Project Settings → Your apps
→ Click "</>" (Web) → Register app
→ Copy the firebaseConfig object
```

### Step 5: Create .env File

```bash
# Create .env in project root
cat > .env << 'EOF'
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc123
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_RAZORPAY_KEY=rzp_test_your_key_here
EOF
```

### Step 6: Deploy Firestore Security Rules

Copy contents of `firestore.rules` to Firebase Console:
```
Firebase Console → Firestore → Rules → Edit rules → Publish
```

### Step 7: Deploy Realtime Database Rules

Copy contents of `database.rules.json` to Firebase Console:
```
Firebase Console → Realtime Database → Rules → Edit → Publish
```

### Step 8: Run Development Server

```bash
npm start
# App opens at http://localhost:3000
```

---

## 💳 Razorpay Integration

### Get API Keys
1. Create account at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys → Generate Keys
3. Copy **Key ID** (starts with `rzp_test_...`)
4. Add to `.env` as `REACT_APP_RAZORPAY_KEY`

### Payment Flow
- User clicks "Upgrade" → Razorpay checkout opens
- On success → Firebase Firestore updates subscription field
- Subscription status checked app-wide via AuthContext

---

## 🗺️ Maps Configuration

The app uses **OpenStreetMap + Leaflet** (completely free, no API key needed).

For nearby places, it uses the **Overpass API** (also free):
- Hospitals, Police Stations, Fire Stations, Pharmacies
- Works automatically without any configuration

**Optional: Google Maps**
If you want Google Maps instead:
1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API + Places API
3. Add to `.env` as `REACT_APP_GOOGLE_MAPS_API_KEY`

---

## 🔒 Security Rules

### Firestore Rules (firestore.rules)
```
Users can only read/write their own data
Admins can read all data
SOS alerts are readable by all authenticated users
```

### Realtime Database Rules (database.rules.json)
```
Active SOS readable by all authenticated users
SOS locations only writable by the SOS owner
```

---

## 📱 React Native Mobile App

For the mobile app, create a new React Native project:

```bash
npx react-native init ResQMobile
cd ResQMobile

# Install dependencies
npm install @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-firebase/firestore @react-native-firebase/database
npm install react-native-maps react-native-permissions
npm install react-native-push-notification @react-native-async-storage/async-storage
```

The mobile app uses the same Firebase backend. The core logic from
`src/services/` can be reused with minor React Native adaptations:
- Replace `leaflet` with `react-native-maps`
- Replace browser `Notification` API with `react-native-push-notification`
- Replace `navigator.geolocation` with `react-native-geolocation-service`

**Build APK:**
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🚀 Firebase Hosting Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting + Firestore + Realtime DB)
firebase init

# Build React app
npm run build

# Deploy
firebase deploy

# Your app will be live at:
# https://your-project-id.web.app
```

---

## 🧪 Testing the App

### 1. SOS Flow
- Login → Dashboard → Click SOS button
- Watch countdown (3 seconds)
- Verify alert sound + vibration
- Check SOS timer starts
- Click "I'm Safe" to cancel

### 2. Map
- Navigate to Live Map
- Allow location permissions
- Toggle between hospital/police/fire/pharmacy
- Click any marker for popup with navigation link

### 3. Admin Panel
- Login with email containing "admin"
- View Dashboard stats + activity chart
- Switch to Users tab → change roles
- Switch to Live Alerts tab

### 4. Profile + QR
- Go to Profile → Edit Profile
- Update name, blood group, add contacts
- Save → QR auto-regenerates
- Download QR as PNG

### 5. Subscription
- Go to Subscription → click "Upgrade to Pro"
- In demo mode: simulates Razorpay + upgrades immediately
- Plan badge updates throughout the app

---

## 🌐 Environment Variables Reference

| Variable | Description | Required |
|---|---|---|
| `REACT_APP_FIREBASE_API_KEY` | Firebase project API key | ✅ |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | ✅ |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `REACT_APP_FIREBASE_DATABASE_URL` | Realtime DB URL | ✅ |
| `REACT_APP_RAZORPAY_KEY` | Razorpay key ID | 💳 |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps (optional) | ⚙️ |

---

## 📞 Emergency Numbers (India)
| Service | Number |
|---|---|
| Police | 100 |
| Fire | 101 |
| Ambulance | 108 |
| National Emergency | 112 |
| Women Helpline | 1091 |
| Disaster Management | 1078 |

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend Web | React 18 + React Router 6 |
| Styling | Pure CSS (no Tailwind needed for standalone) |
| Maps | Leaflet.js + OpenStreetMap (free) |
| Nearby Places | Overpass API (free) |
| Backend | Firebase (Auth + Firestore + Realtime DB) |
| Payments | Razorpay |
| QR Code | qrcode.js |
| Notifications | Web Notifications API + Web Audio API |
| Mobile | React Native (separate project) |
| Hosting | Firebase Hosting |

---

## 🐛 Common Issues & Fixes

**"Location not available"**
→ Use HTTPS or localhost (browsers block geolocation on HTTP)
→ Allow location permission in browser settings

**"Firebase not initialized"**
→ Check your `.env` file has all 7 variables
→ Restart dev server after editing `.env`

**"Overpass API timeout"**
→ Overpass API has rate limits — wait 30 seconds and retry
→ The app gracefully handles this with an error toast

**"QR code not generating"**
→ The QRCode library requires a DOM element — ensure profile page is visible

**Payment not working**
→ Use Razorpay test keys (`rzp_test_...`) in development
→ Load Razorpay script from CDN (done automatically in the code)

---

Built with ❤️ for emergency response — Stay safe, save lives.
