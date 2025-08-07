// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWpMpp7WAvIrP2_5v1quV3sNEDALWnuR4",
    authDomain: "grievance-portal-46adc.firebaseapp.com",
    projectId: "grievance-portal-46adc",
    storageBucket: "grievance-portal-46adc.firebasestorage.app",
    messagingSenderId: "855890469658",
    appId: "1:855890469658:web:e477b1c2d69c1c342902a3"
};

// App Configuration
const APP_CONFIG = {
    name: "N & J's Love Portal",
    version: "1.0.0",
    portalIdLength: 6,
    maxGrievanceLength: 500,
    nextMeetingDate: "2025-08-14T19:00:00", // Valentine's Day at 6 PM - Change this to your next meeting
    statusOptions: {
        pending: { label: "Pending", color: "status-pending" },
        "in-progress": { label: "In Progress", color: "status-in-progress" },
        resolved: { label: "Resolved", color: "status-resolved" }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig, APP_CONFIG };
} 