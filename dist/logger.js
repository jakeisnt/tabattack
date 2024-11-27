const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
class Logger {
    constructor() {
        this.config = {
            enabled: true,
            minLevel: 'debug'
        };
    }
    configure(config) {
        this.config = { ...this.config, ...config };
    }
    shouldLog(level) {
        return this.config.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
    }
    debug(message, ...args) {
        if (this.shouldLog('debug')) {
            console.log(`🐛 ${message}`, ...args);
        }
    }
    info(message, ...args) {
        if (this.shouldLog('info')) {
            console.log(`ℹ️ ${message}`, ...args);
        }
    }
    warn(message, ...args) {
        if (this.shouldLog('warn')) {
            console.warn(`⚠️ ${message}`, ...args);
        }
    }
    error(message, error, ...args) {
        if (this.shouldLog('error')) {
            console.error(`❌ ${message}`, error, ...args);
        }
    }
}
export const logger = new Logger();
