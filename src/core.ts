import { TitleIcon, TabState } from './types';
import { randomTitleAndIcon } from './shared';
import { logger } from './logger';

export class TabAttacker {
  private isAttacking: boolean = false;
  private attackInterval: number | null = null;
  private originalStates = new Map<number | string, TabState>();

  constructor(private intervalTime: number = 3000) {}

  public async startAttack(): Promise<void> {
    this.isAttacking = true;
    this.attackInterval = window.setInterval(() => this.attackTabs(), this.intervalTime);
    await this.attackTabs(); // Initial attack
    logger.info('Attack started');
  }

  public stopAttack(): void {
    this.isAttacking = false;
    if (this.attackInterval) {
      clearInterval(this.attackInterval);
      this.attackInterval = null;
    }
    this.restoreAllTabs();
    logger.info('Attack stopped');
  }

  public isCurrentlyAttacking(): boolean {
    return this.isAttacking;
  }

  protected async attackTabs(): Promise<void> {
    // To be implemented by extension or demo versions
  }

  protected restoreAllTabs(): void {
    // To be implemented by extension or demo versions
  }

  protected storeOriginalState(id: number | string, state: TabState): void {
    if (!this.originalStates.has(id)) {
      this.originalStates.set(id, state);
      logger.debug(`Stored original state for tab ${id}`);
    }
  }

  protected getOriginalState(id: number | string): TabState | undefined {
    return this.originalStates.get(id);
  }

  protected getRandomTitleIcon(): TitleIcon {
    return randomTitleAndIcon();
  }
} 