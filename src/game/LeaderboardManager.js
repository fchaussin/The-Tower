import { auth, db, collection, getDocs, query, orderBy, limit, isFirebaseEnabled, SCORES_COLLECTION, LEADERBOARD_COLLECTION, writeBatch, doc, serverTimestamp } from '../services/firebase.js';

const ICON_GLOBAL = `<svg class="global" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
const ICON_LOCAL = `<svg class="local" width="10" height="10" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><polygon fill="none" stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" points="31,16 31,19 27,19 27,31 21,31 21,19 11,19 11,31 5,31 5,19 1,19 1,16 16,1 21,6 21,1 27,1 27,12"/></svg>`;
const DEFAULT_USERNAME = 'Anonymous';

export class LeaderboardManager {
  constructor(game, uiManager) {
    this.game = game;
    this.uiManager = uiManager;
    this.scoreListEl = document.getElementById('scoreList');
  }

  async updateLeaderboard() {
    if (!this.scoreListEl) return;

    const loader = document.getElementById('scoreLoader');
    if (loader) loader.classList.remove('hidden');
    this.scoreListEl.classList.add('hidden');

    let localScores = (this.game.topScores || []).map(score => ({
      ...score,
      timestampMs: new Date(score.timestamp || 0).getTime(),
      isLocal: true
    }));
    let fbScores = [];
    if (isFirebaseEnabled) {
      try {
        const q = query(collection(db, LEADERBOARD_COLLECTION), orderBy('score', 'desc'), limit(10));
        const querySnapshot = await Promise.race([
          getDocs(q),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
        ]);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let tsMs = 0;
          if (data.timestamp) {
            if (typeof data.timestamp.toMillis === 'function') {
              tsMs = data.timestamp.toMillis();
            } else if (data.timestamp.seconds) {
              tsMs = data.timestamp.seconds * 1000;
            } else {
              tsMs = new Date(data.timestamp).getTime();
            }
          }
          fbScores.push({
            ...data,
            timestampMs: tsMs,
            isFirebase: true
          });
        });
      } catch (e) {
        console.warn("Could not fetch scores from Firebase, falling back to local storage.", e.message);
      }
    }

    let allScores = [...localScores, ...fbScores];
    allScores.sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return a.timestampMs - b.timestampMs;
    });

    const uniqueScores = [];
    const seen = new Set();
    for (const score of allScores) {
      const key = `${score.name}_${score.score}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScores.push(score);
      } else {
        const existing = uniqueScores.find(s => `${s.name}_${s.score}` === key);
        if (existing && score.isFirebase) {
          existing.isFirebase = true;
        }
      }
    }

    let scoresToDisplay = uniqueScores.slice(0, 50);
    if (loader) loader.classList.add('hidden');
    this.scoreListEl.classList.remove('hidden');
    let htmlStr = '';
    scoresToDisplay.forEach((entry, index) => {
      const globeIcon = entry.isFirebase ? ICON_GLOBAL : ICON_LOCAL;
      htmlStr += `<li>
        <span style="display: flex; align-items: center; gap: 5px;">
          ${index + 1}. ${globeIcon} ${entry.name || DEFAULT_USERNAME}
        </span>
        <span>${this.uiManager.formatNumber(entry.score || 0)}</span>
      </li>`;
    });

    this.scoreListEl.innerHTML = htmlStr;
  }

  async saveScore() {
    const clientTimestamp = new Date().toISOString();

    this.game.topScores.push({
      name: this.game.playerName,
      score: this.game.score,
      timestamp: clientTimestamp
    });
    this.game.topScores.sort((a, b) => b.score - a.score);
    this.game.topScores = this.game.topScores.slice(0, 10);
    localStorage.setItem('tower_topScores', JSON.stringify(this.game.topScores));

    if (isFirebaseEnabled) {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("Utilisateur non authentifié");
        const batch = writeBatch(db);
        const scoreRef = doc(collection(db, SCORES_COLLECTION));
        const scoreId = scoreRef.id;
        const leaderboardRef = doc(db, LEADERBOARD_COLLECTION, scoreId);
        const name = String(this.game.playerName);
        const score = Number(this.game.score);
        const ts = serverTimestamp();

        batch.set(scoreRef, {
          name: name,
          score: score,
          level: Number(this.game.level),
          difficulty: String(this.game.difficulty || 'normal'),
          balance: Math.floor(Number(this.game.currency)),
          elapsedTime: Number(this.game.time),
          userId: userId,
          timestamp: ts,
          client_timestamp: clientTimestamp,
          towerStats: {
            damage: Number(this.game.tower.damage) || 0,
            cooldown: Number(this.game.tower.cooldown) || 0,
            range: Number(this.game.tower.range) || 0,
            projectileSpeed: Number(this.game.tower.projectileSpeed) || 0,
            splashRadius: Number(this.game.tower.splashRadius) || 0,
            lightningCount: Number(this.game.tower.lightningCount) || 0,
            lightningRange: Number(this.game.tower.lightningRange) || 0,
            poisonDamage: Number(this.game.tower.poisonDamage) || 0,
            poisonDuration: Number(this.game.tower.poisonDuration) || 0,
            slowIntensity: Number(this.game.tower.slowIntensity) || 0,
            slowDuration: Number(this.game.tower.slowDuration) || 0
          },
          upgrades: this.game.upgrades ? this.game.upgrades.map(u => ({ id: u.id, level: u.level })) : []
        });

        batch.set(leaderboardRef, {
          name: name,
          score: score,
          timestamp: ts
        });

        await batch.commit();

      } catch (e) {
        console.warn("Could not save score to Firebase, saved locally.", e.message);
      }
    }

    this.updateLeaderboard();
  }
}
