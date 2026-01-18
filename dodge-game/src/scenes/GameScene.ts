import Phaser from 'phaser';
import Player from '@entities/Player';
import Obstacle from '@entities/Obstacle';
import PowerUpEntity from '@entities/PowerUp';
import PowerUpSpawner from '@systems/PowerUpSpawner';
import type { GameSceneData } from '../types/SceneData';
import type { Theme, PowerUp, ObstacleType } from '../types/GameTypes';
import { GAME_WIDTH, GAME_HEIGHT, STAR_THRESHOLDS } from '@config/Constants';
import StorageManager from '@systems/StorageManager';

/**
 * GameScene - Main gameplay scene
 * Handles player movement, obstacles, power-ups, and collision
 */
export default class GameScene extends Phaser.Scene {
    private player!: Player;
    private obstacles!: Phaser.GameObjects.Group;
    private powerUps!: Phaser.GameObjects.Group;
    private powerUpSpawner!: PowerUpSpawner;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    private gameTime: number = 0;
    private isGameOver: boolean = false;
    private score: number = 0;
    private theme!: Theme;

    // Obstacle spawning
    private spawnTimer: number = 0;
    private nextSpawnDelay: number = 1500;

    // UI elements
    private timeText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;

    // Touch input
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private isTouching: boolean = false;

    // Active power-up effects
    private activePowerUps: PowerUp[] = [];
    private scoreMultiplier: number = 1;

    // Stats
    private obstaclesDodged: number = 0;
    private powerupsCollected: number = 0;

    constructor() {
        super({ key: 'Game' });
    }

    /**
     * Initialize with theme data
     */
    init(data: GameSceneData): void {
        this.theme = data.theme;
        this.gameTime = 0;
        this.isGameOver = false;
        this.score = 0;
        this.spawnTimer = 0;
        this.obstaclesDodged = 0;
        this.powerupsCollected = 0;
        this.activePowerUps = [];
        this.scoreMultiplier = 1;
    }

    /**
     * Create game objects and setup
     */
    create(): void {
        // Set background color
        this.cameras.main.setBackgroundColor(this.theme.colors.bg);

        // Create placeholder textures
        Obstacle.createPlaceholderTextures(this);
        PowerUpEntity.createPlaceholderTextures(this);

        // Create player at bottom center
        this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 100);

        // Create obstacles group (object pooling)
        this.obstacles = this.add.group({
            classType: Obstacle,
            maxSize: 20,
            runChildUpdate: true,
        });

        // Create power-ups group
        this.powerUps = this.add.group({
            classType: PowerUpEntity,
            maxSize: 5,
            runChildUpdate: false,
        });

        // Create power-up spawner
        this.powerUpSpawner = new PowerUpSpawner(this, this.powerUps);

        // Setup input
        this.setupInput();

        // Create UI
        this.createUI();

