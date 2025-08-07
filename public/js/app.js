// Main Application Logic
class LovePortalApp {
    constructor() {
        this.portalId = null;
        this.currentFilter = 'all';
        this.grievanceListener = null;
        this.initialized = false;
    }

    // Initialize the application
    async initialize() {
        try {
            console.log('Initializing app...');
            
            // Initialize Firebase
            await firebaseService.initialize();
            console.log('Signed in anonymously:', firebaseService.getCurrentUser().uid);
            
            // Check for saved portal ID
            const savedPortalId = storage.get('portalId');
            console.log('Saved portal ID:', savedPortalId);
            
            if (savedPortalId) {
                console.log('Found saved portal ID, entering portal:', savedPortalId);
                this.portalId = savedPortalId;
                await this.enterPortal(this.portalId);
            } else {
                console.log('No saved portal ID, showing portal entry screen');
                this.showPortalEntry();
            }
            
            this.initialized = true;
            
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification('Failed to initialize the app. Please refresh and try again.', 'error');
        }
    }

    // Show portal entry screen
    showPortalEntry() {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('portalEntry').classList.remove('hidden');
        
        // Add event listeners for portal entry
        this.setupPortalEntryListeners();
        
        // Initialize Feather icons
        feather.replace();
    }

    // Setup portal entry event listeners
    setupPortalEntryListeners() {
        const portalForm = document.getElementById('portalForm');
        const createNewPortalBtn = document.getElementById('createNewPortal');
        
        // Remove existing listeners
        const newPortalForm = portalForm.cloneNode(true);
        portalForm.parentNode.replaceChild(newPortalForm, portalForm);
        
        const newCreateBtn = createNewPortalBtn.cloneNode(true);
        createNewPortalBtn.parentNode.replaceChild(newCreateBtn, createNewPortalBtn);
        
        // Add new listeners
        document.getElementById('portalForm').addEventListener('submit', this.handlePortalEntry.bind(this));
        document.getElementById('createNewPortal').addEventListener('click', this.createNewPortal.bind(this));
    }

    // Handle portal entry form submission
    async handlePortalEntry(e) {
        e.preventDefault();
        
        const inputPortalId = document.getElementById('portalInput').value.trim().toUpperCase();
        
        if (!inputPortalId) {
            showNotification('Please enter a Portal ID', 'warning');
            return;
        }
        
        if (!validatePortalId(inputPortalId)) {
            showNotification('Portal ID must be 6 characters long', 'warning');
            return;
        }
        
        await this.enterPortal(inputPortalId);
    }

    // Create new portal
    createNewPortal() {
        const newPortalId = generatePortalId();
        this.enterPortal(newPortalId);
    }

    // Enter portal
    async enterPortal(portalIdToUse) {
        try {
            this.portalId = portalIdToUse;
            storage.set('portalId', this.portalId);
            
            // Show loading
            document.getElementById('portalEntry').classList.add('hidden');
            document.getElementById('loadingScreen').classList.remove('hidden');
            
            // Set portal ID in header
            document.getElementById('portalId').textContent = this.portalId;
            
            // Set up real-time listener
            this.setupGrievanceListener();
            
            // Show the app
            document.getElementById('loadingScreen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            
            // Setup app event listeners
            this.setupAppListeners();
            
            showNotification('Welcome to your Love Portal! 💕', 'success');
            
        } catch (error) {
            console.error('Error entering portal:', error);
            showNotification('Failed to enter portal. Please try again.', 'error');
        }
    }

    // Setup grievance listener
    setupGrievanceListener() {
        if (this.grievanceListener) {
            this.grievanceListener(); // Unsubscribe from previous listener
        }
        
        this.grievanceListener = firebaseService.setupGrievanceListener(
            this.portalId, 
            this.renderGrievances.bind(this)
        );
    }

    // Render grievances
    renderGrievances(grievances) {
        const container = document.getElementById('grievancesContainer');
        const emptyState = document.getElementById('emptyState');
        
        // Filter grievances based on current filter
        const filteredGrievances = this.currentFilter === 'all' 
            ? grievances 
            : grievances.filter(g => g.status === this.currentFilter);
        
        if (filteredGrievances.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        container.innerHTML = filteredGrievances.map(grievance => this.createGrievanceHTML(grievance)).join('');
        
        // Re-initialize Feather icons
        feather.replace();
        
        // Add event listeners to status selects
        this.setupGrievanceEventListeners();
    }

    // Create grievance HTML
    createGrievanceHTML(grievance) {
        return `
            <div class="bg-gray-50 rounded-xl p-6 card-hover border border-gray-100">
                <div class="flex items-start justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(grievance.title)}</h3>
                    <select 
                        class="status-select px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-purple-500"
                        data-id="${grievance.id}"
                        data-status="${grievance.status}"
                    >
                        <option value="pending" ${grievance.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${grievance.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="resolved" ${grievance.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                    </select>
                </div>
                <p class="text-gray-600 mb-4">${escapeHtml(grievance.description)}</p>
                <div class="flex items-center justify-between text-sm text-gray-500">
                    <span>Created ${formatDate(grievance.createdAt)}</span>
                    <span class="status-badge px-2 py-1 rounded-full text-xs font-medium status-${grievance.status}">
                        ${getStatusText(grievance.status)}
                    </span>
                </div>
            </div>
        `;
    }

    // Setup grievance event listeners
    setupGrievanceEventListeners() {
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', this.handleStatusChange.bind(this));
        });
    }

