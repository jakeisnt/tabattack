/// <reference types="chrome"/>

// Augment the Window interface if needed
declare interface Window {
  chrome: typeof chrome;
}

// Re-export existing types
export interface TitleIcon {
  title: string;
  icon: string;
}

export interface TabState {
  title: string;
  icon: string;
}

export type TitleCategory = 'youtube' | 'twitch' | 'funny';

export interface StorageState {
  isAttacking: boolean;
  loggerConfig?: {
    level: string;
    enabled: boolean;
  };
} 