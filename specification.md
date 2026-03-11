# Idle Tower Defense - Detailed Specifications

## 1. Overview
**Idle Tower Defense** is a minimalist, infinite-scaling browser game built with HTML5 Canvas and Vanilla JavaScript. The player controls a central tower defending against endless waves of geometric enemies. The game focuses on exponential mathematical scaling, strategic upgrade paths, and global competition.

**Author:** François Chaussin

---

## 2. Core Gameplay Mechanics

### 2.1. The Arena
*   **Layout:** The player's tower is situated in the exact center of the screen.
*   **Spawning:** Enemies spawn just outside the visible boundaries of the canvas and travel linearly toward the central tower.
*   **Responsiveness:** The canvas dynamically resizes to fit the browser window. Spawn distances adjust automatically to ensure enemies always appear off-screen regardless of the device's aspect ratio.

### 2.2. Progression Loop
*   **Levels & Waves:** The game is divided into infinite levels. Each level consists of multiple waves of enemies.
*   **Infinite Scaling:** There is no hard cap on levels. Enemy health, speed, and spawn counts scale mathematically (exponentially and linearly) as the level increases.
*   **Victory Condition:** Survive the current level to progress to the next.
*   **Defeat Condition:** If an enemy collides with the central tower, the player loses a life.

### 2.3. Life & Snapshot System
*   **Lives:** The player starts with 3 lives.
*   **Snapshots:** At the beginning of every level, the game creates a "snapshot" of the player's current state (currency, upgrade levels, score).
*   **Penalty:** When a life is lost, the player is presented with a "Life Lost" menu. They can choose to retry the level, which rolls back their state to the exact snapshot taken at the start of that level, effectively wiping any progress or mistakes made during the failed attempt.

### 2.4. Economy
*   **Currency ($):** Earned by destroying enemies.
*   **Reward Calculation:** The base reward is proportional to the enemy's maximum health.
*   **Multipliers:** The final reward is modified by the selected Difficulty Level.

---

## 3. Upgrade System (Tower Features)

The player can spend currency to upgrade 8 distinct tower statistics. Costs and power levels scale exponentially to keep pace with infinite enemy scaling.

1.  **Damage:** Increases the base damage dealt by each projectile.
2.  **Cooldown:** Decreases the time between shots. Includes a diminishing returns formula to prevent the fire rate from reaching zero or breaking the game loop.
3.  **Speed:** Increases the travel velocity of projectiles.
4.  **Range:** Expands the radial targeting zone of the tower. Enemies outside this zone are ignored.
5.  **Splash:** Projectiles deal Area of Effect (AoE) damage upon hitting a target. Features linear distance falloff (enemies further from the epicenter take less damage) and dynamic visual opacity.
6.  **Lightning:** Projectiles chain-bounce to nearby enemies after the initial impact. Features damage reduction per bounce, a slight delay between bounces for visual satisfaction, and an upgradeable bounce detection radius.
7.  **Poison:** Applies a Damage Over Time (DoT) effect to struck enemies. Upgrades increase both the tick damage and the duration of the poison.
8.  **Slow:** Applies a chilling effect that reduces enemy movement speed. Upgrades increase the intensity of the slow and its duration.

---

## 4. Difficulty Settings

Players select a difficulty before starting a run. This choice is locked for the duration of the game and is recorded on the leaderboard.

*   **Easy (Relaxed):** 
    *   Enemy Health/Speed: Reduced.
    *   Score & Currency Multiplier: `0.5x`
*   **Medium (Standard):** 
    *   Enemy Health/Speed: Baseline.
    *   Score & Currency Multiplier: `1.0x`
*   **Hard (Challenge):** 
    *   Enemy Health/Speed: Increased.
    *   Score & Currency Multiplier: `1.5x`

---

## 5. Enemy System

*   **Variety:** 57 distinct enemy types, varying in shape, size, base speed, base health, and behavior (e.g., swarmers, tanks, splitters, bosses).
*   **Spawning Logic:** Enemies are introduced progressively. As levels increase, the game loops through the enemy roster, applying heavy scaling multipliers to their base stats.

---

## 6. Leaderboard & Authentication

*   **Local Scores:** High scores are saved locally in the browser's `localStorage` for offline play or unauthenticated users.
*   **Global Scores:** Requires Google Authentication.
*   **Tracked Metrics:** The leaderboard records:
    *   Player Name
    *   Final Score
    *   Highest Level Reached
    *   Difficulty Chosen
    *   Detailed Tower Stats (The exact level of all 8 upgrades at the time of death, allowing players to compare build strategies).

---

## 7. Technical Stack

*   **Frontend:** HTML5 Canvas API, Vanilla JavaScript (ES6+), CSS3.
*   **Backend / BaaS:** Firebase (Authentication via Google, Firestore for the global leaderboard).
*   **Build Tool:** Vite.
*   **Architecture:** Object-Oriented Programming (OOP) with distinct managers for Game State, UI, Rendering, Audio, and Entities.

---

## 8. Developer Tools

*   **Headless Simulator:** Accessible via the browser console (`window.runSimulation(targetLevel)`). Allows developers to run the game logic without rendering graphics to quickly test high-level balancing, verify exponential scaling curves, and simulate auto-buying strategies.
