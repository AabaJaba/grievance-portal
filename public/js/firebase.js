// Firebase Service Module
class FirebaseService {
    constructor() {
        this.db = null;
        this.auth = null;
        this.currentUser = null;
    }

    // Initialize Firebase
    async initialize() {
        try {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            this.auth = firebase.auth();
            
            // Sign in anonymously
            const userCredential = await this.auth.signInAnonymously();
            this.currentUser = userCredential.user;
            
            console.log('Firebase initialized successfully');
            return this.currentUser;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Set up real-time listener for grievances
    setupGrievanceListener(portalId, callback) {
        console.log('Setting up real-time listener for portal:', portalId);
        
        return this.db.collection('portals').doc(portalId).collection('grievances')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log('Received snapshot with', snapshot.size, 'documents');
                const grievances = [];
                snapshot.forEach((doc) => {
                    grievances.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                callback(grievances);
            }, (error) => {
                console.error('Error listening to grievances:', error);
                console.error('Error details:', error.code, error.message);
                
                if (error.code === 'permission-denied') {
                    throw new Error('Permission denied. Please check your Firebase security rules.');
                } else {
                    throw new Error('Error connecting to database: ' + error.message);
                }
            });
    }

    // Add new grievance
    async addGrievance(portalId, grievanceData) {
        try {
            console.log('Adding grievance to portal:', portalId);
            
            const docRef = await this.db.collection('portals').doc(portalId).collection('grievances').add({
                ...grievanceData,
                status: 'pending',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Grievance added successfully with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding grievance:', error);
            console.error('Error details:', error.code, error.message);
            
            if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your Firebase security rules.');
            } else {
                throw new Error('Failed to add grievance: ' + error.message);
            }
        }
    }

    // Update grievance status
    async updateGrievanceStatus(portalId, grievanceId, newStatus) {
        try {
            await this.db.collection('portals').doc(portalId).collection('grievances')
                .doc(grievanceId)
                .update({
                    status: newStatus,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Error updating status:', error);
            throw new Error('Failed to update status. Please try again.');
        }
    }
}

// Create and export Firebase service instance
const firebaseService = new FirebaseService(); 