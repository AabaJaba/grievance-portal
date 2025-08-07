// Utility Functions

// Generate a random portal ID
function generatePortalId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format date for display
function formatDate(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString();
}

// Get status text from status key
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
    };
    return statusMap[status] || status;
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-black'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Validate portal ID format
function validatePortalId(portalId) {
    return portalId && portalId.length === APP_CONFIG.portalIdLength;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Countdown Timer Functions
function calculateTimeUntil(targetDate) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;
    
    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isOverdue: true
        };
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return {
        days,
        hours,
        minutes,
        seconds,
        isOverdue: false
    };
}

function formatCountdown(timeObj) {
    if (timeObj.isOverdue) {
        return {
            days: '0',
            hours: '0',
            minutes: '0',
            seconds: '0',
            status: 'overdue'
        };
    }
    
    return {
        days: timeObj.days.toString().padStart(2, '0'),
        hours: timeObj.hours.toString().padStart(2, '0'),
        minutes: timeObj.minutes.toString().padStart(2, '0'),
        seconds: timeObj.seconds.toString().padStart(2, '0'),
        status: 'counting'
    };
}

function updateCountdownDisplay(targetDate) {
    const timeUntil = calculateTimeUntil(targetDate);
    const formatted = formatCountdown(timeUntil);
    
    // Update display elements
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');
    const statusEl = document.getElementById('countdown-status');
    
    if (daysEl) daysEl.textContent = formatted.days;
    if (hoursEl) hoursEl.textContent = formatted.hours;
    if (minutesEl) minutesEl.textContent = formatted.minutes;
    if (secondsEl) secondsEl.textContent = formatted.seconds;
    
    if (statusEl) {
        if (formatted.status === 'overdue') {
            statusEl.textContent = 'Meeting time! 💕';
            statusEl.className = 'text-pink-600 font-semibold';
        } else {
            statusEl.textContent = 'Until our next meeting';
            statusEl.className = 'text-gray-600';
        }
    }
    
    return formatted.status === 'overdue';
}

// Local storage helpers
const storage = {
    get: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
}; 