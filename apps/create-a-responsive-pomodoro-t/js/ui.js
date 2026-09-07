/* js/ui.js */
export class UIController {
    constructor() {
        this.timeDisplay = document.getElementById('time-display');
        this.circle = document.querySelector('.progress-ring__circle');
        this.statToday = document.getElementById('stat-today');
        this.statTotal = document.getElementById('stat-total');
        this.alarm = document.getElementById('alarm-sound');
        
        this.radius = this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    }

    updateDisplay(seconds, totalSeconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        this.timeDisplay.textContent = timeString;
        document.title = `${timeString} - Pomodoro`;

        // Update SVG Progress
        const offset = this.circumference - (seconds / totalSeconds) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }

    updateStats(stats) {
        this.statToday.textContent = stats.dailySessions;
        this.statTotal.textContent = stats.totalSessions;
    }

    setTheme(mode) {
        document.body.setAttribute('data-theme', mode);
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    playAlarm() {
        this.alarm.play().catch(e => console.log("Audio play blocked until interaction"));
    }
}
