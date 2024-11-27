import { randomTitleAndIcon } from './shared';
import { logger } from './logger';
export class TabAttacker {
    constructor(intervalTime = 3000) {
        this.intervalTime = intervalTime;
        this.isAttacking = false;
        this.attackInterval = null;
        this.originalStates = new Map();
    }
    async startAttack() {
        this.isAttacking = true;
        this.attackInterval = window.setInterval(() => this.attackTabs(), this.intervalTime);
        await this.attackTabs(); // Initial attack
        logger.info('Attack started');
    }
    stopAttack() {
        this.isAttacking = false;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.restoreAllTabs();
        logger.info('Attack stopped');
    }
    isCurrentlyAttacking() {
        return this.isAttacking;
    }
    async attackTabs() {
        // To be implemented by extension or demo versions
    }
    restoreAllTabs() {
        // To be implemented by extension or demo versions
    }
    storeOriginalState(id, state) {
        if (!this.originalStates.has(id)) {
            this.originalStates.set(id, state);
            logger.debug(`Stored original state for tab ${id}`);
        }
    }
    getOriginalState(id) {
        return this.originalStates.get(id);
    }
    getRandomTitleIcon() {
        return randomTitleAndIcon();
    }
}
