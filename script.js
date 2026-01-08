// DOM Elements
const inputSection = document.querySelector('.input-section');
const countdownSection = document.getElementById('countdown-section');
const expiredMessage = document.getElementById('expired-message');
const eventNameInput = document.getElementById('event-name');
const eventDateInput = document.getElementById('event-date');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const newCountdownBtn = document.getElementById('new-countdown-btn');
const eventTitle = document.getElementById('event-title');
const expiredEvent = document.getElementById('expired-event');

// Time display elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let countdownInterval;
let targetDate;
let eventName;

// Set minimum date to now
function setMinDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    eventDateInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Start countdown
function startCountdown() {
    eventName = eventNameInput.value.trim() || 'Countdown';
    const dateValue = eventDateInput.value;
    
    if (!dateValue) {
        alert('Please select a date and time!');
        return;
    }
    
    targetDate = new Date(dateValue).getTime();
    const now = new Date().getTime();
    
    if (targetDate <= now) {
        alert('Please select a future date and time!');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('countdownTarget', targetDate);
    localStorage.setItem('countdownEvent', eventName);
    
    // Show countdown section
    inputSection.style.display = 'none';
    expiredMessage.style.display = 'none';
    countdownSection.style.display = 'block';
    eventTitle.textContent = eventName;
    
    // Start the interval
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Update countdown display
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance <= 0) {
        clearInterval(countdownInterval);
        showExpiredMessage();
        return;
    }
    
    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update display
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// Show expired message
function showExpiredMessage() {
    countdownSection.style.display = 'none';
    expiredMessage.style.display = 'block';
    expiredEvent.textContent = `"${eventName}" has arrived!`;
    localStorage.removeItem('countdownTarget');
    localStorage.removeItem('countdownEvent');
}

// Reset countdown
function resetCountdown() {
    clearInterval(countdownInterval);
    localStorage.removeItem('countdownTarget');
    localStorage.removeItem('countdownEvent');
    
    countdownSection.style.display = 'none';
    expiredMessage.style.display = 'none';
    inputSection.style.display = 'flex';
    
    eventNameInput.value = '';
    eventDateInput.value = '';
    setMinDate();
}

// Check for saved countdown on page load
function checkSavedCountdown() {
    const savedTarget = localStorage.getItem('countdownTarget');
    const savedEvent = localStorage.getItem('countdownEvent');
    
    if (savedTarget && savedEvent) {
        targetDate = parseInt(savedTarget);
        eventName = savedEvent;
        
        const now = new Date().getTime();
        if (targetDate > now) {
            inputSection.style.display = 'none';
            countdownSection.style.display = 'block';
            eventTitle.textContent = eventName;
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
        } else {
            showExpiredMessage();
        }
    }
}

// Event listeners
startBtn.addEventListener('click', startCountdown);
resetBtn.addEventListener('click', resetCountdown);
newCountdownBtn.addEventListener('click', resetCountdown);

// Initialize
setMinDate();
checkSavedCountdown();
