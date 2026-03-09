export class ModalManager {
  constructor() {
    this.currentModal = null;
    this.modals = {
      mainMenu: document.getElementById('main-menu'),
      gameOver: document.getElementById('game-over-menu'),
      lifeLost: document.getElementById('life-lost-menu'),
      helpMenu: document.getElementById('help-menu'),
      towerFeatures: document.getElementById('tower-features-modal'),
      scoring: document.getElementById('scoring-modal'),
      pause: document.getElementById('pause-menu'),
      confirm: document.getElementById('confirm-modal')
    };
    this.backdrop = document.getElementById('menu-backdrop');
  }

  showModal(modalName) {
    this.closeAllModals(true);
    this.currentModal = modalName;
    const modalEl = this.modals[modalName];
    if (modalEl) {
      modalEl.style.pointerEvents = 'auto';
      modalEl.setAttribute('open', '');
    }
    if (this.backdrop) {
      this.backdrop.classList.remove('hidden');
    }
  }

  closeAllModals(keepBackdrop = false) {
    this.currentModal = null;
    Object.values(this.modals).forEach(m => {
      if (m && m.hasAttribute('open')) {
        m.style.pointerEvents = 'none';
        m.removeAttribute('open');
      }
    });
    if (this.backdrop && !keepBackdrop) {
      this.backdrop.classList.add('hidden');
    }
  }
}
