import { randomTitleAndIcon } from "./shared";
import { logger } from "./logger";
/**
 * Base class for implementing tab attack functionality.
 * Provides core attack/restore logic and state management.
 *
 * @example
 * ```typescript
 * class MyAttacker extends TabAttacker {
 *   protected async attackTabs(): Promise<void> {
 *     // Implementation for attacking tabs
 *   }
 *
 *   protected restoreAllTabs(): void {
 *     // Implementation for restoring tabs
 *   }
 * }
 * ```
 */
export class TabAttacker {
    /**
     * Creates a new TabAttacker instance
     * @param intervalTime - Milliseconds between attacks (default: 3000ms)
     */
    constructor(intervalTime = 3000) {
        this.intervalTime = intervalTime;
        /** Current attack state */
        this.isAttacking = false;
        /** Interval ID for periodic attacks */
        this.attackInterval = null;
        /** Map of original tab states, keyed by tab ID */
        this.originalStates = new Map();
    }
    /**
     * Starts the tab attack
     * - Sets up attack interval
     * - Performs initial attack
     * - Logs attack start
     */
    async startAttack() {
        this.isAttacking = true;
        this.attackInterval = window.setInterval(() => this.attackTabs(), this.intervalTime);
        await this.attackTabs(); // Initial attack
        logger.info("Attack started");
    }
    /**
     * Stops the tab attack
     * - Clears attack interval
     * - Restores original tab states
     * - Logs attack stop
     */
    stopAttack() {
        this.isAttacking = false;
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
        this.restoreAllTabs();
        logger.info("Attack stopped");
    }
    /**
     * Returns current attack state
     * @returns true if attack is in progress, false otherwise
     */
    isCurrentlyAttacking() {
        return this.isAttacking;
    }
    /**
     * Abstract method to implement tab attacking logic
     * Must be implemented by derived classes
     * @throws Error if not implemented
     */
    async attackTabs() {
        throw new Error("Not implemented");
    }
    /**
     * Abstract method to implement tab restoration logic
     * Must be implemented by derived classes
     * @throws Error if not implemented
     */
    restoreAllTabs() {
        throw new Error("Not implemented");
    }
    /**
     * Stores the original state of a tab
     * Only stores if state hasn't been recorded yet
     * @param id - Tab identifier
     * @param state - Original tab state to store
     */
    storeOriginalState(id, state) {
        if (!this.originalStates.has(id)) {
            this.originalStates.set(id, state);
            logger.debug(`Stored original state for tab ${id}`);
        }
    }
    /**
     * Retrieves the original state of a tab
     * @param id - Tab identifier
     * @returns Original tab state if found, undefined otherwise
     */
    getOriginalState(id) {
        return this.originalStates.get(id);
    }
    /**
     * Gets a random title and icon for tab attack
     * @returns Random title and icon combination
     */
    getRandomTitleIcon() {
        return randomTitleAndIcon();
    }
}
