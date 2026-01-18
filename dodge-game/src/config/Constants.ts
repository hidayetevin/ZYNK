// Game Configuration Constants

export const GAME_WIDTH = 375;
export const GAME_HEIGHT = 667;

// Player
export const PLAYER_SPEED = 300;
export const PLAYER_SIZE = 40;

// Obstacles
export const BASE_OBSTACLE_SPEED = 200;
export const MIN_SPAWN_DELAY = 300; // milliseconds
export const MAX_SPAWN_DELAY = 1500; // milliseconds
export const MAX_ACTIVE_OBSTACLES = 20;

// Power-ups
export const POWERUP_SPAWN_INTERVAL = 15000; // 15 seconds
export const SHIELD_DURATION = 5000; // 5 seconds
export const SLOWMO_DURATION = 5000; // 5 seconds
export const SLOWMO_SCALE = 0.5; // 50% slower
export const DOUBLE_SCORE_DURATION = 10000; // 10 seconds

// Star System
export const STAR_THRESHOLDS = {
    ONE_STAR: 10, // seconds
    TWO_STAR: 20,
    THREE_STAR: 40,
};

// Theme System
export const THEME_UNLOCK_COSTS = [
    0, // Classic - free
    5, // Ocean - 5 stars
    10, // Sunset - 10 stars
    15, // Forest - 15 stars
    20, // Neon - 20 stars
];

// Colors
export const COLORS = {
    DARK_MODE: {
        background: '#1a1a2e',
        text: '#ffffff',
        accent: '#00ff88',
    },
    LIGHT_MODE: {
        background: '#f0f0f0',
        text: '#000000',
        accent: '#00cc66',
    },
};