    // Handle status change
    async handleStatusChange(event) {
        const grievanceId = event.target.dataset.id;
        const newStatus = event.target.value;
        
        try {
            await firebaseService.updateGrievanceStatus(this.portalId, grievanceId, newStatus);
            showNotification('Status updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification(error.message, 'error');
        }
    }

    // Setup app event listeners
    setupAppListeners() {
        // Grievance form
        document.getElementById('grievanceForm').addEventListener('submit', this.handleGrievanceSubmit.bind(this));
        
        // Status filters
        document.querySelectorAll('.status-filter').forEach(button => {
            button.addEventListener('click', this.handleStatusFilter.bind(this));
        });
        
        // Copy portal ID
        document.getElementById('copyPortalId').addEventListener('click', this.copyPortalId.bind(this));
        
        // Switch portal
        document.getElementById('switchPortalMain').addEventListener('click', this.switchPortal.bind(this));
        
        // Initialize countdown timer
        countdownTimer.initialize();
    }

    // Handle grievance form submission
    async handleGrievanceSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        
        if (!title || !description) {
            showNotification('Please fill in both title and description.', 'warning');
            return;
        }
        
        if (description.length > APP_CONFIG.maxGrievanceLength) {
            showNotification(`Description must be less than ${APP_CONFIG.maxGrievanceLength} characters.`, 'warning');
            return;
        }
        
        try {
            await firebaseService.addGrievance(this.portalId, { title, description });
            
            // Clear form
            document.getElementById('title').value = '';
            document.getElementById('description').value = '';
            
            showNotification('Grievance added with love! 💕', 'success');
            
        } catch (error) {
            console.error('Error adding grievance:', error);
            showNotification(error.message, 'error');
        }
    }

    // Handle status filter
    handleStatusFilter(e) {
        // Update active state
        document.querySelectorAll('.status-filter').forEach(btn => {
            btn.classList.remove('active', 'bg-purple-100', 'text-purple-700');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        });
        e.target.classList.add('active', 'bg-purple-100', 'text-purple-700');
        e.target.classList.remove('bg-gray-100', 'text-gray-600');
        
        // Update filter
        this.currentFilter = e.target.dataset.status;
        
        // Re-render (the real-time listener will handle this)
        this.setupGrievanceListener();
    }

    // Copy portal ID
    async copyPortalId() {
        const success = await copyToClipboard(this.portalId);
        
        if (success) {
            const button = document.getElementById('copyPortalId');
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('text-green-600');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('text-green-600');
            }, 2000);
        } else {
            showNotification('Failed to copy Portal ID. Please copy it manually: ' + this.portalId, 'warning');
        }
    }

    // Switch portal
    switchPortal() {
        if (confirm('Switch to a different portal? This will clear your current portal.')) {
            // Clear saved portal ID
            storage.remove('portalId');
            
            // Unsubscribe from current listener
            if (this.grievanceListener) {
                this.grievanceListener();
            }
            
            // Hide app and show portal entry
            document.getElementById('app').classList.add('hidden');
            this.showPortalEntry();
        }
    }
}

// Create and export app instance
const app = new LovePortalApp(); 