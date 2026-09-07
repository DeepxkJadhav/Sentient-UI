/* js/timer.js */
export class TimerEngine {
    constructor(onTick, onComplete) {
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.timerId = null;
        this.timeLeft = 0;
        this.duration = 0;
        this.isRunning = false;
        this.endTime = null;
    }

    start(minutes) {
        if (this.isRunning) return;
        
        this.duration = minutes * 60;
        if (this.timeLeft === 0) this.timeLeft = this.duration;
        
        this.isRunning = true;
        this.endTime = Date.now() + (this.timeLeft * 1000);
        
        this.tick();
    }

    pause() {
        this.isRunning = false;
        clearTimeout(this.timerId);
    }

    reset(minutes) {
        this.pause();
        this.timeLeft = minutes * 60;
        this.duration = minutes * 60;
        this.onTick(this.timeLeft, this.duration);
    }

    tick() {
        if (!this.isRunning) return;

        const now = Date.now();
        this.timeLeft = Math.max(0, Math.round((this.endTime - now) / 1000));

        this.onTick(this.timeLeft, this.duration);

        if (this.timeLeft <= 0) {
            this.isRunning = false;
            this.onComplete();
        } else {
            // Self-correcting logic: Adjust next tick based on drift
            const nextTick = 1000 - (Date.now() - now);
            this.timerId = setTimeout(() => this.tick(), nextTick);
        }
    }
}