        // Start game loop
        this.time.addEvent({
            delay: 100,
            callback: this.updateGameTime,
            callbackScope: this,
            loop: true,
        });
    }

    /**
     * Setup keyboard and touch input
     */
    private setupInput(): void {
        // Keyboard
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        // Touch/Mouse input
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);
    }

    /**
     * Create UI elements
     */
    private createUI(): void {
        // Time display
        this.timeText = this.add
            .text(GAME_WIDTH / 2, 40, 'Time: 0.0s', {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff',
            })
            .setOrigin(0.5);

        // Score (obstacles dodged)
        this.scoreText = this.add
            .text(20, 20, 'Score: 0', {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
            })
            .setOrigin(0, 0);
    }

    /**
     * Main update loop
     */
    update(time: number, delta: number): void {
        if (this.isGameOver) return;

        // Handle player input
        this.handlePlayerMovement();

        // Update obstacles
        this.updateObstacles(delta);

        // Spawn obstacles
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.nextSpawnDelay) {
            this.spawnObstacle();
            this.spawnTimer = 0;
            this.calculateNextSpawnDelay();
        }

        // Update power-up spawner
        this.powerUpSpawner.update(delta);

        // Update power-up effects
        this.updatePowerUpEffects(delta);

        // Check power-up collisions
        this.checkPowerUpCollisions();

        // Check collisions
        this.checkCollisions();

        // Update shield visual
        this.player.updateShield();

        // Update UI
        this.updateUI();
    }

    /**
     * Handle player movement from keyboard or touch
     */
    private handlePlayerMovement(): void {
        let dirX = 0;
        let dirY = 0;

        // Keyboard input
        if (this.cursors) {
            if (this.cursors.left.isDown) dirX = -1;
            if (this.cursors.right.isDown) dirX = 1;
            if (this.cursors.up.isDown) dirY = -1;
            if (this.cursors.down.isDown) dirY = 1;
        }

        // Touch input (if active)
        if (this.isTouching) {
            const pointer = this.input.activePointer;
            const playerX = this.player.x;
            const playerY = this.player.y;

            dirX = pointer.x - playerX;
            dirY = pointer.y - playerY;

            // Normalize
            const dist = Math.sqrt(dirX * dirX + dirY * dirY);
            if (dist > 20) {
                dirX /= dist;
                dirY /= dist;
            } else {
                dirX = 0;
                dirY = 0;
            }
        }

        // Apply movement
        if (dirX !== 0 || dirY !== 0) {
            this.player.move(dirX, dirY);
        } else {
            this.player.stop();
        }
    }

    /**
     * Update all obstacles
     */
    private updateObstacles(delta: number): void {
        this.obstacles.getChildren().forEach(child => {
            const obstacle = child as Obstacle;
            obstacle.update(delta);
        });
    }

    /**
     * Spawn a new obstacle
     */
    private spawnObstacle(): void {
        // Get or create obstacle from pool
        let obstacle = this.obstacles.getFirstDead(false) as Obstacle;

        if (!obstacle) {
            obstacle = new Obstacle(this, 0, 0);
            this.obstacles.add(obstacle);
        }

        // Random spawn position (from any edge)
        const edge = Phaser.Math.Between(0, 3); // 0=top, 1=right, 2=bottom, 3=left
        let x = 0,
            y = 0,
            direction = 0;

        switch (edge) {
            case 0: // Top
                x = Phaser.Math.Between(0, GAME_WIDTH);
                y = -50;
                direction = Phaser.Math.Between(45, 135); // Downward
                break;
            case 1: // Right
                x = GAME_WIDTH + 50;
                y = Phaser.Math.Between(0, GAME_HEIGHT);
                direction = Phaser.Math.Between(135, 225); // Leftward
                break;
            case 2: // Bottom
                x = Phaser.Math.Between(0, GAME_WIDTH);
                y = GAME_HEIGHT + 50;
                direction = Phaser.Math.Between(225, 315); // Upward
                break;
            case 3: // Left
                x = -50;
                y = Phaser.Math.Between(0, GAME_HEIGHT);
                direction = Phaser.Math.Between(-45, 45); // Rightward
                break;
        }

        // Calculate speed based on game time
        const baseSpeed = 200;
        const speed = baseSpeed + this.gameTime * 2;

        // Random obstacle type
        const types: ObstacleType[] = ['meteor', 'spike', 'electric'];
        const type = Phaser.Utils.Array.GetRandom(types) as ObstacleType;

        obstacle.reset(x, y, speed, direction, type);
    }

    /**
     * Calculate next spawn delay based on difficulty
     */
    private calculateNextSpawnDelay(): void {
        const maxDelay = 1500;
        const minDelay = 300;
        this.nextSpawnDelay = Math.max(minDelay, maxDelay - this.gameTime * 10);
    }

    /**
     * Check collisions
     */
    private checkCollisions(): void {
        this.obstacles.getChildren().forEach(child => {
            const obstacle = child as Obstacle;
            if (!obstacle.active) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                obstacle.x,
                obstacle.y
            );

            if (distance < 40) {
                // Collision!
                if (this.player.getHasShield()) {
                    // Shield absorbs hit
                    this.player.deactivateShield();
                    obstacle.deactivate();
                    this.obstaclesDodged++;
                } else {
                    // Game over
                    this.gameOver();
                }
            }
        });
    }

    /**
     * Check power-up collisions with player
     */
    private checkPowerUpCollisions(): void {
        this.powerUps.getChildren().forEach(child => {
            const powerUp = child as PowerUpEntity;
            if (!powerUp.active) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                powerUp.x,
                powerUp.y
            );

            if (distance < 50) {
                // Collect power-up!
                this.collectPowerUp(powerUp);
            }
        });
    }

    /**
     * Collect power-up and activate effect
     */
    private collectPowerUp(powerUp: PowerUpEntity): void {
        const type = powerUp.getPowerUpType();

        // Play collection animation
        powerUp.collect();

        // Increment counter
        this.powerupsCollected++;

        // Activate power-up effect
        this.activatePowerUp(type);
    }

    /**
     * Activate power-up effect
     */
    private activatePowerUp(type: 'shield' | 'slowmo' | 'double_score'): void {
        const duration = type === 'double_score' ? 10000 : 5000; // ms
        const powerUp: PowerUp = {
            type,
            active: true,
            duration,
            timeRemaining: duration,
        };

        switch (type) {
            case 'shield':
                this.player.activateShield();
                break;
            case 'slowmo':
                this.physics.world.timeScale = 0.5;
                break;
            case 'double_score':
                this.scoreMultiplier = 2;
                break;
        }

        this.activePowerUps.push(powerUp);
    }

    /**
     * Update active power-up effects timers
     */
    private updatePowerUpEffects(delta: number): void {
        this.activePowerUps = this.activePowerUps.filter(powerUp => {
            powerUp.timeRemaining -= delta;

            if (powerUp.timeRemaining <= 0) {
                this.deactivatePowerUp(powerUp);
                return false;
            }
            return true;
        });
    }

    /**
     * Deactivate power-up effect
     */
    private deactivatePowerUp(powerUp: PowerUp): void {
        switch (powerUp.type) {
            case 'shield':
                this.player.deactivateShield();
                break;
            case 'slowmo':
                this.physics.world.timeScale = 1.0;
                break;
            case 'double_score':
                this.scoreMultiplier = 1;
                break;
        }
    }

    /**
     * Update game time
     */
    private updateGameTime(): void {
        if (!this.isGameOver) {
            this.gameTime += 0.1;
            this.score = Math.floor(this.gameTime);
        }
    }

    /**
     * Update UI texts
     */
    private updateUI(): void {
        this.timeText.setText(`Time: ${this.gameTime.toFixed(1)}s`);
        this.scoreText.setText(`Dodged: ${this.obstaclesDodged}`);
    }

    /**
   * Game over logic
   */
    private gameOver(): void {
        this.isGameOver = true;

        // Stop player
        this.player.stop();

        // Calculate stars
        const stars = this.calculateStars();

        // Check if new high score
        const storage = StorageManager.getInstance();
        const isNewHighScore = storage.updateHighScore(this.score);

        // Add stars
        storage.addStars(stars);
        storage.incrementGamesPlayed();

        // Transition to ResultScene with data
        this.time.delayedCall(500, () => {
            this.scene.start('Result', {
                score: this.gameTime,
                stars,
                isNewHighScore,
                obstaclesDodged: this.obstaclesDodged,
                powerupsCollected: this.powerupsCollected,
            });
        });
    }

    /**
     * Calculate stars earned
     */
    private calculateStars(): number {
        const time = this.gameTime;
        if (time >= STAR_THRESHOLDS.THREE_STAR) return 3;
        if (time >= STAR_THRESHOLDS.TWO_STAR) return 2;
        if (time >= STAR_THRESHOLDS.ONE_STAR) return 1;
        return 0;
    }

    /**
     * Touch input handlers
     */
    private onPointerDown(pointer: Phaser.Input.Pointer): void {
        this.isTouching = true;
        this.touchStartX = pointer.x;
        this.touchStartY = pointer.y;
    }

    private onPointerMove(pointer: Phaser.Input.Pointer): void {
        // Movement is handled in handlePlayerMovement
    }

    private onPointerUp(pointer: Phaser.Input.Pointer): void {
        this.isTouching = false;
        this.player.stop();
    }
}
