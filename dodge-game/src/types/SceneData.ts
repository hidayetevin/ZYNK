// Scene Data Interfaces

import { Theme } from './GameTypes';

export interface GameSceneData {
    theme: Theme;
    isFirstGame?: boolean;
}

export interface ResultSceneData {
    score: number;
    stars: number;
    isNewHighScore: boolean;
    obstaclesDodged: number;
    powerupsCollected: number;
}
