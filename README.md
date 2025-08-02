# 💕 Couple's Grievance Portal

A beautiful, private Progressive Web App (PWA) for couples to lovingly track and resolve disagreements in a collaborative, non-confrontational way.

## ✨ Features

- **Submit Grievances**: Simple form to add new grievances with title and description
- **Real-time Updates**: Uses Firebase Firestore for instant synchronization between partners
- **Status Tracking**: Three status levels (Pending, In Progress, Resolved) that either partner can update
- **PWA Ready**: Fully installable on mobile devices with offline support
- **Anonymous Authentication**: Secure shared space using Firebase anonymous auth
- **Cozy Design**: Warm, inviting interface with a calming color palette

## 🎨 Design Theme

The app features a "Cozy & Calm" design with:
- Soft, off-white background (#F8F7F4)
- Deep muted teal headers (#2A6F6F)
- Warm dusty rose accents (#E8A09A)
- Gentle status colors for different grievance states
- Rounded corners and soft shadows for a friendly feel

## 🚀 Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Anonymous Authentication
5. Get your Firebase config and replace the placeholder in `index.html`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 2. Firestore Security Rules

Set up these security rules in your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portals/{portalId}/grievances/{grievanceId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Deploy

You can deploy this to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **Firebase Hosting**: Use `firebase deploy`
- **GitHub Pages**: Push to a GitHub repository

### 4. Share with Your Partner

1. Open the app in your browser
2. Copy the Portal ID that appears in the top right
3. Share this ID with your partner
4. Your partner enters the same Portal ID to access your shared space

## 📱 PWA Installation

### On Mobile:
1. Open the app in Chrome/Safari
2. Tap the "Add to Home Screen" option
3. The app will now appear on your home screen

### On Desktop:
1. Open the app in Chrome
2. Click the install icon in the address bar
3. The app will install as a desktop application

## 🔧 Technical Details

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase Firestore (NoSQL database)
- **Authentication**: Firebase Anonymous Auth
- **Real-time**: Firestore real-time listeners
- **PWA**: Service Worker for offline functionality
- **Icons**: Feather Icons for a clean, minimal look

## 🎯 How It Works

1. **Portal Creation**: When you first visit, a unique Portal ID is generated
2. **Anonymous Auth**: Firebase creates an anonymous user session
3. **Real-time Sync**: All grievances are stored in Firestore and sync instantly
4. **Status Updates**: Either partner can change grievance status
5. **Offline Support**: Service worker caches the app for offline use

## 💝 Tips for Using

- **Be Loving**: Remember this is a tool for resolution, not confrontation
- **Update Status**: Keep the status current so you both know what's being worked on
- **Resolve Together**: Use the "In Progress" status when you're actively discussing
- **Celebrate**: Mark grievances as "Resolved" when you've found a solution together

## 🔒 Privacy & Security

- All data is stored securely in Firebase
- Anonymous authentication means no personal data is collected
- Portal IDs are randomly generated and private
- Only people with the Portal ID can access your shared space

## 🐛 Troubleshooting

**App won't load**: Check your Firebase configuration
**Real-time updates not working**: Verify Firestore security rules
**PWA not installing**: Ensure you're using HTTPS (required for PWA)
**Portal ID not showing**: Check browser console for Firebase errors

## 📄 License

This project is open source and available under the MIT License.

---

Made with 💕 for couples who want to communicate better 