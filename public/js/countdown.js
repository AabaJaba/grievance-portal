// Countdown Timer Module
class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.timerElement = null;
        this.interval = null;
    }

    // Initialize countdown timer
    initialize() {
        this.createTimerElement();
        this.loadTargetDate();
        this.startTimer();
    }

    // Create timer element
    createTimerElement() {
        const timerHTML = `
            <div id="countdownTimer" class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-6 border border-pink-200">
                <div class="text-center">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">💕 Time Until We Meet</h3>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div class="bg-white rounded-lg p-2 shadow-sm">
                            <div id="days" class="text-2xl font-bold text-purple-600">00</div>
                            <div class="text-xs text-gray-600">Days</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 shadow-sm">
                            <div id="hours" class="text-2xl font-bold text-purple-600">00</div>
                            <div class="text-xs text-gray-600">Hours</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 shadow-sm">
                            <div id="minutes" class="text-2xl font-bold text-purple-600">00</div>
                            <div class="text-xs text-gray-600">Minutes</div>
                        </div>
                        <div class="bg-white rounded-lg p-2 shadow-sm">
                            <div id="seconds" class="text-2xl font-bold text-purple-600">00</div>
                            <div class="text-xs text-gray-600">Seconds</div>
                        </div>
                    </div>
                    <div class="mt-3">
                        <button id="setMeetingDate" class="text-sm text-purple-600 hover:text-purple-700 font-medium">
                            Set Meeting Date
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert timer after the header
        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('afterend', timerHTML);
            this.timerElement = document.getElementById('countdownTimer');
            this.setupEventListeners();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        const setMeetingDateBtn = document.getElementById('setMeetingDate');
        if (setMeetingDateBtn) {
            setMeetingDateBtn.addEventListener('click', () => {
                this.showDatePicker();
            });
        }
    }

    // Show date picker
    showDatePicker() {
        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        dateInput.className = 'hidden';
        document.body.appendChild(dateInput);
        
        dateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            this.setTargetDate(selectedDate);
            document.body.removeChild(dateInput);
        });
        
        dateInput.click();
    }

    // Set target date
    setTargetDate(date) {
        this.targetDate = date;
        storage.set('meetingDate', date.toISOString());
        this.updateTimer();
        this.updateHeaderDisplay();
        showNotification('Meeting date set successfully! 💕', 'success');
    }

    // Load target date from storage
    loadTargetDate() {
        const savedDate = storage.get('meetingDate');
        if (savedDate) {
            this.targetDate = new Date(savedDate);
            this.updateHeaderDisplay();
        }
    }

    // Start timer
    startTimer() {
        this.updateTimer();
        this.interval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    // Update timer display
    updateTimer() {
        if (!this.targetDate) {
            this.showNoDateMessage();
            return;
        }

        const now = new Date();
        const timeLeft = this.targetDate - now;

        if (timeLeft <= 0) {
            this.showMeetingTimeMessage();
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    // Show no date message
    showNoDateMessage() {
        const timerHTML = `
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">💕 Time Until We Meet</h3>
                <p class="text-gray-600 mb-3">Set a date to start the countdown!</p>
                <button id="setMeetingDate" class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700">
                    Set Meeting Date
                </button>
            </div>
        `;
        
        if (this.timerElement) {
            this.timerElement.innerHTML = timerHTML;
            this.setupEventListeners();
        }
    }

    // Show meeting time message
    showMeetingTimeMessage() {
        const timerHTML = `
            <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-800 mb-2">💕 It's Time!</h3>
                <p class="text-green-600 font-medium">Your meeting time has arrived!</p>
                <p class="text-gray-600 mt-2">Enjoy your time together! 💕</p>
                <button id="setMeetingDate" class="mt-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700">
                    Set New Date
                </button>
            </div>
        `;
        
        if (this.timerElement) {
            this.timerElement.innerHTML = timerHTML;
            this.setupEventListeners();
        }
    }

    // Stop timer
    stopTimer() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    // Get formatted target date
    getFormattedTargetDate() {
        if (!this.targetDate) return null;
        return this.targetDate.toLocaleString();
    }

    // Update header display
    updateHeaderDisplay() {
        const meetingDateDisplay = document.getElementById('meetingDateDisplay');
        const meetingDateText = document.getElementById('meetingDateText');
        
        if (this.targetDate && meetingDateDisplay && meetingDateText) {
            const formattedDate = this.targetDate.toLocaleDateString() + ' ' + 
                                this.targetDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            meetingDateText.textContent = formattedDate;
            meetingDateDisplay.classList.remove('hidden');
        } else if (meetingDateDisplay) {
            meetingDateDisplay.classList.add('hidden');
        }
    }
}

// Create and export countdown timer instance
const countdownTimer = new CountdownTimer();
