# Idle Tower Defense

A minimalist, highly addictive browser-based tower defense game built with HTML5 Canvas and vanilla JavaScript. Defend your central tower against endless waves of increasingly difficult geometric enemies!

## Features

*   **Endless Gameplay:** Survive as long as you can through progressively harder levels.
*   **Difficulty Settings:** Choose between **Easy**, **Medium**, and **Hard** modes. Difficulty affects enemy health, speed, count, and currency bonuses.
*   **8 Upgradeable Stats:**
    *   **Damage:** Increase the power of your projectiles.
    *   **Cooldown:** Shoot faster (with diminishing returns protection).
    *   **Speed:** Projectiles travel faster.
    *   **Range:** Increase your tower's targeting radius.
    *   **Splash:** Projectiles deal area-of-effect damage on impact (with linear distance falloff).
    *   **Chain:** Projectiles bounce between multiple enemies (with damage reduction per bounce).
    *   **Poison:** Apply damage-over-time to enemies.
    *   **Slow:** Reduce enemy movement speed with ice effects.
*   **50+ Enemy Types:** A huge variety of enemies with different shapes, sizes, speeds, and health pools, including swarmers, tanks, splitters, and giant bosses.
*   **Global Leaderboard:** Compete with players worldwide! Features Google Authentication via Firebase to save your high scores securely.
*   **Responsive Design:** Playable on desktop and mobile devices. The game automatically scales to fit your screen.
*   **Visual & Audio Effects:** Satisfying particle effects, screen shake, screen flashes, and retro-style synthesized sound effects. Includes level indicators on upgrade icons and a real-time wave counter (Wave X/Y) for easy tracking.
*   **Life & Snapshot System:** You have 3 lives. The game takes a "snapshot" of your tower and currency at the start of each level. If an enemy reaches the tower, you can retry the level, restoring your tower to its exact state at the level's start with a 50% penalty on gains from that attempt.
*   **Auto-Pause:** The game automatically pauses when you switch tabs or minimize the window.

## How to Play

1.  **Defend the Tower:** Enemies will spawn from the edges of the screen and move towards your tower in the center.
2.  **Earn Money:** Destroy enemies to earn currency (`$`).
3.  **Upgrade:** Click/tap the upgrade buttons at the bottom of the screen to improve your tower's stats. Level indicators show your progress, and the Wave Counter (Wave X/Y) shows your progress within the level.
4.  **Survive:** You have 3 lives. If an enemy reaches the tower, you lose a life and can retry the level or quit. Retrying restores your tower and currency to the state they were in at the start of the level.
5.  **Manage Penalties:** Retrying a level costs 50% of the currency and score earned during that specific level attempt (deducted from your restored snapshot).

## Technologies Used

*   **Frontend:** HTML5 Canvas, Vanilla JavaScript (ES6+), CSS3.
*   **Backend/Database:** Firebase (Authentication, Firestore) for global leaderboards.
*   **Build Tool:** Vite.

## Local Development

To run the game locally:

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to the local URL provided by Vite (usually `http://localhost:3000`).

### Firebase Setup (Optional)

If you want to test the global leaderboard functionality locally, you will need to set up your own Firebase project:

1.  Create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Authentication** (Google Sign-In provider).
3.  Enable **Firestore Database**.
4.  Create a `.env` file in the root directory based on `.env.example` and fill in your Firebase configuration values.

## Project Structure

*   `index.html`: The main entry point and UI layout.
*   `src/main.js`: Initializes the game.
*   `src/game/`: Contains all the game logic.
    *   `Game.js`: The core game loop and state management.
    *   `GameStates.js`: Defines the possible states of the game (MENU, PLAYING, PAUSED, etc.).
    *   `Tower.js`: Logic for the player's tower (targeting, shooting).
    *   `Renderer.js`: Handles all Canvas drawing operations.
    *   `UIManager.js`: Manages the HTML/CSS UI overlays (menus, leaderboards).
    *   `ModalManager.js`: Handles the display and hiding of HTML `<dialog>` modals.
    *   `LeaderboardManager.js`: Manages fetching, sorting, and saving scores locally and to Firebase.
    *   `IconRenderer.js`: Handles rendering the tower feature icons onto canvas elements.
    *   `AudioManager.js`: Synthesizes sound effects using the Web Audio API.
    *   `Levels.js`: Defines the enemy spawn patterns for each level.
    *   `Projectile.js`: Logic for the player's bullets.
    *   `enemies/`: Contains classes for all the different enemy types.
    *   `features/`: Contains classes for the different tower upgrades.

## License

MIT License
