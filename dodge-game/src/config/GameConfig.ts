import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from './Constants';
import BootScene from '@scenes/BootScene';
import MenuScene from '@scenes/MenuScene';
import GameScene from '@scenes/GameScene';
import ResultScene from '@scenes/ResultScene';
import SettingsScene from '@scenes/SettingsScene';

// All scenes imported and ready

const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top-down game, no gravity
            debug: false, // Set to true for development
        },
    },

    scene: [
        BootScene,
        MenuScene,
        GameScene,
        ResultScene,
        SettingsScene,
    ],

    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        transparent: false,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
        failIfMajorPerformanceCaveat: false,
    },

    fps: {
        target: 60,
        forceSetTimeOut: false,
    },

    // Mobile performance
    disableContextMenu: true,
    autoFocus: true,

    // DOM container
    dom: {
        createContainer: false,
    },
};

export default gameConfig;
