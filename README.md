# Idle Tower Defense

A minimalist, highly addictive browser-based tower defense game built with HTML5 Canvas and vanilla JavaScript. Defend your central tower against endless waves of increasingly difficult geometric enemies!

## Features

*   **Infinite Mathematical Scaling:** The game features a true infinite progression system. Enemy health and speed scale exponentially and linearly across levels, ensuring the game remains challenging forever.
*   **Difficulty Settings:** Choose between **Easy**, **Medium**, and **Hard** modes. Difficulty affects enemy health, speed, count, and rewards. Hard mode yields a 1.5x multiplier to score and currency, while Easy mode yields a 0.5x multiplier. The chosen difficulty is recorded on the global leaderboard.
*   **8 Upgradeable Stats (Exponential Scaling):** Upgrades use an exponential cost and power formula to keep pace with infinite enemy scaling.
    *   **Damage:** Increase the power of your projectiles.
    *   **Cooldown:** Shoot faster (with diminishing returns protection).
    *   **Speed:** Projectiles travel faster.
    *   **Range:** Increase your tower's targeting radius.
    *   **Splash:** Projectiles deal area-of-effect damage on impact (with linear distance falloff and dynamic visual opacity based on remaining intensity).
    *   **Lightning:** Projectiles bounce between multiple enemies (with damage reduction, a satisfying cascading delay per bounce, and upgradeable bounce range).
    *   **Poison:** Apply damage-over-time to enemies (with upgradeable duration and damage).
    *   **Slow:** Reduce enemy movement speed with ice effects (with upgradeable intensity and duration).
*   **57 Distinct Enemy Types:** A huge variety of enemies with different shapes, sizes, speeds, and health pools, including swarmers, tanks, splitters, and giant bosses. Enemies are introduced progressively and loop with increased difficulty.
*   **Headless Simulator Mode:** Built-in developer tool to run the game without rendering (`window.runSimulation(targetLevel)`) to test balancing, auto-buy upgrades, and simulate high-level gameplay in seconds.
*   **Global Leaderboard:** Compete with players worldwide! Features Google Authentication via Firebase to save your high scores securely. The leaderboard now tracks your detailed tower stats, purchased upgrades, and difficulty level to showcase your specific build strategy!
*   **Responsive Design:** Playable on desktop and mobile devices. The game automatically scales to fit your screen, and enemies spawn precisely outside the visible area.
*   **Visual & Audio Effects:** Satisfying particle effects, screen shake, screen flashes, and retro-style synthesized sound effects. Includes level indicators on upgrade icons and a real-time wave counter (Wave X/Y) for easy tracking.
*   **Life & Snapshot System:** You have 3 lives. The game takes a "snapshot" of your tower and currency at the start of each level. If an enemy reaches the tower, you can retry the level, restoring your tower to its exact state at the level's start.
*   **Auto-Pause:** The game automatically pauses when you switch tabs or minimize the window.

## How to Play

1.  **Defend the Tower:** Enemies will spawn from just outside the edges of the screen and move towards your tower in the center.
2.  **Earn Money:** Destroy enemies to earn currency (`$`). The reward scales with the enemy's maximum health.
3.  **Upgrade:** Click/tap the upgrade buttons at the bottom of the screen to improve your tower's stats. Level indicators show your progress, and the Wave Counter (Wave X/Y) shows your progress within the level.
4.  **Survive:** You have 3 lives. If an enemy reaches the tower, you lose a life and can retry the level or quit. Retrying restores your tower and currency to the state they were in at the start of the level.

## Developer Tools

### Headless Simulator
To test game balancing at high levels without playing manually:
1. Open the browser's Developer Console (F12).
2. Run `runSimulation(targetLevel)` (e.g., `runSimulation(100)`).
3. The game will run at maximum speed without rendering, auto-buying upgrades based on a priority list, and output a detailed report of the run in the console.

## Technologies Used

*   **Frontend:** HTML5 Canvas, Vanilla JavaScript (ES6+), CSS3.
*   **Backend/Database:** Firebase (Authentication, Firestore) for global leaderboards.
*   **Build Tool:** Vite.
*   **PWA:** Custom Service Worker and Web App Manifest for offline support.

## Progressive Web App (PWA)

The game is fully playable offline as a Progressive Web App. The implementation relies on:
*   **Web App Manifest:** A `manifest.json` file in the `public/` directory defines the app's name, icons, theme colors, and display mode (`standalone`), allowing it to be installed on mobile and desktop devices.
*   **Service Worker:** A custom service worker (`public/sw.js`) intercepts network requests.
    *   **Caching Strategy:** It attempts to fetch from the network and falls back to the cache if offline. During the `install` phase, it pre-caches core assets (`/`, `/index.html`, `/manifest.json`, `/icon.svg`).
    *   **Offline Play:** Once the assets are cached, the game can be loaded and played entirely without an internet connection. Local scores will still be saved to `localStorage`.
    *   **Push Notifications:** The service worker also includes basic event listeners for push notifications.

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
    *   `Simulator.js`: Headless simulation logic for balancing tests.
    *   `GameStates.js`: Defines the possible states of the game (MENU, PLAYING, PAUSED, etc.).
    *   `Tower.js`: Logic for the player's tower (targeting, shooting).
    *   `Renderer.js`: Handles all Canvas drawing operations.
    *   `UIManager.js`: Manages the HTML/CSS UI overlays (menus, leaderboards).
    *   `ModalManager.js`: Handles the display and hiding of HTML `<div>` modals.
    *   `LeaderboardManager.js`: Manages fetching, sorting, and saving scores locally and to Firebase.
    *   `IconRenderer.js`: Handles rendering the tower feature icons onto canvas elements.
    *   `AudioManager.js`: Synthesizes sound effects using the Web Audio API.
    *   `Levels.js`: Defines the enemy spawn patterns, wave building, and difficulty scaling.
    *   `Projectile.js`: Logic for the player's bullets.
    *   `enemies/`: Contains classes for all 57 distinct enemy types.
    *   `features/`: Contains classes for the different tower upgrades.

## Author

Created by **François Chaussin**.

## License

MIT License
