/* js/app.js */
import { TimerEngine } from './timer.js';
import { UIController } from './ui.js';
import { StorageManager } from './storage.js';

const CONFIG = {
    work: 25,
    short: 5,
    long: 15
};

class App {
    constructor() {
        this.ui = new UIController();
        this.currentMode = 'work';
        
        this.timer = new TimerEngine(
            (remaining, total) => this.ui.updateDisplay(remaining, total),
            () => this.handleTimerComplete()
        );

        this.init();
    }

    init() {
        // Event Listeners
        document.getElementById('start-btn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetTimer());
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Initial Load
        this.ui.updateStats(StorageManager.getStats());
        this.resetTimer();
    }

    toggleTimer() {
        const btn = document.getElementById('start-btn');
        if (this.timer.isRunning) {
            this.timer.pause();
            btn.textContent = 'START';
        } else {
            this.timer.start(CONFIG[this.currentMode]);
            btn.textContent = 'PAUSE';
        }
    }

    resetTimer() {
        this.timer.reset(CONFIG[this.currentMode]);
        document.getElementById('start-btn').textContent = 'START';
    }

    switchMode(mode) {
        this.currentMode = mode;
        this.ui.setTheme(mode);
        this.resetTimer();
    }

    handleTimerComplete() {
        this.ui.playAlarm();
        document.getElementById('start-btn').textContent = 'START';
        
        if (this.currentMode === 'work') {
            const stats = StorageManager.incrementSession();
            this.ui.updateStats(stats);
            // Auto-switch to break after work
            this.switchMode('short');
        } else {
            this.switchMode('work');
        }
        
        alert(`${this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1)} session finished!`);
    }
}

// Start the application
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
