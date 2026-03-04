import { db, LEADERBOARD_COLLECTION, onSnapshot, query, collection, orderBy, limit, isFirebaseEnabled } from '../services/firebase.js';

export class NotificationManager {
  constructor(game) {
    this.game = game;
    this.top10Ids = new Set();
    this.isInitialized = false;
    this.permissionGranted = false;
  }

  async init() {
    if (!isFirebaseEnabled) return;
    this.setupLeaderboardListener();
  }

  async requestPermission() {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permissionGranted = (permission === 'granted');
      return this.permissionGranted;
    }
    
    return false;
  }

  setupLeaderboardListener() {
    const q = query(
      collection(db, LEADERBOARD_COLLECTION),
      orderBy('score', 'desc'),
      limit(10)
    );

    onSnapshot(q, (snapshot) => {
      const currentTop10 = [];
      snapshot.forEach((doc) => {
        currentTop10.push({ id: doc.id, ...doc.data() });
      });

      if (!this.isInitialized) {
        // First load: just store the current IDs
        currentTop10.forEach(entry => this.top10Ids.add(entry.id));
        this.isInitialized = true;
        return;
      }

      // Check for new entries
      for (const entry of currentTop10) {
        if (!this.top10Ids.has(entry.id)) {
          this.notifyNewTopScore(entry);
          this.top10Ids.add(entry.id);
        }
      }

      // Update the set to only contain the current top 10
      const newIds = new Set(currentTop10.map(e => e.id));
      this.top10Ids = newIds;
    }, (error) => {
      console.error("Leaderboard listener error:", error);
    });
  }

  notifyNewTopScore(entry) {
    const title = "New Top 10 Score!";
    const body = `${entry.name || 'Anonymous'} just reached the Top 10 with ${entry.score.toLocaleString()} points!`;
    const icon = '/favicon.ico'; // Fallback icon

    // 1. Show browser notification if permission granted
    if (this.permissionGranted && document.visibilityState !== 'visible') {
      new Notification(title, { body, icon });
    }

    // 2. Also show an in-game toast/message if the game is running
    this.showInGameToast(body);
  }

  showInGameToast(message) {
    // Create a simple toast element
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="background: #f0f; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px #f0f;"></div>
        <span>${message}</span>
      </div>
    `;
    
    // Style it
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '30px',
      border: '1px solid #f0f',
      zIndex: '9999',
      fontFamily: 'monospace',
      fontSize: '12px',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    });

    // Remove after 5 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%)';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}
