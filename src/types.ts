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
    enabled: boolean;
    minLevel: LogLevel;
  };
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'; 