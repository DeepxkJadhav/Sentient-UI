/* js/storage.js */
export const StorageManager = {
    KEY: 'pomodoro_stats',

    getStats() {
        const data = localStorage.getItem(this.KEY);
        const defaultStats = {
            totalSessions: 0,
            dailySessions: 0,
            lastDate: new Date().toLocaleDateString()
        };

        if (!data) return defaultStats;

        let stats = JSON.parse(data);
        
        // Reset daily counter if day changed
        const today = new Date().toLocaleDateString();
        if (stats.lastDate !== today) {
            stats.dailySessions = 0;
            stats.lastDate = today;
        }

        return stats;
    },

    incrementSession() {
        const stats = this.getStats();
        stats.totalSessions++;
        stats.dailySessions++;
        localStorage.setItem(this.KEY, JSON.stringify(stats));
        return stats;
    }
};
